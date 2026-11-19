# Phase 1 Audit: User Model & Admin Revision

**Repository:** `D:\my vr lab`
**Audit date:** 2026-10-31
**Scope:** Current routes, access control, user types, `profiles` schema, role values, role reads, signup flow, login flow, and conflicts with the proposed user-model/admin revision.
**Status:** Phase 1 only. No application code, SQL migration, or configuration was changed. This document is the only artifact produced.

---

## Executive summary

1. The application currently has a **single role field** (`profiles.role`) with four values: `student`, `teacher`, `admin`, `partner`. There is no `user_type`, `user_type` column, admin subrole, support role, or individual/school distinction.
2. The admin experience is **not** a separate admin section. There is no `/admin` route, no `src/pages/admin/` directory, no `AdminLayout`, no `AdminGuard`, and no admin tabs. `AdminDashboard` is rendered at `/dashboard` when `user.role === 'admin'` and is a single static page with mock data.
3. **`profiles.school_id` is already nullable.** The proposed change that assumes it must be made nullable is unnecessary. However, no signup or checkout flow currently assigns a real school to a new user.
4. The current signup path always creates a **student** profile. Supabase signup sends only the user's name as metadata; the database trigger assigns `role = 'student'`. There is no role selector and no school selection.
5. The role model is partly unused: `partner` exists in TypeScript and database/RLS rules, but has no dashboard branch, no navigation, no admin UI, and is blocked by the `/dashboard` route guard.
6. Adding `user_type` without updating `protect_profile_fields()` would allow users to change their own `user_type` through the existing self-update policy. This is the highest-risk schema concern.
7. Admin user-management functionality does not exist yet. There are no service functions for listing, creating, disabling, or editing users, and the admin page is presentational only.

---

## 1. Current routes and access rules

All routes are defined in `src/App.tsx` and use `BrowserRouter`.

| Path | Guard | Allowed role(s) | Component / behavior | Notes |
|---|---|---|---|---|
| `/` | None | Public | `HomePage` | Public landing page |
| `/demo` | None | Public | `DemoPage` | AI assistant host is hidden here |
| `/pricing` | None | Public | `PricingPage` | Requires login only when subscribing |
| `/subscription/callback` | None | Public | `SubscriptionCallback` | Flutterwave return page |
| `/login` | None | Public | `LoginPage` | Authenticated users are not redirected away |
| `/register` | None | Public | `RegisterPage` | Always registers as student |
| `/dashboard` | `PrivateRoute` | `student`, `teacher`, `admin` | `Layout` + one dashboard | Branches on `user.role`; partner excluded |
| `/labs/biology` | `PrivateRoute` | `student` | `Layout` + `BiologyLabPage` | |
| `/labs/chemistry` | `PrivateRoute` | `student` | `Layout` + `ChemistryLabPage` | |
| `/labs/physics` | `PrivateRoute` | `student` | `Layout` + `PhysicsLabPage` | |
| `/labs/agriculture` | `PrivateRoute` | `student` | `Layout` + `AgricultureLabPage` | |
| `/experiments/dna-extraction` | `PrivateRoute` | `student` | `Layout` + `DNAExtractionPage` | |
| `/experiments/:slug` | `PrivateRoute` | `student` | `Layout` + `ExperimentPage` | |
| `*` | None | Public | `NotFoundPage` | |

### Guard behavior

`src/components/auth/PrivateRoute.tsx:16`:

- Unauthenticated users are redirected to `/login`.
- If `allowedRoles` is supplied and the current role is not included, the user is redirected to `/dashboard`.
- There is no `user_type` or admin-section guard.
- No route is guarded by `partner`, so a partner has no accessible authenticated page. A partner visiting `/dashboard` is redirected back to `/dashboard`, which also excludes them. Depending on router behavior this is a blank page or a redirect loop.

### Navigation behavior

`src/components/layout/Layout.tsx`:

- Student links are shown at line 47: four subject labs.
- Teacher links are shown at line 76: "My Classes", "Assignments", "Student Progress", all pointing to `/dashboard`.
- Admin links are shown at line 99: "Users", "Schools", "Analytics", all pointing to `#`; none have routes.
- Every authenticated role sees the Dashboard link.

### Missing admin infrastructure

