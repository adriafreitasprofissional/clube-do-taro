create table if not exists public.professional_schedule_settings (
  professional text primary key,
  mirror_club_therapy boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.professional_schedule_settings (
  professional,
  mirror_club_therapy
)
values ('Ádria Freitas', true)
on conflict (professional) do update
set mirror_club_therapy = excluded.mirror_club_therapy,
    updated_at = now();

create table if not exists public.club_mentoring_events (
  id uuid primary key default gen_random_uuid(),
  professional text not null default 'Ádria Freitas',
  event_type text not null check (event_type in ('individual','group')),
  title text not null default 'Mentoria',
  starts_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  status text not null default 'open'
    check (status in ('open','booked','completed','cancelled')),
  blocks_schedule boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_club_mentoring_events_starts
  on public.club_mentoring_events (professional, starts_at);

create table if not exists public.club_mentoring_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.club_mentoring_events(id) on delete cascade,
  client_id uuid not null references public.club_clients(id) on delete cascade,
  response text not null default 'pending'
    check (response in ('pending','confirmed','declined')),
  attendance text not null default 'not_marked'
    check (attendance in ('not_marked','present','absent')),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, client_id)
);

create index if not exists idx_club_mentoring_participants_client
  on public.club_mentoring_participants (client_id, event_id);

alter table public.professional_schedule_settings enable row level security;
alter table public.club_mentoring_events enable row level security;
alter table public.club_mentoring_participants enable row level security;

create or replace function public.professional_schedule_has_conflict(
  p_professional text,
  p_starts_at timestamptz,
  p_duration_minutes integer,
  p_include_appointments boolean default true,
  p_include_mentoring boolean default true,
  p_exclude_appointment_id uuid default null,
  p_exclude_mentoring_event_id uuid default null
)
returns boolean
language plpgsql
as $$
declare
  v_ends_at timestamptz;
begin
  v_ends_at := p_starts_at + make_interval(mins => greatest(coalesce(p_duration_minutes, 60), 1));

  if p_include_appointments then
    if exists (
      select 1
      from public.appointments a
      where lower(coalesce(a.professional, '')) = lower(coalesce(p_professional, ''))
        and coalesce(a.status, '') <> 'cancelado'
        and (p_exclude_appointment_id is null or a.id <> p_exclude_appointment_id)
        and a.scheduled_at < v_ends_at
        and (
          a.scheduled_at
          + make_interval(mins => greatest(coalesce(a.duration_minutes, 60), 1))
        ) > p_starts_at
    ) then
      return true;
    end if;
  end if;

  if p_include_mentoring then
    if exists (
      select 1
      from public.club_mentoring_events m
      where lower(coalesce(m.professional, '')) = lower(coalesce(p_professional, ''))
        and m.blocks_schedule = true
        and m.status <> 'cancelled'
        and (p_exclude_mentoring_event_id is null or m.id <> p_exclude_mentoring_event_id)
        and m.starts_at < v_ends_at
        and (
          m.starts_at
          + make_interval(mins => greatest(coalesce(m.duration_minutes, 60), 1))
        ) > p_starts_at
    ) then
      return true;
    end if;
  end if;

  return false;
end;
$$;

create or replace function public.book_club_individual_mentoring(
  p_event_id uuid,
  p_client_id uuid
)
returns boolean
language plpgsql
as $$
declare
  v_event public.club_mentoring_events%rowtype;
begin
  update public.club_mentoring_events
  set status = 'booked',
      updated_at = now()
  where id = p_event_id
    and event_type = 'individual'
    and status = 'open'
    and starts_at > now()
  returning * into v_event;

  if v_event.id is null then
    raise exception 'Horário indisponível.';
  end if;

  insert into public.club_mentoring_participants (
    event_id,
    client_id,
    response,
    attendance,
    responded_at,
    updated_at
  )
  values (
    p_event_id,
    p_client_id,
    'confirmed',
    'not_marked',
    now(),
    now()
  )
  on conflict (event_id, client_id)
  do update set
    response = 'confirmed',
    responded_at = now(),
    updated_at = now();

  return true;
end;
$$;

create or replace function public.respond_club_group_mentoring(
  p_event_id uuid,
  p_client_id uuid,
  p_response text
)
returns boolean
language plpgsql
as $$
declare
  v_exists boolean;
begin
  if p_response not in ('confirmed','declined') then
    raise exception 'Resposta inválida.';
  end if;

  select exists (
    select 1
    from public.club_mentoring_events
    where id = p_event_id
      and event_type = 'group'
      and status in ('open','booked')
      and starts_at > now()
  ) into v_exists;

  if not v_exists then
    raise exception 'Mentoria em grupo indisponível.';
  end if;

  insert into public.club_mentoring_participants (
    event_id,
    client_id,
    response,
    attendance,
    responded_at,
    updated_at
  )
  values (
    p_event_id,
    p_client_id,
    p_response,
    'not_marked',
    now(),
    now()
  )
  on conflict (event_id, client_id)
  do update set
    response = excluded.response,
    responded_at = now(),
    updated_at = now();

  return true;
end;
$$;
