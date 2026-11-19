-- NovaLab backend schema
-- Apply with: supabase db push
-- This migration is safe to re-run (objects use IF NOT EXISTS / OR REPLACE).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text,
  district text,
  internet_access boolean not null default false,
  icti_readiness text not null default 'medium' check (icti_readiness in ('low', 'medium', 'high')),
  student_count integer not null default 0,
  teacher_count integer not null default 0,
  subscription_plan text not null default 'free' check (subscription_plan in ('free', 'monthly_premium', 'school')),
  subscription_status text not null default 'inactive' check (subscription_status in ('inactive', 'active', 'trial', 'pending')),
  subscription_expires_at timestamptz,
  subscription_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  email text unique,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin', 'partner')),
  subjects text[] not null default '{}',
  school_id uuid references public.schools (id) on delete set null,
  avatar_url text,
  subscription_plan text not null default 'free' check (subscription_plan in ('free', 'monthly_premium', 'school')),
  subscription_status text not null default 'inactive' check (subscription_status in ('inactive', 'active', 'trial', 'pending')),
  subscription_expires_at timestamptz,
  subscription_reference text,
  subscription_provider text not null default 'flutterwave',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  school_id uuid references public.schools (id) on delete cascade,
  plan text not null check (plan in ('free', 'monthly_premium', 'school')),
  status text not null default 'pending' check (status in ('inactive', 'active', 'trial', 'pending', 'cancelled')),
  amount numeric(12, 2) not null default 0,
  currency text not null default 'UGX',
  reference text not null unique,
  provider text not null default 'flutterwave',
  flutterwave_transaction_id text,
  paid_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or school_id is not null)
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  school_id uuid references public.schools (id) on delete set null,
  name text not null,
  subject text not null check (subject in ('biology', 'chemistry', 'physics', 'agriculture')),
  grade text,
  join_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  student_count integer not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.class_members (
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  experiment_id text not null,
  title text not null,
  description text,
  due_date timestamptz,
  published boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  experiment_id text not null,
  status text not null default 'pending' check (status in ('pending', 'submitted', 'graded', 'returned')),
  score integer not null default 0 check (score between 0 and 100),
  data jsonb not null default '{}'::jsonb,
  feedback text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  experiment_id text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score integer not null default 0 check (score between 0 and 100),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed', 'submitted')),
  data jsonb not null default '{}'::jsonb,
  feedback text,
  time_spent integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, experiment_id)
);

create table if not exists public.teacher_videos (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  subject text not null check (subject in ('biology', 'chemistry', 'physics', 'agriculture')),
  youtube_url text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_questions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid references public.profiles (id) on delete set null,
  class_id uuid references public.classes (id) on delete set null,
  student_name text not null default '',
  class_name text not null default '',
  subject text not null check (subject in ('biology', 'chemistry', 'physics', 'agriculture')),
  question text not null,
  answer text,
  answered_at timestamptz,
  answered_by uuid references public.profiles (id) on delete set null,
  asked_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.online_lectures (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  class_id uuid references public.classes (id) on delete set null,
  title text not null,
  subject text not null check (subject in ('biology', 'chemistry', 'physics', 'agriculture')),
  starts_at timestamptz not null,
  meeting_url text not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists profiles_school_idx on public.profiles (school_id);
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists subscriptions_user_idx on public.subscriptions (user_id);
create index if not exists subscriptions_school_idx on public.subscriptions (school_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);
create index if not exists classes_teacher_idx on public.classes (teacher_id);
create index if not exists classes_school_idx on public.classes (school_id);
create index if not exists class_members_student_idx on public.class_members (student_id);
create index if not exists assignments_class_idx on public.assignments (class_id);
create index if not exists submissions_student_idx on public.assignment_submissions (student_id);
create index if not exists student_progress_student_idx on public.student_progress (student_id);
create index if not exists student_progress_experiment_idx on public.student_progress (experiment_id);
create index if not exists teacher_videos_teacher_idx on public.teacher_videos (teacher_id);
create index if not exists student_questions_teacher_idx on public.student_questions (teacher_id);
create index if not exists student_questions_student_idx on public.student_questions (student_id);
create index if not exists online_lectures_teacher_idx on public.online_lectures (teacher_id);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.app_school_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id from public.profiles where id = auth.uid();
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
    where id = auth.uid() and role = 'admin'
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
    select 1 from public.classes
    where id = p_class_id and teacher_id = auth.uid()
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
    select 1 from public.class_members
    where class_id = p_class_id and student_id = auth.uid()
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
    where a.id = p_assignment_id and c.teacher_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, subjects)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(coalesce(new.email, ''), '@', 1)),
    new.email,
    'student',
    '{}'::text[]
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = new.email, updated_at = now() where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() = new.id and not public.is_admin() then
    new.role := old.role;
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

