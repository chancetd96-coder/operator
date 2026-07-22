create table if not exists public.mission_memory (
    id uuid primary key default gen_random_uuid(),

    mission_id uuid not null
        references public.missions(id)
        on delete cascade,

    role text not null,
    content text not null,

    metadata jsonb default '{}'::jsonb,

    created_at timestamptz default now()
);

alter table public.mission_memory
enable row level security;

create policy "Users own mission memory"
on public.mission_memory
for all
using (
    exists (
        select 1
        from public.missions
        where missions.id = mission_memory.mission_id
        and missions.user_id = auth.uid()
    )
);