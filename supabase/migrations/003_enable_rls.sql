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