create or replace function public.refresh_class_student_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class_id uuid;
begin
  if tg_op = 'DELETE' then
    v_class_id := old.class_id;
  else
    v_class_id := new.class_id;
  end if;

  update public.classes
  set student_count = (
    select count(*) from public.class_members where class_id = v_class_id
  )
  where id = v_class_id;
  return null;
end;
$$;

drop trigger if exists class_members_count_trigger on public.class_members;
create trigger class_members_count_trigger
  after insert or delete on public.class_members
  for each row execute function public.refresh_class_student_count();

create or replace function public.refresh_school_user_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_school_id uuid;
begin
  if tg_op = 'UPDATE' and old.school_id is distinct from new.school_id and old.school_id is not null then
    update public.schools
    set
      student_count = (select count(*) from public.profiles where school_id = old.school_id and role = 'student'),
      teacher_count = (select count(*) from public.profiles where school_id = old.school_id and role = 'teacher')
    where id = old.school_id;
  end if;

  if tg_op = 'DELETE' then
    v_school_id := old.school_id;
  else
    v_school_id := new.school_id;
  end if;

  if v_school_id is not null then
    update public.schools
    set
      student_count = (select count(*) from public.profiles where school_id = v_school_id and role = 'student'),
      teacher_count = (select count(*) from public.profiles where school_id = v_school_id and role = 'teacher')
    where id = v_school_id;
  end if;

  return null;
end;
$$;

drop trigger if exists profiles_school_counts_trigger on public.profiles;
create trigger profiles_school_counts_trigger
  after insert or update or delete on public.profiles
  for each row execute function public.refresh_school_user_counts();

create or replace function public.apply_subscription_to_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text := case when new.status = 'cancelled' then 'inactive' else new.status end;
begin
  if new.user_id is not null then
    update public.profiles
    set
      subscription_plan = new.plan,
      subscription_status = v_status,
      subscription_expires_at = new.expires_at,
      subscription_reference = new.reference,
      subscription_provider = new.provider,
      updated_at = now()
    where id = new.user_id;
  elsif new.school_id is not null then
    update public.schools
    set
      subscription_plan = new.plan,
      subscription_status = v_status,
      subscription_expires_at = new.expires_at,
      subscription_reference = new.reference,
      updated_at = now()
    where id = new.school_id;
  end if;

  return new;
end;
$$;

drop trigger if exists subscriptions_apply_trigger on public.subscriptions;
create trigger subscriptions_apply_trigger
  after insert or update of status, expires_at, plan on public.subscriptions
  for each row execute function public.apply_subscription_to_owner();

create or replace function public.sync_submission_to_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_progress_status text;
begin
  v_progress_status := case new.status
    when 'graded' then 'completed'
    when 'submitted' then 'submitted'
    else 'in_progress'
  end;

  insert into public.student_progress (
    student_id, experiment_id, score, status, data, feedback, started_at, completed_at
  )
  values (
    new.student_id,
    new.experiment_id,
    new.score,
    v_progress_status,
    new.data,
    new.feedback,
    coalesce(new.created_at, now()),
    case when new.status = 'graded' then coalesce(new.submitted_at, now()) else null end
  )
  on conflict (student_id, experiment_id) do update set
    score = greatest(student_progress.score, excluded.score),
    status = case
      when excluded.status = 'completed' then 'completed'
      when student_progress.status = 'completed' then 'completed'
      else excluded.status
    end,
    data = student_progress.data || excluded.data,
    feedback = coalesce(excluded.feedback, student_progress.feedback),
    completed_at = coalesce(student_progress.completed_at, excluded.completed_at),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists submissions_sync_progress_trigger on public.assignment_submissions;
create trigger submissions_sync_progress_trigger
  after insert or update on public.assignment_submissions
  for each row execute function public.sync_submission_to_progress();

