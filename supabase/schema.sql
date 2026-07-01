-- Jalankan di Supabase Dashboard > SQL Editor

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  amount numeric not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  note text,
  date date not null,
  created_at timestamp with time zone default now()
);

-- Aktifkan Row Level Security supaya user hanya bisa akses data miliknya sendiri
alter table transactions enable row level security;

create policy "Users can view their own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

-- Index untuk mempercepat query filter tanggal/kategori
create index transactions_user_date_idx on transactions (user_id, date desc);
create index transactions_user_category_idx on transactions (user_id, category);
