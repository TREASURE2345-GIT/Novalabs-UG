-- Allow self-service sign-ups to choose a student, teacher, or partner role.
-- Administrator accounts remain provisioned by an existing administrator.
-- Role and subjects are read from the sign-up metadata supplied by the app.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'student');
  v_subjects text[] := '{}'::text[];
begin
  if v_role not in ('student', 'teacher', 'partner') then
    v_role := 'student';
  end if;

  if v_role = 'teacher' and jsonb_typeof(new.raw_user_meta_data -> 'subjects') = 'array' then
    select coalesce(array_agg(subject), '{}'::text[])
      into v_subjects
      from (
        select jsonb_array_elements_text(new.raw_user_meta_data -> 'subjects') as subject
      ) as requested
      where subject in ('biology', 'chemistry', 'physics', 'agriculture');
  end if;

  insert into public.profiles (id, name, email, role, subjects)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(coalesce(new.email, ''), '@', 1)),
    new.email,
    v_role,
    v_subjects
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;