-- updated_at triggers
do $$
declare
  v_table text;
begin
  foreach v_table in array array[
    'schools', 'profiles', 'subscriptions', 'classes', 'assignments',
    'assignment_submissions', 'student_progress', 'teacher_videos',
    'student_questions', 'online_lectures'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', v_table || '_updated_at', v_table);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      v_table || '_updated_at', v_table
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

create or replace function public.plan_amount(p_plan text)
returns numeric
language sql
immutable
as $$
  select case p_plan
    when 'monthly_premium' then 15000::numeric
    when 'school' then 500000::numeric
    else 0::numeric
  end;
$$;

create or replace function public.join_class(p_join_code text)
returns public.classes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_class public.classes;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_class
  from public.classes
  where join_code = upper(trim(p_join_code)) and not archived;

  if not found then
    raise exception 'Class not found';
  end if;

  insert into public.class_members (class_id, student_id)
  values (v_class.id, v_user_id)
  on conflict (class_id, student_id) do nothing;

  return v_class;
end;
$$;

create or replace function public.activate_subscription(
  p_reference text,
  p_transaction_id text default null
)
returns public.subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subscription public.subscriptions;
  v_expires_at timestamptz;
begin
  select * into v_subscription
  from public.subscriptions
  where reference = p_reference
  for update;

  if not found then
    raise exception 'Subscription % not found', p_reference;
  end if;

  if v_subscription.status = 'active' then
    return v_subscription;
  end if;

  v_expires_at := case v_subscription.plan
    when 'monthly_premium' then now() + interval '1 month'
    when 'school' then now() + interval '1 year'
    else now() + interval '10 years'
  end;

  update public.subscriptions
  set
    status = 'active',
    flutterwave_transaction_id = coalesce(p_transaction_id, flutterwave_transaction_id),
    paid_at = coalesce(paid_at, now()),
    expires_at = v_expires_at,
    updated_at = now()
  where id = v_subscription.id
  returning * into v_subscription;

  return v_subscription;
end;
$$;

create or replace function public.get_teacher_analytics()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with my_classes as (
    select id from public.classes where teacher_id = auth.uid()
  ),
  my_students as (
    select distinct cm.student_id
    from public.class_members cm
    join my_classes c on c.id = cm.class_id
  )
  select jsonb_build_object(
    'role', 'teacher',
    'classes', (select count(*) from my_classes),
    'students', (select count(*) from my_students),
    'assignments', (
      select count(*) from public.assignments a
      join my_classes c on c.id = a.class_id
    ),
    'completed_experiments', (
      select count(*) from public.student_progress sp
      join my_students s on s.student_id = sp.student_id
      where sp.status = 'completed'
    ),
    'average_score', coalesce((
      select round(avg(sp.score)::numeric, 1) from public.student_progress sp
      join my_students s on s.student_id = sp.student_id
      where sp.status = 'completed'
    ), 0),
    'pending_questions', (
      select count(*) from public.student_questions
      where teacher_id = auth.uid() and answer is null
    )
  );
$$;

create or replace function public.get_student_analytics(p_student_id uuid default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_student_id uuid := coalesce(p_student_id, auth.uid());
begin
  if v_student_id is null then
    raise exception 'Not authenticated';
  end if;

  if v_student_id <> auth.uid()
     and not public.is_admin()
     and not public.teacher_of_student(v_student_id) then
    raise exception 'Not allowed to view this student';
  end if;

  return (
    select jsonb_build_object(
      'role', 'student',
      'student_id', v_student_id,
      'experiments_started', count(*),
      'experiments_completed', count(*) filter (where status = 'completed'),
      'average_score', coalesce(round((avg(score) filter (where status = 'completed'))::numeric, 1), 0),
      'time_spent_seconds', coalesce(sum(time_spent), 0),
      'last_activity', max(updated_at)
    )
    from public.student_progress
    where student_id = v_student_id
  );
end;
$$;

create or replace function public.get_school_analytics(p_school_id uuid default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_school_id uuid := coalesce(p_school_id, public.app_school_id());
begin
  if v_school_id is null then
    raise exception 'A school id is required';
  end if;

  if not public.is_admin() and v_school_id <> public.app_school_id() then
    raise exception 'Not allowed to view this school';
  end if;

  return (
    select jsonb_build_object(
      'role', 'school',
      'school_id', v_school_id,
      'students', (select count(*) from public.profiles where school_id = v_school_id and role = 'student'),
      'teachers', (select count(*) from public.profiles where school_id = v_school_id and role = 'teacher'),
      'classes', (select count(*) from public.classes where school_id = v_school_id),
      'assignments', (
        select count(*) from public.assignments a
        join public.classes c on c.id = a.class_id
        where c.school_id = v_school_id
      ),
      'completed_experiments', (
        select count(*) from public.student_progress sp
        join public.profiles p on p.id = sp.student_id
        where p.school_id = v_school_id and sp.status = 'completed'
      ),
      'average_score', coalesce((
        select round(avg(sp.score)::numeric, 1) from public.student_progress sp
        join public.profiles p on p.id = sp.student_id
        where p.school_id = v_school_id and sp.status = 'completed'
      ), 0),
      'active_subscriptions', (
        select count(*) from public.subscriptions
        where school_id = v_school_id and status = 'active'
      )
    )
  );
end;
$$;

create or replace function public.get_platform_analytics()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only administrators can view platform analytics';
  end if;

  return (
    select jsonb_build_object(
      'role', 'admin',
      'students', (select count(*) from public.profiles where role = 'student'),
      'teachers', (select count(*) from public.profiles where role = 'teacher'),
      'partners', (select count(*) from public.profiles where role = 'partner'),
      'schools', (select count(*) from public.schools),
      'classes', (select count(*) from public.classes),
      'assignments', (select count(*) from public.assignments),
      'completed_experiments', (select count(*) from public.student_progress where status = 'completed'),
      'average_score', coalesce((select round(avg(score)::numeric, 1) from public.student_progress where status = 'completed'), 0),
      'active_subscriptions', (select count(*) from public.subscriptions where status = 'active'),
      'pending_subscriptions', (select count(*) from public.subscriptions where status = 'pending')
    )
  );
end;
$$;

revoke all on function public.join_class(text) from public;
grant execute on function public.join_class(text) to authenticated;

revoke all on function public.get_teacher_analytics() from public;
grant execute on function public.get_teacher_analytics() to authenticated;

revoke all on function public.get_student_analytics(uuid) from public;
grant execute on function public.get_student_analytics(uuid) to authenticated;

revoke all on function public.get_school_analytics(uuid) from public;
grant execute on function public.get_school_analytics(uuid) to authenticated;

revoke all on function public.get_platform_analytics() from public;
grant execute on function public.get_platform_analytics() to authenticated;

revoke all on function public.activate_subscription(text, text) from public;
grant execute on function public.activate_subscription(text, text) to service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.student_progress enable row level security;
alter table public.teacher_videos enable row level security;
alter table public.student_questions enable row level security;
alter table public.online_lectures enable row level security;

-- schools
drop policy if exists "Schools: members can view own school" on public.schools;
create policy "Schools: members can view own school"
  on public.schools for select
  using (id = public.app_school_id() or public.is_admin());

drop policy if exists "Schools: admins manage" on public.schools;
create policy "Schools: admins manage"
  on public.schools for all
  using (public.is_admin())
  with check (public.is_admin());

-- profiles
drop policy if exists "Profiles: self or staff can view" on public.profiles;
create policy "Profiles: self or staff can view"
  on public.profiles for select
  using (
    id = auth.uid()
    or public.is_admin()
    or public.teacher_of_student(id)
    or (
      school_id is not null
      and school_id = public.app_school_id()
      and public.app_role() in ('teacher', 'admin', 'partner')
    )
  );

-- Profiles are created by the on_auth_user_created trigger (SECURITY DEFINER),
-- so self-insert is intentionally not allowed. Admins may still insert.
drop policy if exists "Profiles: admins insert" on public.profiles;
create policy "Profiles: admins insert"
  on public.profiles for insert
  with check (public.is_admin());

drop policy if exists "Profiles: update self" on public.profiles;
create policy "Profiles: update self"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "Profiles: admins delete" on public.profiles;
create policy "Profiles: admins delete"
  on public.profiles for delete
  using (public.is_admin());

-- subscriptions
drop policy if exists "Subscriptions: owner or admin can view" on public.subscriptions;
create policy "Subscriptions: owner or admin can view"
  on public.subscriptions for select
  using (
    user_id = auth.uid()
    or school_id = public.app_school_id()
    or public.is_admin()
  );

drop policy if exists "Subscriptions: admins manage" on public.subscriptions;
create policy "Subscriptions: admins manage"
  on public.subscriptions for all
  using (public.is_admin())
  with check (public.is_admin());

-- classes
drop policy if exists "Classes: teacher, member, school staff, admin can view" on public.classes;
create policy "Classes: teacher, member, school staff, admin can view"
  on public.classes for select
  using (
    teacher_id = auth.uid()
    or public.is_enrolled(id)
    or public.is_admin()
    or (school_id = public.app_school_id() and public.app_role() in ('teacher', 'admin', 'partner'))
  );

drop policy if exists "Classes: teachers create" on public.classes;
create policy "Classes: teachers create"
  on public.classes for insert
  with check (
    teacher_id = auth.uid()
    and public.app_role() in ('teacher', 'admin')
  );

drop policy if exists "Classes: teachers update own" on public.classes;
create policy "Classes: teachers update own"
  on public.classes for update
  using (teacher_id = auth.uid() or public.is_admin())
  with check (teacher_id = auth.uid() or public.is_admin());

drop policy if exists "Classes: teachers delete own" on public.classes;
create policy "Classes: teachers delete own"
  on public.classes for delete
  using (teacher_id = auth.uid() or public.is_admin());

-- class members
drop policy if exists "Class members: student, teacher, admin can view" on public.class_members;
create policy "Class members: student, teacher, admin can view"
  on public.class_members for select
  using (
    student_id = auth.uid()
    or public.teaches_class(class_id)
    or public.is_admin()
  );

drop policy if exists "Class members: teachers add" on public.class_members;
create policy "Class members: teachers add"
  on public.class_members for insert
  with check (public.teaches_class(class_id) or public.is_admin());

drop policy if exists "Class members: teachers or student remove" on public.class_members;
create policy "Class members: teachers or student remove"
  on public.class_members for delete
  using (public.teaches_class(class_id) or student_id = auth.uid() or public.is_admin());

-- assignments
drop policy if exists "Assignments: class participants can view" on public.assignments;
create policy "Assignments: class participants can view"
  on public.assignments for select
  using (
    public.teaches_class(class_id)
    or public.is_enrolled(class_id)
    or public.is_admin()
  );

drop policy if exists "Assignments: teachers manage" on public.assignments;
create policy "Assignments: teachers manage"
  on public.assignments for all
  using (public.teaches_class(class_id) or public.is_admin())
  with check (public.teaches_class(class_id) or public.is_admin());

-- assignment submissions
drop policy if exists "Submissions: student or teacher can view" on public.assignment_submissions;
create policy "Submissions: student or teacher can view"
  on public.assignment_submissions for select
  using (
    student_id = auth.uid()
    or public.is_teacher_of_assignment(assignment_id)
    or public.is_admin()
  );

drop policy if exists "Submissions: students insert own" on public.assignment_submissions;
create policy "Submissions: students insert own"
  on public.assignment_submissions for insert
  with check (
    student_id = auth.uid()
    and exists (
      select 1
      from public.assignments a
      join public.class_members cm on cm.class_id = a.class_id
      where a.id = assignment_id and cm.student_id = auth.uid()
    )
  );

drop policy if exists "Submissions: students or teachers update" on public.assignment_submissions;
create policy "Submissions: students or teachers update"
  on public.assignment_submissions for update
  using (
    student_id = auth.uid()
    or public.is_teacher_of_assignment(assignment_id)
    or public.is_admin()
  )
  with check (
    student_id = auth.uid()
    or public.is_teacher_of_assignment(assignment_id)
    or public.is_admin()
  );

drop policy if exists "Submissions: student or admin delete" on public.assignment_submissions;
create policy "Submissions: student or admin delete"
  on public.assignment_submissions for delete
  using (student_id = auth.uid() or public.is_admin());

-- student progress
drop policy if exists "Progress: student or teacher can view" on public.student_progress;
create policy "Progress: student or teacher can view"
  on public.student_progress for select
  using (
    student_id = auth.uid()
    or public.teacher_of_student(student_id)
    or public.is_admin()
  );

drop policy if exists "Progress: students insert own" on public.student_progress;
create policy "Progress: students insert own"
  on public.student_progress for insert
  with check (student_id = auth.uid() or public.is_admin());

drop policy if exists "Progress: student or teacher update" on public.student_progress;
create policy "Progress: student or teacher update"
  on public.student_progress for update
  using (
    student_id = auth.uid()
    or public.teacher_of_student(student_id)
    or public.is_admin()
  )
  with check (
    student_id = auth.uid()
    or public.teacher_of_student(student_id)
    or public.is_admin()
  );

drop policy if exists "Progress: student or admin delete" on public.student_progress;
create policy "Progress: student or admin delete"
  on public.student_progress for delete
  using (student_id = auth.uid() or public.is_admin());

-- teacher videos
drop policy if exists "Videos: authenticated users can view" on public.teacher_videos;
create policy "Videos: authenticated users can view"
  on public.teacher_videos for select
  using (auth.uid() is not null);

drop policy if exists "Videos: teachers manage own" on public.teacher_videos;
create policy "Videos: teachers manage own"
  on public.teacher_videos for all
  using (teacher_id = auth.uid() or public.is_admin())
  with check (teacher_id = auth.uid() or public.is_admin());

-- student questions
drop policy if exists "Questions: student, teacher or admin can view" on public.student_questions;
create policy "Questions: student, teacher or admin can view"
  on public.student_questions for select
  using (
    student_id = auth.uid()
    or teacher_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "Questions: students ask" on public.student_questions;
create policy "Questions: students ask"
  on public.student_questions for insert
  with check (student_id = auth.uid() or public.is_admin());

drop policy if exists "Questions: teachers answer" on public.student_questions;
create policy "Questions: teachers answer"
  on public.student_questions for update
  using (teacher_id = auth.uid() or public.is_admin())
  with check (teacher_id = auth.uid() or public.is_admin());

drop policy if exists "Questions: teacher or admin delete" on public.student_questions;
create policy "Questions: teacher or admin delete"
  on public.student_questions for delete
  using (teacher_id = auth.uid() or public.is_admin());

-- online lectures
drop policy if exists "Lectures: participants can view" on public.online_lectures;
create policy "Lectures: participants can view"
  on public.online_lectures for select
  using (
    teacher_id = auth.uid()
    or public.is_admin()
    or (class_id is not null and public.is_enrolled(class_id))
    or (class_id is null and auth.uid() is not null)
  );

drop policy if exists "Lectures: teachers manage own" on public.online_lectures;
create policy "Lectures: teachers manage own"
  on public.online_lectures for all
  using (teacher_id = auth.uid() or public.is_admin())
  with check (teacher_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Reporting views
-- ---------------------------------------------------------------------------

create or replace view public.class_performance
with (security_invoker = true)
as
select
  c.id as class_id,
  c.teacher_id,
  c.school_id,
  c.name,
  c.subject,
  c.grade,
  c.join_code,
  (select count(*) from public.class_members cm where cm.class_id = c.id)::int as student_count,
  (select count(*) from public.assignments a where a.class_id = c.id)::int as assignment_count,
  coalesce((
    select round(avg(sp.score)::numeric, 1)
    from public.class_members cm
    join public.student_progress sp on sp.student_id = cm.student_id
    where cm.class_id = c.id and sp.status = 'completed'
  ), 0) as average_score,
  (
    select count(*)
    from public.class_members cm
    join public.student_progress sp on sp.student_id = cm.student_id
    where cm.class_id = c.id and sp.status = 'completed'
  )::int as completed_experiments
from public.classes c;

create or replace view public.school_overview
with (security_invoker = true)
as
select
  s.id as school_id,
  s.name,
  s.province,
  s.district,
  s.student_count,
  s.teacher_count,
  s.subscription_plan,
  s.subscription_status,
  s.subscription_expires_at,
  (select count(*) from public.classes c where c.school_id = s.id)::int as class_count,
  coalesce((
    select round(avg(sp.score)::numeric, 1)
    from public.student_progress sp
    join public.profiles p on p.id = sp.student_id
    where p.school_id = s.id and sp.status = 'completed'
  ), 0) as average_score
from public.schools s;

-- ---------------------------------------------------------------------------
-- Privileges (RLS still applies for anon/authenticated)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated, service_role;
revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;
grant select on public.class_performance, public.school_overview to authenticated, service_role;
