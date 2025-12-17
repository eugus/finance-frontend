-- Create transactions table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  amount numeric not null check (amount > 0),
  category text not null,
  description text not null,
  date timestamptz not null default now(),
  is_credit boolean default false,
  card_name text,
  installments integer,
  current_installment integer,
  installment_group_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for better query performance
create index if not exists idx_transactions_date on public.transactions(date);
create index if not exists idx_transactions_type on public.transactions(type);
create index if not exists idx_transactions_installment_group on public.transactions(installment_group_id);

-- Enable Row Level Security
alter table public.transactions enable row level security;

-- Create policies for public access (sem autenticação por enquanto)
create policy "Allow public to view transactions"
  on public.transactions for select
  using (true);

create policy "Allow public to insert transactions"
  on public.transactions for insert
  with check (true);

create policy "Allow public to update transactions"
  on public.transactions for update
  using (true);

create policy "Allow public to delete transactions"
  on public.transactions for delete
  using (true);

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_transactions_updated_at
  before update on public.transactions
  for each row
  execute function public.update_updated_at_column();
