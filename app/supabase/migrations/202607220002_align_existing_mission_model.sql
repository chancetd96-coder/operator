-- ============================================================
-- OPERATOR CLOUD
-- Align the cloud schema with the existing Mission TypeScript model
-- ============================================================

alter table public.missions
add column if not exists assumptions jsonb not null default '[]'::jsonb,
add column if not exists schedule jsonb not null default '[]'::jsonb,
add column if not exists resources jsonb not null default '[]'::jsonb,
add column if not exists success_metrics jsonb not null default '[]'::jsonb,
add column if not exists legacy_id bigint;

create unique index if not exists missions_user_legacy_id_idx
on public.missions(user_id, legacy_id)
where legacy_id is not null;

alter table public.tasks
add column if not exists scheduled_date date,
add column if not exists comments jsonb not null default '[]'::jsonb,
add column if not exists risks jsonb not null default '[]'::jsonb,
add column if not exists blockers jsonb not null default '[]'::jsonb,
add column if not exists meeting_ids jsonb not null default '[]'::jsonb,
add column if not exists legacy_id text;

create unique index if not exists tasks_mission_legacy_id_idx
on public.tasks(mission_id, legacy_id)
where legacy_id is not null;

alter table public.events
add column if not exists legacy_id text,
add column if not exists task_ids jsonb not null default '[]'::jsonb,
add column if not exists notes text not null default '';

create unique index if not exists events_mission_legacy_id_idx
on public.events(mission_id, legacy_id)
where legacy_id is not null;

alter table public.risks
add column if not exists legacy_id text,
add column if not exists task_ids jsonb not null default '[]'::jsonb;

create unique index if not exists risks_mission_legacy_id_idx
on public.risks(mission_id, legacy_id)
where legacy_id is not null;