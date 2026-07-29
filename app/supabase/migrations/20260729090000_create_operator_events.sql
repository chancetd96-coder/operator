-- Operator pilot MVP
-- Canonical event store for Capture -> Review -> Commit workflows.

create table if not exists public.operator_events (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  organization_id uuid,
  workspace_id uuid,
  mission_id uuid,

  event_type text not null
    check (
      event_type in (
        'meeting.create',
        'meeting.update',
        'task.create',
        'decision.record',
        'risk.create',
        'reminder.create',
        'note.record'
      )
    ),

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'approved',
        'rejected',
        'committed',
        'completed',
        'cancelled'
      )
    ),

  source text not null default 'capture'
    check (
      source in (
        'capture',
        'email',
        'calendar',
        'slack',
        'meeting',
        'voice',
        'api'
      )
    ),

  title text not null,
  description text,

  confidence numeric(4,3) not null default 0.500
    check (confidence >= 0 and confidence <= 1),

  priority text
    check (
      priority is null
      or priority in (
        'low',
        'medium',
        'high',
        'critical'
      )
    ),

  starts_at timestamptz,
  ends_at timestamptz,
  timezone text,
  raw_time_text text,

  source_text text not null,

  people jsonb not null default '[]'::jsonb,
  organizations jsonb not null default '[]'::jsonb,
  missing_fields jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,

  requires_approval boolean not null default true,

  approved_at timestamptz,
  committed_at timestamptz,
  completed_at timestamptz,

  dedupe_key text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists operator_events_user_id_idx
  on public.operator_events(user_id);

create index if not exists operator_events_user_status_idx
  on public.operator_events(user_id, status);

create index if not exists operator_events_user_start_idx
  on public.operator_events(user_id, starts_at);

create unique index if not exists operator_events_user_dedupe_idx
  on public.operator_events(user_id, dedupe_key)
  where dedupe_key is not null;

create or replace function public.set_operator_event_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists operator_events_set_updated_at
  on public.operator_events;

create trigger operator_events_set_updated_at
before update on public.operator_events
for each row
execute function public.set_operator_event_updated_at();

alter table public.operator_events enable row level security;

drop policy if exists "Users can view their own operator events"
  on public.operator_events;

create policy "Users can view their own operator events"
on public.operator_events
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own operator events"
  on public.operator_events;

create policy "Users can create their own operator events"
on public.operator_events
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own operator events"
  on public.operator_events;

create policy "Users can update their own operator events"
on public.operator_events
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own operator events"
  on public.operator_events;

create policy "Users can delete their own operator events"
on public.operator_events
for delete
to authenticated
using ((select auth.uid()) = user_id);
