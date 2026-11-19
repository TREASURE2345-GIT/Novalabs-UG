-- RBAC hardening: account status, permission matrix, server-side enforcement
-- and admin audit trail.

alter table public.profiles
  add column if not exists status text not null default 'active';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_status_check'
  ) then
    alter table public.profiles
      add constraint profiles_status_check
      check (status in ('active', 'suspended', 'pending'));
  end if;
end;
$$;

create index if not exists profiles_status_idx on public.profiles (status);
create index if not exists profiles_role_idx on public.profiles (role);

create table if not exists public.role_permissions (
  role text not null check (role in ('student', 'teacher', 'admin', 'partner')),
  permission text not null,
  primary key (role, permission)
);

alter table public.role_permissions enable row level security;

drop policy if exists "Role permissions: authenticated can read" on public.role_permissions;
create policy "Role permissions: authenticated can read"
  on public.role_permissions for select
  using (auth.uid() is not null);

insert into public.role_permissions (role, permission)
values
  ('student', 'experiment.run'),
  ('student', 'progress.write.self'),
  ('student', 'progress.read.self'),
  ('teacher', 'experiment.run'),
  ('teacher', 'progress.write.self'),
  ('teacher', 'progress.read.self'),
  ('teacher', 'class.manage'),
  ('teacher', 'assignment.manage'),
  ('teacher', 'progress.read.class'),
  ('teacher', 'resource.manage'),
  ('teacher', 'analytics.teacher'),
  ('admin', 'experiment.run'),
  ('admin', 'progress.write.self'),
  ('admin', 'progress.read.self'),
  ('admin', 'class.manage'),
  ('admin', 'assignment.manage'),
  ('admin', 'progress.read.class'),
  ('admin', 'resource.manage'),
  ('admin', 'analytics.teacher'),
  ('admin', 'analytics.school'),
  ('admin', 'analytics.platform'),
  ('admin', 'user.manage'),
  ('admin', 'school.manage'),
  ('admin', 'subscription.manage'),
  ('partner', 'analytics.platform')
on conflict (role, permission) do nothing;

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_user_id uuid references public.profiles(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);
create index if not exists audit_log_target_idx on public.audit_log (target_user_id);

alter table public.audit_log enable row level security;

-- ---------------------------------------------------------------------------
-- Permission helpers
-- ---------------------------------------------------------------------------

create or replace function public.has_permission(p_permission text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.role_permissions rp on rp.role = p.role
    where p.id = auth.uid()
      and p.status = 'active'
      and rp.permission = p_permission
  );
$$;

create or replace function public.get_my_permissions()
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(rp.permission order by rp.permission), '{}'::text[])
  from public.profiles p
  join public.role_permissions rp on rp.role = p.role
  where p.id = auth.uid()
    and p.status = 'active';
$$;

drop policy if exists "Audit log: admins can read" on public.audit_log;
create policy "Audit log: admins can read"
  on public.audit_log for select
  using (public.has_permission('user.manage'));

create or replace function public.app_status()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select status from public.profiles where id = auth.uid();
$$;

-- Existing RLS policies call these helpers, so making them status-aware
-- enforces suspension across every table without duplicating policies.
create or replace function public.app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles
  where id = auth.uid() and status = 'active';
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

create or replace function public.teaches_class(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classes c
    join public.profiles p on p.id = auth.uid() and p.status = 'active'
    where c.id = p_class_id and c.teacher_id = auth.uid()
  );
$$;

create or replace function public.is_enrolled(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_members cm
    join public.profiles p on p.id = auth.uid() and p.status = 'active'
    where cm.class_id = p_class_id and cm.student_id = auth.uid()
  );
$$;

create or replace function public.teacher_of_student(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_members cm
    join public.classes c on c.id = cm.class_id
    join public.profiles p on p.id = auth.uid() and p.status = 'active'
    where c.teacher_id = auth.uid() and cm.student_id = p_student_id
  );
$$;