The following are referenced by the proposed revision but do not exist:

- `/admin` or `/admin/*` routes
- `src/pages/admin/` directory
- `src/pages/admin/AdminLayout.tsx`
- `src/pages/admin/AdminGuard.tsx`
- Admin tab components
- Admin user-management API/service functions

`src/pages/AdminDashboard.tsx` is the only admin page. It uses only `useAuth()` for the display name. It has no `onClick`, `useState`, `useEffect`, `useQuery`, `backendService`, or Supabase calls. All figures (120 schools, 31.5K users, 156.8K experiments, 99.8% uptime, regional counts) are hardcoded mock values.

---

## 2. Implied user types

### Stored/runtime types

| Type | Evidence | Current behavior |
|---|---|---|
| Anonymous visitor | Public routes | Can view home, demo, pricing, login, register |
| `student` | `UserRole`, default DB role, self-registration | Can access dashboard and all labs/experiments. Labs and experiments are student-only routes |
| `teacher` | `UserRole`, RLS, demo user | Can access `/dashboard`, but all teacher navigation targets `/dashboard`; teacher data is mostly localStorage-backed in the existing UI |
| `admin` | `UserRole`, RLS, demo user | Can access `/dashboard` and the static `AdminDashboard`; database `is_admin()` grants broad management access |
| `partner` | `UserRole`, DB check constraint, some school-scoped RLS policies | No dashboard branch, no nav, no reachable authenticated page; only DB/RLS support exists |
| `school` | `get_school_analytics()` payload `'role': 'school'`; `subscription_plan = 'school'` | Not a stored profile role. It is an analytics label and a subscription plan |

### Individual vs school

There is no explicit individual/school account type.

- A user can be inferred to be attached to a school only when `profiles.school_id` is non-null.
- Self-registration never sets `school_id`.
- The only user creation trigger never sets `school_id`.
- Admin provisioning UI does not exist.
- A school subscription can be purchased while `profiles.school_id` is null; `flutterwave-initiate` stores `school_id = null` for the school plan in that case. The subscription still inserts because `user_id` is present.

### Admin subroles

None. `public.is_admin()` is the only admin check and returns true only for `role = 'admin'`. Every admin-management RLS policy uses `is_admin()`, so a new read-only support role cannot safely reuse it without also acquiring write access.

---

## 3. Current `profiles` schema

Defined in `supabase/migrations/20261031000000_novalab_backend.sql:28-43`.

| Column | Type | Nullability / default | Constraints |
|---|---|---|---|
| `id` | `uuid` | Primary key | References `auth.users(id)` `on delete cascade` |
| `name` | `text` | `not null default ''` | |
| `email` | `text` | Nullable | `unique` |
| `role` | `text` | `not null default 'student'` | `check (role in ('student', 'teacher', 'admin', 'partner'))` |
| `subjects` | `text[]` | `not null default '{}'` | |
| `school_id` | `uuid` | **Nullable** | References `public.schools(id)` `on delete set null` |
| `avatar_url` | `text` | Nullable | |
| `subscription_plan` | `text` | `not null default 'free'` | `check (subscription_plan in ('free', 'monthly_premium', 'school'))` |
| `subscription_status` | `text` | `not null default 'inactive'` | `check (subscription_status in ('inactive', 'active', 'trial', 'pending'))` |
| `subscription_expires_at` | `timestamptz` | Nullable | |
| `subscription_reference` | `text` | Nullable | |
| `subscription_provider` | `text` | `not null default 'flutterwave'` | |
| `created_at` | `timestamptz` | `not null default now()` | |
| `updated_at` | `timestamptz` | `not null default now()` | Maintained by `set_updated_at()` trigger |

Index: `profiles_role_idx` on `role` (`supabase/migrations/20261031000000_novalab_backend.sql:174`).

### `profiles` triggers and functions

- `handle_new_user()` (`:297-324`)
  - Runs after insert on `auth.users`.
  - Inserts `id`, `name`, `email`, `role = 'student'`, `subjects = '{}'`.
  - On conflict, updates only `name`, `email`, `updated_at`; does not overwrite `role` or `subjects`.
  - `school_id` is left at its default (null).
- `handle_user_email_change()` (`:326-340`)
  - Synchronizes `profiles.email` when `auth.users.email` changes.
