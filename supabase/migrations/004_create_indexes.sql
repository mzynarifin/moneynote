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