create or replace function public.is_teacher_of_assignment(p_assignment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignments a
    join public.classes c on c.id = a.class_id
    join public.profiles p on p.id = auth.uid() and p.status = 'active'
    where a.id = p_assignment_id and c.teacher_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Admin RPCs (SECURITY DEFINER, permission checked, audited)
-- ---------------------------------------------------------------------------

create or replace function public.admin_set_user_role(
  target_user uuid,
  new_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  old_role text;
  active_admins integer;
begin
  if not public.has_permission('user.manage') then
    raise exception 'You do not have permission to manage users.' using errcode = '42501';
  end if;

  if target_user = actor then
    raise exception 'You cannot change your own role.' using errcode = '42501';
  end if;

  if new_role not in ('student', 'teacher', 'admin', 'partner') then
    raise exception 'Invalid role: %', new_role using errcode = '22023';
  end if;

  select role into old_role from public.profiles where id = target_user;
  if old_role is null then
    raise exception 'User not found.' using errcode = 'P0002';
  end if;

  if old_role = 'admin' and new_role <> 'admin' then
    select count(*) into active_admins
    from public.profiles
    where role = 'admin' and status = 'active';
    if active_admins <= 1 then
      raise exception 'At least one active administrator must remain.' using errcode = '42501';
    end if;
  end if;

  perform set_config('novalab.admin_rpc', 'on', true);

  update public.profiles
  set role = new_role, updated_at = now()
  where id = target_user;

  perform set_config('novalab.admin_rpc', 'off', true);

  insert into public.audit_log (actor_id, action, target_user_id, details)
  values (
    actor,
    'user.role_changed',
    target_user,
    jsonb_build_object('from', old_role, 'to', new_role)
  );
end;
$$;

create or replace function public.admin_set_user_status(
  target_user uuid,
  new_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  old_status text;
  target_role text;
  active_admins integer;
begin
  if not public.has_permission('user.manage') then
    raise exception 'You do not have permission to manage users.' using errcode = '42501';
  end if;

  if target_user = actor then
    raise exception 'You cannot suspend your own account.' using errcode = '42501';
  end if;

  if new_status not in ('active', 'suspended', 'pending') then
    raise exception 'Invalid account status: %', new_status using errcode = '22023';
  end if;

  select role, status into target_role, old_status
  from public.profiles where id = target_user;
  if old_status is null then
    raise exception 'User not found.' using errcode = 'P0002';
  end if;

  if target_role = 'admin' and new_status <> 'active' then
    select count(*) into active_admins
    from public.profiles
    where role = 'admin' and status = 'active';
    if active_admins <= 1 then
      raise exception 'At least one active administrator must remain.' using errcode = '42501';
    end if;
  end if;

  perform set_config('novalab.admin_rpc', 'on', true);

  update public.profiles
  set status = new_status, updated_at = now()
  where id = target_user;

  perform set_config('novalab.admin_rpc', 'off', true);

  insert into public.audit_log (actor_id, action, target_user_id, details)
  values (
    actor,
    'user.status_changed',
    target_user,
    jsonb_build_object('from', old_status, 'to', new_status)
  );
end;
$$;

-- Role, status, school, and subscription fields can only change through the
-- audited admin RPCs (which set novalab.admin_rpc) or trusted service-role
-- calls (auth.uid() is null). Direct PostgREST updates silently keep the old
-- values.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
    and coalesce(current_setting('novalab.admin_rpc', true), 'off') <> 'on'
  then
    new.role := old.role;
    new.status := old.status;
    new.school_id := old.school_id;
    new.subscription_plan := old.subscription_plan;
    new.subscription_status := old.subscription_status;
    new.subscription_expires_at := old.subscription_expires_at;
    new.subscription_reference := old.subscription_reference;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_fields_trigger on public.profiles;
create trigger protect_profile_fields_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

grant execute on function public.has_permission(text) to authenticated;
grant execute on function public.get_my_permissions() to authenticated;
grant execute on function public.app_status() to authenticated;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;
grant execute on function public.admin_set_user_status(uuid, text) to authenticated;

revoke execute on function public.admin_set_user_role(uuid, text) from anon;
revoke execute on function public.admin_set_user_status(uuid, text) from anon;