- `protect_profile_fields()` (`:343-365`)
  - For self-updates by a non-admin, restores `role`, `school_id`, `subscription_plan`, `subscription_status`, `subscription_expires_at`, and `subscription_reference` to their old values.
  - It does **not** protect any future `user_type` column.
- `set_updated_at()` (`:190-202`) maintains `updated_at`.

### `profiles` RLS

From `supabase/migrations/20261031000000_novalab_backend.sql:838-868`:

| Policy | Operation | Rule |
|---|---|---|
| `Profiles: self or staff can view` | SELECT | Self, `is_admin()`, teacher of the student, or same-school staff when `app_role() in ('teacher','admin','partner')` |
| `Profiles: admins insert` | INSERT | `is_admin()` only (normal inserts come from the SECURITY DEFINER trigger) |
| `Profiles: update self` | UPDATE | Self or `is_admin()` |
| `Profiles: admins delete` | DELETE | `is_admin()` only |

Because the self-update policy allows a user to update their own row, any new profile column must be considered user-writable unless the protection trigger is extended.

### Other relevant schema

- Only one migration exists: `20261031000000_novalab_backend.sql`.
- Only two Edge Functions exist: `flutterwave-initiate` and `flutterwave-webhook` (plus `_shared`).
- `schools` has its own subscription fields and is readable by school members or admins.
- `subscriptions` has nullable `user_id` and `school_id`, requires at least one to be non-null, and allows statuses `inactive`, `active`, `trial`, `pending`, `cancelled`.

---

## 4. Current role values

### TypeScript

`src/types/index.ts:4`:

```ts
export type UserRole = 'student' | 'teacher' | 'admin' | 'partner';
```

`src/services/authService.ts:8` repeats the same list in `USER_ROLES`.

`src/services/backendService.ts:28` hard-codes the same union in `ProfileRow`.

### Database

`profiles.role`:

- Default: `'student'`
- Allowed: `'student'`, `'teacher'`, `'admin'`, `'partner'`
- Indexed by `profiles_role_idx`

### Runtime validation

- `authService.ts:142` validates profile roles against the four-value list.
- `authService.ts:161` falls back to `'student'` if an unknown role is returned.
- Offline registration at `authService.ts:246` preserves only `teacher`; any other requested role becomes `student`.
- Supabase registration ignores the requested role entirely and sends only `{ name }` as metadata.

### Not stored roles

- `'school'` appears as the `role` value inside the `get_school_analytics()` JSON payload, and as a `subscription_plan` value. It is not a `profiles.role`. 
- There is no `'support'`, `'super_admin'`, `'individual'`, or `'school_user'` value today.

---

## 5. Every place role is read

### Client-side TypeScript

| Location | What it does |
|---|---|
| `src/types/index.ts:4` | Defines `UserRole` |
| `src/types/index.ts:15` | Stores `role` on `User` |
| `src/App.tsx:69` | Passes `user?.role` and `allowedRoles={['student','teacher','admin']}` to the dashboard guard |
| `src/App.tsx:71-73` | Chooses `StudentDashboard`, `TeacherDashboard`, or `AdminDashboard` by role |
| `src/App.tsx:83, 93, 103, 113, 125, 135` | Restricts all lab and experiment routes to `student` |
| `src/components/auth/PrivateRoute.tsx:6-7, 16` | Typed role guard and `allowedRoles.includes(role)` check |
| `src/components/layout/Layout.tsx:47` | Student navigation |
| `src/components/layout/Layout.tsx:76` | Teacher navigation |
| `src/components/layout/Layout.tsx:99` | Admin navigation |
| `src/hooks/useAuth.tsx:58, 127` | `register` accepts a `UserRole` and forwards it |
| `src/services/authService.ts:33` | `StoredUser.role` |
| `src/services/authService.ts:116` | `ProfileRow.role` |
| `src/services/authService.ts:130` | Copies role into the app user |
| `src/services/authService.ts:142` | `isUserRole` validator |
| `src/services/authService.ts:161` | Maps unknown DB role to `student` |
| `src/services/authService.ts:194` | `registerUser` role parameter |
| `src/services/authService.ts:246, 252` | Offline role clamping and stored role |
| `src/services/authService.ts:264` | Returned registered user role |
| `src/services/authService.ts:332` | Restored offline user role |
| `src/services/authService.ts:348` | Demo user role |
| `src/services/backendService.ts:28` | `ProfileRow.role` union |
| `src/services/backendService.ts:115` | `BackendProfile.role` |
| `src/services/backendService.ts:202` | Maps `row.role` into `BackendProfile` |
| `src/pages/RegisterPage.tsx:40` | Always passes `'student'` |
| `src/pages/LoginPage.tsx:70-71` | Logs in, then navigates to `/dashboard`; no role check |
| `src/pages/AdminDashboard.tsx` | No role reads beyond being rendered by `App.tsx` |
| `src/services/authService.test.ts:27-29, 47-49` | Tests depend on demo `teacher`, `student`, and `admin` roles |

