-- Optional demo data. Auth users must be created through Supabase Auth first,
-- because public.profiles rows are created automatically by the
-- on_auth_user_created trigger.

insert into public.schools (
  id, name, province, district, internet_access, icti_readiness
)
values (
  '00000000-0000-4000-8000-000000000001',
  'NovaLab Demo Secondary School',
  'Central',
  'Kampala',
  true,
  'high'
)
on conflict (id) do nothing;
