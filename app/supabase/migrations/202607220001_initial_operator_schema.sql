-- ============================================================
-- OPERATOR CLOUD
-- Initial database schema
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- UPDATED_AT HELPER
-- ============================================================

create or replace function public.set_updated_at()
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

-- ============================================================
-- PROFILES
-- One profile for each Supabase Auth user
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Automatically create a profile when a user signs up.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    display_name,
    avatar_url
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ============================================================
-- MISSIONS
-- ============================================================

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  summary text not null default '',
  prompt text not null default '',
  plan text not null default '',

  status text not null default 'active'
    check (status in (
      'draft',
      'active',
      'paused',
      'completed',
      'archived'
    )),

  priority text not null default 'medium'
    check (priority in (
      'low',
      'medium',
      'high',
      'critical'
    )),

  owner text not null default '',
  recommendation text not null default '',
  progress integer not null default 0
    check (progress between 0 and 100),

  target_date date,
  selected boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index missions_user_id_idx
on public.missions(user_id);

create index missions_status_idx
on public.missions(status);

create index missions_updated_at_idx
on public.missions(updated_at desc);

create trigger missions_set_updated_at
before update on public.missions
for each row
execute function public.set_updated_at();

-- ============================================================
-- TASKS
-- ============================================================

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null
    references public.missions(id)
    on delete cascade,

  title text not null,
  description text not null default '',

  status text not null default 'not_started'
    check (status in (
      'not_started',
      'in_progress',
      'blocked',
      'completed'
    )),

  priority text not null default 'medium'
    check (priority in (
      'low',
      'medium',
      'high',
      'critical'
    )),

  progress integer not null default 0
    check (progress between 0 and 100),

  owner text not null default '',
  due_date date,
  sort_order integer not null default 0,
  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_mission_id_idx
on public.tasks(mission_id);

create index tasks_due_date_idx
on public.tasks(due_date);

create index tasks_status_idx
on public.tasks(status);

create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

-- ============================================================
-- EVENTS
-- Meetings, milestones, deadlines, reminders and calendar items
-- ============================================================

create table public.events (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null
    references public.missions(id)
    on delete cascade,

  title text not null,
  description text not null default '',

  event_type text not null default 'meeting'
    check (event_type in (
      'meeting',
      'milestone',
      'deadline',
      'reminder',
      'calendar'
    )),

  starts_at timestamptz,
  ends_at timestamptz,
  all_day boolean not null default false,
  location text not null default '',
  completed boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint valid_event_range
    check (
      ends_at is null
      or starts_at is null
      or ends_at >= starts_at
    )
);

create index events_mission_id_idx
on public.events(mission_id);

create index events_starts_at_idx
on public.events(starts_at);

create index events_type_idx
on public.events(event_type);

create trigger events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

-- ============================================================
-- RISKS
-- Kept as a dedicated operational entity
-- ============================================================

create table public.risks (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null
    references public.missions(id)
    on delete cascade,

  title text not null,
  description text not null default '',

  severity text not null default 'medium'
    check (severity in (
      'low',
      'medium',
      'high',
      'critical'
    )),

  likelihood text not null default 'possible'
    check (likelihood in (
      'unlikely',
      'possible',
      'likely',
      'almost_certain'
    )),

  mitigation text not null default '',
  resolved boolean not null default false,
  resolved_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index risks_mission_id_idx
on public.risks(mission_id);

create index risks_resolved_idx
on public.risks(resolved);

create trigger risks_set_updated_at
before update on public.risks
for each row
execute function public.set_updated_at();

-- ============================================================
-- DOCUMENTS
-- Metadata for notes, uploaded files and generated artifacts
-- ============================================================

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid
    references public.missions(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text not null,
  description text not null default '',

  document_type text not null default 'note'
    check (document_type in (
      'note',
      'file',
      'link',
      'generated'
    )),

  content text not null default '',
  storage_path text,
  external_url text,
  mime_type text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index documents_user_id_idx
on public.documents(user_id);

create index documents_mission_id_idx
on public.documents(mission_id);

create trigger documents_set_updated_at
before update on public.documents
for each row
execute function public.set_updated_at();

-- ============================================================
-- COMMENTS
-- Mission activity, collaboration and future AI messages
-- ============================================================

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null
    references public.missions(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  body text not null,

  comment_type text not null default 'comment'
    check (comment_type in (
      'comment',
      'activity',
      'system',
      'ai'
    )),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index comments_mission_id_idx
on public.comments(mission_id);

create index comments_created_at_idx
on public.comments(created_at desc);

create trigger comments_set_updated_at
before update on public.comments
for each row
execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.missions enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.risks enable row level security;
alter table public.documents enable row level security;
alter table public.comments enable row level security;

-- ============================================================
-- PROFILE POLICIES
-- ============================================================

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- ============================================================
-- MISSION POLICIES
-- ============================================================

create policy "Users can view their own missions"
on public.missions
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own missions"
on public.missions
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own missions"
on public.missions
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own missions"
on public.missions
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- ============================================================
-- CHILD-ENTITY POLICIES
-- Access is inherited through the owning mission
-- ============================================================

create policy "Users can view tasks for their missions"
on public.tasks
for select
to authenticated
using (
  exists (
    select 1
    from public.missions
    where missions.id = tasks.mission_id
      and missions.user_id = (select auth.uid())
  )
);

create policy "Users can create tasks for their missions"
on public.tasks
for insert
to authenticated
with check (
  exists (
    select 1
    from public.missions
    where missions.id = tasks.mission_id
      and missions.user_id = (select auth.uid())
  )
);

create policy "Users can update tasks for their missions"
on public.tasks
for update
to authenticated
using (
  exists (
    select 1
    from public.missions
    where missions.id = tasks.mission_id
      and missions.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.missions
    where missions.id = tasks.mission_id
      and missions.user_id = (select auth.uid())
  )
);

create policy "Users can delete tasks for their missions"
on public.tasks
for delete
to authenticated
using (
  exists (
    select 1
    from public.missions
    where missions.id = tasks.mission_id
      and missions.user_id = (select auth.uid())
  )
);

create policy "Users can manage events for their missions"
on public.events
for all
to authenticated
using (
  exists (
    select 1
    from public.missions
    where missions.id = events.mission_id
      and missions.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.missions
    where missions.id = events.mission_id
      and missions.user_id = (select auth.uid())
  )
);

create policy "Users can manage risks for their missions"
on public.risks
for all
to authenticated
using (
  exists (
    select 1
    from public.missions
    where missions.id = risks.mission_id
      and missions.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.missions
    where missions.id = risks.mission_id
      and missions.user_id = (select auth.uid())
  )
);

-- ============================================================
-- DOCUMENT POLICIES
-- ============================================================

create policy "Users can view their own documents"
on public.documents
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own documents"
on public.documents
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own documents"
on public.documents
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own documents"
on public.documents
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- ============================================================
-- COMMENT POLICIES
-- ============================================================

create policy "Users can view comments for their missions"
on public.comments
for select
to authenticated
using (
  exists (
    select 1
    from public.missions
    where missions.id = comments.mission_id
      and missions.user_id = (select auth.uid())
  )
);

create policy "Users can create comments for their missions"
on public.comments
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.missions
    where missions.id = comments.mission_id
      and missions.user_id = (select auth.uid())
  )
);

create policy "Users can update their own comments"
on public.comments
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own comments"
on public.comments
for delete
to authenticated
using ((select auth.uid()) = user_id);