### Database functions and triggers

| Location | Role behavior |
|---|---|
| `supabase/migrations/20261031000000_novalab_backend.sql:204-212` | `app_role()` returns the current user's role |
| `:224-235` | `is_admin()` returns true only for `role = 'admin'` |
| `:297-324` | `handle_new_user()` always creates `role = 'student'` |
| `:343-365` | `protect_profile_fields()` freezes role, school, and subscription fields for self-updates |
| `:405-423` | School counts count `role = 'student'` and `role = 'teacher'` |
| `:712-735` | `get_school_analytics()` counts students/teachers; gated by `is_admin()` or same school |
| `:761-778` | `get_platform_analytics()` counts students, teachers, partners; gated by `is_admin()` |
| `:620-640` | `get_teacher_analytics()` returns `role: 'teacher'` but does not check role |
| `:648-705` | `get_student_analytics()` authorizes self, admin, or teacher-of-student |
| `:829-835` | `schools` visibility uses same-school membership or `is_admin()` |
| `:839-868` | `profiles` policies described in section 3 |
| `:888-895` | Classes visible to teacher, enrolled student, admin, or same-school `teacher`/`admin`/`partner` |
| `:898-903` | Class creation requires `app_role() in ('teacher','admin')` |
| Other class/assignment/progress policies | Mostly use `teacher_id`, `teaches_class()`, `is_enrolled()`, `teacher_of_student()`, and `is_admin()` rather than comparing role strings |
| `flutterwave-initiate/index.ts:50, 71` | Reads profile name, email, and `school_id`; does not read role |
| `flutterwave-webhook/index.ts` | Does not read role |

### Important consequence

The client trusts the role returned by `profiles`, and the database does not trust client metadata. This is the correct foundation to preserve. The new `user_type` must follow the same rule: it must be assigned server-side, not accepted from signup metadata or client input.

---

## 6. Current signup flow

### Email/password signup

1. `RegisterPage.tsx` collects name, email, password, and confirmation. There is no role selector, school selector, or plan selector.
2. It validates password length (minimum 6) and matching confirmation.
3. It calls `register(name, email, password, 'student')` at `RegisterPage.tsx:40`.
4. `useAuth.register` calls `registerUser` and caches the returned user in `sessionStorage` under `novalab:user`.
5. With Supabase configured, `registerUser` calls `supabase.auth.signUp` with:
   - normalized email
   - password
   - metadata `{ name }` only
6. The `on_auth_user_created` trigger creates the profile with `role = 'student'` and no `school_id`.
7. If Supabase returns no session (email confirmation enabled), the code throws a message asking the user to confirm their email before signing in.
8. If a session exists, it loads the profile immediately and retries once after 300 ms if the trigger-created profile is not visible yet.
9. If the profile still cannot be loaded, registration throws and asks the user to sign in again.
10. There is no transactional way to set a role or school during this flow. Admin provisioning is not implemented.

### Offline/demo signup

Enabled only when Supabase is not configured and `VITE_ENABLE_OFFLINE_MODE` is true.

1. Checks for duplicate emails against stored users and demo users.
2. Clamps the requested role with `role === 'teacher' ? 'teacher' : 'student'`; admin and partner requests become student.
3. Hashes the password with SHA-256 over `email:password`.
4. Stores the user in `sessionStorage` under `novalab:mock-users`.
5. Returns a student or teacher user. No school is assigned.

### OAuth

