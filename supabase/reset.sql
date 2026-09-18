-- ============================================================
-- RESET + CREATE ALL (run once in SQL Editor)
-- Drops anything from previous partial runs, then rebuilds.
-- ============================================================

drop table if exists public.transactions cascade;
drop table if exists public.profiles cascade;
drop function if exists public.create_expense(text, numeric, date) cascade;
drop function if exists public.update_transaction(uuid, text, numeric, date) cascade;
drop function if exists public.delete_transaction(uuid) cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_updated_at() cascade;

-- ========== 001_create_profiles.sql ==========

-- ============================================================
-- 001_create_profiles.sql
-- profiles: application-side user data (name used in UI)
-- ============================================================

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ========== 002_create_transactions.sql ==========

-- ============================================================
-- 002_create_transactions.sql
-- Single ledger table for income & expense.
-- Balance is always derived: SUM(income) - SUM(expense).
-- ============================================================

create table public.transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    type text not null check (type in ('income', 'expense')),
    name text not null,
    amount numeric(14,2) not null check (amount > 0),
    transaction_date date not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ========== 003_enable_rls.sql ==========

-- ============================================================
-- 003_enable_rls.sql
-- Row Level Security for both tables + per-user policies.
-- ============================================================

alter table public.transactions enable row level security;
alter table public.profiles enable row level security;

-- Transactions: users can only touch their own rows.
create policy "Users can view own transactions"
on public.transactions
for select
using (
    auth.uid() = user_id
);

create policy "Users can insert own transactions"
on public.transactions
for insert
with check (
    auth.uid() = user_id
);

create policy "Users can update own transactions"
on public.transactions
for update
using (
    auth.uid() = user_id
)
with check (
    auth.uid() = user_id
);

create policy "Users can delete own transactions"
on public.transactions
for delete
using (
    auth.uid() = user_id
);

-- Profiles: users can view and update their own profile only.
create policy "Users can view own profile"
on public.profiles
for select
using (
    auth.uid() = id
);

create policy "Users can update own profile"
on public.profiles
for update
using (
    auth.uid() = id
)
with check (
    auth.uid() = id
);

-- ========== 004_create_indexes.sql ==========

-- ============================================================
-- 004_create_indexes.sql
-- Performance indexes for common query patterns.
-- ============================================================

create index idx_transactions_user_id
on public.transactions(user_id);

create index idx_transactions_user_date
on public.transactions(user_id, transaction_date desc);

create index idx_transactions_user_type
on public.transactions(user_id, type);

create index idx_transactions_user_type_date
on public.transactions(user_id, type, transaction_date desc);

-- ========== 005_create_functions.sql ==========

-- ============================================================
-- 005_create_functions.sql
-- Balance-guarded mutations run inside PostgreSQL to prevent
-- race conditions between balance check and insert/update/delete.
--
-- Error codes are raised as exception MESSAGE, e.g.:
--   INSUFFICIENT_BALANCE
--   UPDATE_CAUSES_NEGATIVE_BALANCE
--   DELETE_CAUSES_NEGATIVE_BALANCE
--   TRANSACTION_NOT_FOUND
--   INVALID_AMOUNT
-- ============================================================

-- ------------------------------------------------------------
-- updated_at maintenance
-- ------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger set_transactions_updated_at
before update on public.transactions
for each row execute procedure public.set_updated_at();

-- ------------------------------------------------------------
-- Automatic profile creation after auth register
-- ------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, name)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', '')
    );

    return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- create_expense: validates balance inside the DB (no race).
-- ------------------------------------------------------------

create or replace function public.create_expense(
    p_name text,
    p_amount numeric,
    p_transaction_date date
)
returns public.transactions
language plpgsql
security invoker
as $$
declare
    current_balance numeric;
    new_transaction public.transactions;
begin
    if p_amount <= 0 then
        raise exception 'INVALID_AMOUNT';
    end if;

    if trim(p_name) = '' then
        raise exception 'INVALID_INPUT';
    end if;

    select coalesce(sum(
        case
            when type = 'income' then amount
            else -amount
        end
    ), 0)
    into current_balance
    from public.transactions
    where user_id = auth.uid();

    if p_amount > current_balance then
        raise exception 'INSUFFICIENT_BALANCE';
    end if;

    insert into public.transactions (
        user_id,
        type,
        name,
        amount,
        transaction_date
    )
    values (
        auth.uid(),
        'expense',
        trim(p_name),
        p_amount,
        p_transaction_date
    )
    returning * into new_transaction;

    return new_transaction;
end;
$$;

-- ------------------------------------------------------------
-- update_transaction: guards against negative balance.
--   - expense getting larger must stay within available balance
--   - income getting smaller must not drop balance below zero
-- ------------------------------------------------------------

create or replace function public.update_transaction(
    p_id uuid,
    p_name text,
    p_amount numeric,
    p_transaction_date date
)
returns public.transactions
language plpgsql
security invoker
as $$
declare
    old public.transactions;
    current_balance numeric;
    new_row public.transactions;
begin
    if p_amount <= 0 then
        raise exception 'INVALID_AMOUNT';
    end if;

    if trim(p_name) = '' then
        raise exception 'INVALID_INPUT';
    end if;

    select *
    into old
    from public.transactions
    where id = p_id;

    if not found then
        raise exception 'TRANSACTION_NOT_FOUND';
    end if;

    select coalesce(sum(
        case
            when type = 'income' then amount
            else -amount
        end
    ), 0)
    into current_balance
    from public.transactions
    where user_id = auth.uid()
      and id <> p_id;

    if old.type = 'expense' then
        -- available = current balance without this expense, then add it back
        if p_amount > current_balance + old.amount then
            raise exception 'INSUFFICIENT_BALANCE';
        end if;
    else
        -- income shrinks: balance after removing old income and adding new one
        if current_balance + old.amount - p_amount < 0 then
            raise exception 'UPDATE_CAUSES_NEGATIVE_BALANCE';
        end if;
    end if;

    update public.transactions
    set name = trim(p_name),
        amount = p_amount,
        transaction_date = p_transaction_date
    where id = p_id
      and user_id = auth.uid()
    returning * into new_row;

    if not found then
        raise exception 'TRANSACTION_NOT_FOUND';
    end if;

    return new_row;
end;
$$;

-- ------------------------------------------------------------
-- delete_transaction: guards against negative balance when an
-- income row is removed.
-- ------------------------------------------------------------

create or replace function public.delete_transaction(p_id uuid)
returns void
language plpgsql
security invoker
as $$
declare
    old public.transactions;
    current_balance numeric;
begin
    select *
    into old
    from public.transactions
    where id = p_id;

    if not found then
        raise exception 'TRANSACTION_NOT_FOUND';
    end if;

    if old.type = 'income' then
        select coalesce(sum(
            case
                when type = 'income' then amount
                else -amount
            end
        ), 0)
        into current_balance
        from public.transactions
        where user_id = auth.uid()
          and id <> p_id;

        if current_balance < 0 then
            raise exception 'DELETE_CAUSES_NEGATIVE_BALANCE';
        end if;
    end if;

    delete from public.transactions
    where id = p_id
      and user_id = auth.uid();
end;
$$;

