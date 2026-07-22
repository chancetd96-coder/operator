drop index if exists public.missions_user_legacy_id_idx;

create unique index missions_user_legacy_id_idx
on public.missions(user_id, legacy_id);