- OAuth is offered on the **login** page, not the registration page.
- `signInWithProvider` calls `supabase.auth.signInWithOAuth` with `redirectTo = <origin>/dashboard`.
- A first-time OAuth user is created by the same auth trigger as a student.
- There is no dedicated OAuth callback route; the app relies on session restoration after returning to `/dashboard`.

---

## 7. Current login, session, and logout flow

### Email/password login

1. `LoginPage` calls `useAuth.login`.
2. `authenticateUser` uses `supabase.auth.signInWithPassword` when Supabase is configured.
3. It fetches the profile with `select('*')` and maps it through `mapSupabaseUser`.
4. Role is accepted only if it is one of the four known values; otherwise it becomes `student`.
5. The user is cached in `sessionStorage` under `novalab:user`.
6. `LoginPage` navigates to `/dashboard`, where the role decides which dashboard renders.

### Offline login

1. Stored offline users are checked first using the hashed password.
2. Demo users are checked second with plaintext demo passwords:
   - `student@example.com` / `password` / student
   - `teacher@example.com` / `password` / teacher
   - `admin@example.com` / `password` / admin
3. There is no demo partner account.
4. Invalid credentials return null, and the UI reports "Invalid email or password".

### Session restoration

`AuthProvider.restoreSession` runs on mount:

- With Supabase configured: calls `supabase.auth.getSession()` with an 8-second timeout, then reloads the profile from the database. It does not fall back to the cached user when Supabase is configured but no session exists.
- Without Supabase: reads `novalab:user` from `sessionStorage` (or an in-memory fallback).
- The cache contains the full `User` object, so any newly added field must tolerate older cached objects that lack it.

### Logout

- Clears the in-memory user and the `sessionStorage` cache.
- Calls `supabase.auth.signOut()` when Supabase is configured.
- `Layout.handleLogout` does not await the async logout before navigating home.

---

## 8. Conflicts with the proposed revision

| # | Proposed assumption | Actual current state | Impact |
|---|---|---|---|
| 1 | `profiles.school_id` is NOT NULL and must be made nullable | It is already nullable (`school_id uuid references schools(id) on delete set null`) | No nullability migration is needed; effort should go to assigning schools |
| 2 | A `user_type` field is being added alongside existing behavior | No `user_type` exists in the database, `User`, `ProfileRow`, demo users, or auth mapping | Additive schema/type/UI work required; all mapping and validation must be extended |
| 3 | Admin page/layout/guard/tabs already exist and should be revised | Only `AdminDashboard.tsx` exists, at `/dashboard`, with no tabs, no data fetching, no actions, and mock metrics | Phase 2 is effectively building a new admin section, not revising one |
| 4 | Admin users have subroles such as super admin and support | Only `role = 'admin'`; `is_admin()` is all-or-nothing | Support read-only access cannot reuse `is_admin()` without granting write access |
| 5 | Existing admin page is reachable at an admin route | No `/admin` route exists; admin page is the `/dashboard` branch | Adding `/admin` must preserve `/dashboard` behavior to avoid breaking current admins |
| 6 | User management UI/API exists | No admin service functions for list/create/disable/edit users; admin action cards have no handlers | New API/service/UI work required; RLS already permits admin writes but there is no interface |
| 7 | School users can be created through signup | No school field, no school assignment, no school onboarding, no school selection at checkout | School membership cannot be established today except by direct DB/admin action |
| 8 | Individual vs school is a meaningful stored distinction | Distinction is only inferable from nullable `school_id`; no explicit type | A new `user_type` will need a backfill rule and consistency rules against `role` and `school_id` |
| 9 | `partner` is a usable user type | Partner exists in types/DB/RLS but has no UI/dashboard branch and is excluded from `/dashboard` | Must decide whether partner maps to a `user_type`, remains a role, or becomes unsupported |
| 10 | Payment can be extended with a `solo` flag | `subscriptions.metadata` exists, but `startSubscriptionCheckout` sends only the plan and `flutterwave-initiate` records only origin/customer email | The flag has no current producer or consumer; adding it is additive but must not alter existing plan behavior |
| 11 | Role and user type are independent | Role controls routes, RLS, analytics, and self-protection; user type would overlap with school membership and admin privileges | Need explicit precedence rules; otherwise UI access and database access can diverge |
| 12 | Existing role checks can remain untouched | Role checks exist in routing, nav, auth mapping, DB functions, RLS, and analytics | Preserving them is required, but new user types must be layered without changing `role` semantics |

