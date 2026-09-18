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