-- =============================================
-- جدول الغرف - لاقي Multiplayer
-- شغّله في Supabase → SQL Editor
-- =============================================

-- إنشاء جدول الغرف
create table if not exists public.rooms (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  game_type text not null,
  host_nickname text not null,
  status text default 'waiting' check (status in ('waiting', 'playing', 'finished')),
  game_state jsonb default '{}',
  players jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- تفعيل RLS
alter table public.rooms enable row level security;

-- السماح للكل بالقراءة والكتابة (للـ MVP)
create policy "rooms_allow_all" on public.rooms
  for all using (true) with check (true);

-- تفعيل Realtime
alter publication supabase_realtime add table public.rooms;

-- حذف الغرف القديمة تلقائياً بعد ساعتين
create or replace function delete_old_rooms()
returns trigger as $$
begin
  delete from public.rooms
  where created_at < now() - interval '2 hours';
  return new;
end;
$$ language plpgsql;

create or replace trigger cleanup_old_rooms
  after insert on public.rooms
  for each statement
  execute function delete_old_rooms();