---

## 9. Risks for the additive Phase 2 implementation

### High priority

1. **Self-escalation through `user_type`.** `Profiles: update self` allows users to update their own profile. `protect_profile_fields()` restores `role`, `school_id`, and subscription fields but would not restore a new `user_type`. The trigger must be extended in the same additive migration that adds the column, or users can set their own type.
2. **Support staff and RLS.** `is_admin()` grants read and write across nearly every table. Making support staff `role = 'admin'` would give them write access. A separate read-only helper/policy set is needed if support is read-only.
3. **Admin section does not exist.** The proposal should not assume existing tabs, route guards, or user-management components. Adding `/admin` and `/admin/*` must not replace the current `/dashboard` admin branch until the new section is verified, or current admins lose their only admin view.
4. **School assignment is missing at the source.** Making `school_id` nullable is already done, but no flow writes it. School subscriptions can currently be created with `school_id = null`, so any school-scoped analytics or management feature will be unreliable until assignment is handled.
5. **No admin provisioning flow.** Roles are assigned only through direct database/admin updates. Self-signup always creates a student. Teacher/admin creation currently requires manual database work.

### Medium priority

6. **`partner` route behavior.** Adding `user_type` without addressing `partner` leaves an existing role with no reachable dashboard. If partner is intended to remain, it needs an explicit route/dashboard decision; if not, its removal must be deliberate.
7. **Stale session cache.** `sessionStorage` may contain an old `User` without `user_type`. Hydration and restoration must default missing fields safely, and tests should cover this.
8. **Test assumptions.** Existing auth tests expect demo student, teacher, and admin roles. Any changes to demo users or role mapping must preserve those expectations or update tests intentionally.
9. **Database validation absent.** Only one migration exists and it has not been applied/validated in this environment. There is no local Supabase CLI, Docker, or Postgres to test RLS and triggers. Phase 2 SQL must be reviewed as text and applied by the operator.
10. **Admin analytics are role-gated.** `get_platform_analytics()` and `get_school_analytics()` are `SECURITY DEFINER` functions gated by `is_admin()` or school membership. New support user types need a conscious decision about whether they can call these or need new functions.

### Lower priority / consistency

11. **Overlapping concepts.** `role`, `subscription_plan = 'school'`, `school_id`, and a future `user_type` can disagree. Define invariants and decide which field is authoritative for each behavior.
12. **No `/admin` deep links.** Admin nav items point to `#`; adding routes will not conflict with existing links but will not automatically update them either.
13. **`register` signature still accepts a role.** Supabase ignores it, offline clamps it, and the only caller passes student. This parameter is a latent source of confusion when adding user types; server-side assignment remains mandatory.
14. **Payment metadata compatibility.** The webhook and initiate function already use `subscriptions.metadata`. A future `solo` flag should be additive and must not change the existing `monthly_premium`/`school` amounts or status transitions.

---

## 10. Baseline verification

These were confirmed before this audit was finalized:

- `npx tsc --noEmit`: clean.
- `npx vitest run`: 2 test files, 9 tests passing.
- `npm run build`: succeeds; output `dist/assets/index-B5cVryCP.js` is 929.12 kB minified / 254.23 kB gzip.
- `npm run lint`: not usable because ESLint cannot find a configuration file.
- Development server responded with HTTP 200 at `http://127.0.0.1:5187`.
- Browser visual verification was inconclusive: a headless Edge screenshot was only 5,289 bytes and `--dump-dom` timed out. No Playwright/Puppeteer is installed.

---

## Phase 1 stop point

No code, SQL, dependencies, routes, RLS policies, or configuration were changed during this audit. The next phase must wait for review and approval of the findings above, especially:

- whether `user_type` replaces or supplements `role`
- how existing students, teachers, admins, and partners map to the new types
- whether admin splits into super admin and read-only support
- where the new admin section lives and whether `/dashboard` remains the fallback
- how school membership is established
- whether `school_id` should become required for school user types
- what the `solo` payment flag is attached to and who sets it
