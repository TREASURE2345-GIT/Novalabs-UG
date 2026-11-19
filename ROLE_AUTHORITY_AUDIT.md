# ROLE_AUTHORITY_AUDIT.md

**Task:** Fix role authority across NovaLab — Step 0 audit  
**Repository:** `D:\my vr lab`  
**Date:** 2026-10-31  
**Scope:** Read-only audit. No source, migration, or configuration changes were made.

## Severity Scale

- **CRITICAL** — enables privilege escalation or grants admin access.
- **HIGH** — enables forged UI; backend/RLS is expected to block data access.
- **MEDIUM** — functional or data-integrity defect; no direct escalation.
- **LOW** — cosmetic or informational.

## Executive Summary

`public.profiles.role` is the primary role source for the normal Supabase login path, but it is **not the sole authority**. The app also trusts a full user object cached in `sessionStorage`, an offline user store containing roles, and hardcoded demo accounts — including a publicly documented admin account. The register form does not expose an admin option, and registration does not write a role to `user_metadata`.

The database has a profile-field guard, but it silently restores old values instead of rejecting the update, and it does not cover `user_type`, `admin_level`, or `subscription_tier`. Those columns do not exist yet, so **Step 1 is blocked** by the task's schema prerequisite.

## Blocking Prerequisite

`profiles` currently has `subscription_status` and `subscription_expires_at`, but it does **not** have:

- `user_type`
- `admin_level`
- `subscription_tier`

It also does not have `audit_log` or `guardian_consents`, and the role check constraint only allows `student`, `teacher`, `admin`, and `partner`.

Per the task instructions, I am stopping before Step 1 and reporting that a separate schema migration is required. See `PREREQ_CHECK.md` for the schema audit.

---

## 1. Where Is the User's Role Currently Read From?

| Source | Location | How it is used | Severity |
|---|---|---|---|
| `public.profiles.role` | `src/services/authService.ts:174-183` fetches the profile; `:150-172` maps it; `:161` assigns `role` | Primary online role source | **MEDIUM** because of the silent default on invalid data |
| `public.profiles.role` through `loadSupabaseUser` | `src/services/authService.ts:185-188`; called by `useAuth.tsx:76` and `authService.ts:310` | Session restore, login, OAuth callback hydration | **LOW** (correct source) |
| `sessionStorage['novalab:user']` | `src/hooks/useAuth.tsx:13`, `:28-34`, `:79`, `:86-89`, `:111`, `:131`, `:140` | Full `User` JSON, including `role`, is cached and trusted when Supabase is not configured | **HIGH** |
| `sessionStorage['novalab:mock-users']` | `src/services/authService.ts:6`, `:96-110`, `:237-258`, `:322-335` | Offline registration/login store containing client-writable `role` and password hash | **HIGH** |
| Hardcoded `demoUsers` | `src/services/authService.ts:66-70` | Three fixed accounts, including `admin@example.com` / `password` with `role: 'admin'` | **CRITICAL when offline mode is enabled** |
| Public demo credentials | `src/pages/LoginPage.tsx:184-191` | Displays the admin email and shared password to every visitor | **CRITICAL when offline mode is enabled** |
| `user` state derived from the above | `src/hooks/useAuth.tsx:65`, `:78-80`, `:110-111`, `:130-131` | Drives `isAuthenticated`, routing, and navigation | **HIGH** (forged UI; RLS expected to block data) |
| `App.tsx` route decisions | `src/App.tsx:69-73`, `:83`, `:93`, `:103`, `:113`, `:125`, `:135` | Chooses dashboard and lab routes from `user?.role` | **HIGH** (forged UI) |
| `PrivateRoute` | `src/components/auth/PrivateRoute.tsx:11-17` | Allows/redirects based on the `role` prop | **HIGH** (forged UI) |
| `Layout` navigation | `src/components/layout/Layout.tsx:47`, `:76`, `:99` | Shows student/teacher/admin navigation from `user?.role` | **MEDIUM** (forged navigation) |
| `backendService` profile mapping | `src/services/backendService.ts:198-210`, especially `:202` | Copies `row.role` from `profiles` into `BackendProfile`; no auth decision found | **LOW** (data mapping only) |
| Supabase session storage | `src/lib/supabase.ts:4-11` | Stores the Supabase session/JWT in `sessionStorage`; the app does not decode a role from the JWT | **LOW** (no JWT role authority) |

### Sources explicitly checked and not found

- **`user_metadata.role`:** Not read anywhere. `user_metadata` is only read for `name` at `authService.ts:153`. `registerUser` writes only `{ name }` at `authService.ts:205`.
- **`app_metadata.role`:** Not read anywhere.
- **JWT role claim:** Not decoded or read anywhere. RLS uses `auth.uid()` plus profile lookups.
- **URL params / query string role:** Not read anywhere.
- **Cookies:** No role cookie is read or written.

### Login payload

The login payload is correct and contains only email and password:

- `src/pages/LoginPage.tsx:70` calls `login(email, password)`.
- `src/hooks/useAuth.tsx:103-105` calls `authenticateUser(email, password)`.
- `src/services/authService.ts:300-305` calls `supabase.auth.signInWithPassword({ email, password })`.

**Result: PASS** for the login-payload principle.

---

## 2. Is `profiles.role` Ever the Primary Source, or Only a Fallback?

**Online path: primary source, but not the only source.**

- `loadSupabaseUser` fetches the profile and maps `profile.role` at `authService.ts:174-188` and `:161`.
- Missing profiles return `null`; `authenticateUser` then throws at `authService.ts:310-313`. It does **not** default to a role.
- Invalid role values are silently coerced to `student` at `authService.ts:161`. That is a fallback and violates the “never default” principle.

**Offline/no-Supabase path: not the primary source.**

- When `hasSupabaseConfig` is false, `useAuth.tsx:86-89` restores the entire cached user, including `role`, from `sessionStorage['novalab:user']`.
- Offline login reads `role` from `sessionStorage['novalab:mock-users']` at `authService.ts:322-335`, or from hardcoded `demoUsers` at `:338-351`.

**Overall: FAIL.** The database is authoritative only for the online path. Client caches and hardcoded accounts are authoritative whenever Supabase is not configured.

---

## 3. Does `registerUser()` Validate the Role Before Writing It?

**No explicit validation.**

### Supabase path

- `registerUser` accepts `role: UserRole` at `authService.ts:190-196`.
- It calls `supabase.auth.signUp` with `options.data: { name }` at `:200-208`; it never sends `role`.
- The database trigger `handle_new_user` inserts every new profile with `role = 'student'` at `20261031000000_novalab_backend.sql:297-315`.
- The `role` argument is effectively ignored. A caller passing `admin` does **not** become an admin, so there is no escalation through this path.
- However, the function does not reject `admin`, `super_admin`, `support_admin`, or `partner`, and teacher signup is currently impossible because the trigger always writes `student`.

**Severity: MEDIUM** — missing validation and broken teacher signup; no Supabase privilege escalation.

### Offline path

- `authService.ts:246` coerces any role other than `teacher` to `student`:
  `const safeRole: UserRole = role === 'teacher' ? 'teacher' : 'student';`
- Passing `admin` or `partner` silently creates a student instead of throwing.

**Severity: MEDIUM** — no escalation, but it hides invalid requests and violates fail-closed behavior.

---

## 4. Does `registerUser()` Write Role to `user_metadata`?

**No. PASS.**

- `authService.ts:204-206` writes only `{ data: { name: name.trim() } }`.
- No `role`, `admin_level`, `user_type`, or `school_id` is placed in `user_metadata`.
- The database trigger at `20261031000000_novalab_backend.sql:297-315` reads only the name metadata and hardcodes `'student'` as the role.

No user-metadata role hole was found.

---

## 5. Does the Register Form Allow `admin` or `partner`?

**No. PASS for admin/partner exposure; MEDIUM for the missing teacher option.**

- `RegisterPage.tsx` has no role field, select, or role state.
- `RegisterPage.tsx:40` hardcodes the signup role:
  `await register(formData.name, formData.email, formData.password, 'student');`
- `RegisterPage.tsx:125-127` states that teacher and administrator accounts are created by a school administrator.
- There are no `value="admin"`, `value="partner"`, or equivalent role options in the register form.

The form cannot currently create a teacher through self-signup, which conflicts with the target behavior of allowing student and teacher self-signup.

---

## 6. Does the Migration Guard `profiles.role` From Self-Change?

**Yes, but the guard is incomplete and silent.**

- Trigger: **`protect_profile_fields_trigger`**
- Function: **`public.protect_profile_fields()`**
- Definition: `supabase/migrations/20261031000000_novalab_backend.sql:343-365`
- Timing: `BEFORE UPDATE ON public.profiles FOR EACH ROW`

What it does:

```sql
if auth.uid() is not null and auth.uid() = new.id and not public.is_admin() then
  new.role := old.role;
  new.school_id := old.school_id;
  new.subscription_plan := old.subscription_plan;
  new.subscription_status := old.subscription_status;
  new.subscription_expires_at := old.subscription_expires_at;
  new.subscription_reference := old.subscription_reference;
end if;
```

What it covers:

- `role`
- `school_id`
- `subscription_plan`
- `subscription_status`
- `subscription_expires_at`
- `subscription_reference`

What it does **not** cover:

- `user_type` — column does not exist
- `admin_level` — column does not exist
- `subscription_tier` — column does not exist

Other weaknesses:

- It silently restores the old value instead of `RAISE EXCEPTION`. A tampering attempt succeeds as a no-op and is not audited.
- It only applies when `auth.uid() = new.id`. Other non-admin update paths are expected to be blocked by RLS, but the trigger itself is self-update-scoped.
- `public.is_admin()` only checks `role = 'admin'` at `20261031000000_novalab_backend.sql:224-234`; it does not recognize `super_admin` or `support_admin`.
- The trigger does not implement the task's `profiles_guard_role` / `prevent_profile_role_self_change` behavior.
- There is no `audit_log` write for blocked or attempted role changes.

**Current `role` protection: PARTIAL.**  
**Severity: MEDIUM** — self-role changes are prevented, but the mechanism is silent and does not cover the target privileged columns.  
**Future risk: HIGH** — once `user_type` and `admin_level` are added without an updated guard, they would be self-editable.

---

## 7. Places That Silently Default the Role to `student` on Failure

| Location | Behavior | Severity |
|---|---|---|
| `src/services/authService.ts:161` | `role: isUserRole(profile.role) ? profile.role : 'student'` — an invalid or unexpected `profiles.role` silently becomes `student` | **MEDIUM** — hides data corruption; no escalation |
| `src/services/authService.ts:246` | Offline signup coerces any role except `teacher` to `student` | **MEDIUM** — silently accepts `admin`/`partner` requests as student |
| `supabase/migrations/20261031000000_novalab_backend.sql:309` | `handle_new_user` inserts `'student'` for every new auth user | **LOW/MEDIUM** — intentional default, but it prevents teacher signup and is not a profile-driven choice |

Places that correctly fail closed:

- `authService.ts:310-313`: missing profile after login throws.
- `authService.ts:220-228`: profile not ready after signup throws.
- `useAuth.tsx:86-89`: cached user is used only in the no-Supabase path; there is no `student` default.
- `useAuth.tsx:90-93`: malformed cached user is removed.

No error page exists for an unresolvable role. The current behavior is to leave the user signed out or to trust the stored user, not to route to a dedicated error page.

---

## 8. Places That Cache the User Object, Including Role

### `localStorage`

**No user object or role is cached in `localStorage`.** This differs from the task's premise.

Other `localStorage` uses were checked and do not contain roles:

- `src/services/progressService.ts:40`, `:55`, `:72-88` — experiment progress.
- `src/services/teacherWorkspaceService.ts:42`, `:57` — teacher workspaces.
- `src/services/subscriptionService.ts:31-32` — subscription storage adapter.

**Result: PASS for localStorage role caching.**

### `sessionStorage` — the actual client cache

| Key | Location | Contents | Severity |
|---|---|---|---|
| `novalab:user` | `src/hooks/useAuth.tsx:13`, `:79`, `:86-89`, `:111`, `:131`, `:140` | Full `User` JSON, including `role` | **HIGH** |
| `novalab:mock-users` | `src/services/authService.ts:6`, `:96-110`, `:237-258`, `:322-335` | Offline users, including `role` and password hashes | **HIGH** |
| Supabase auth session | `src/lib/supabase.ts:4-11` | Supabase session/JWT; app does not read a role from it | **LOW** |

`useAuth.tsx` trusts the cached `User` object directly when Supabase is not configured:

```ts
const cachedUser = getUserCacheStorage().getItem(USER_CACHE_KEY);
if (cachedUser) {
  setUser(JSON.parse(cachedUser) as User);
}
```

That cached object includes `role`, and it drives `PrivateRoute` and dashboard routing. A user can edit `sessionStorage['novalab:user']` and forge an admin UI in offline mode. In a Supabase-backed deployment the RLS layer still protects database reads/writes, but the UI is forged.

**Overall: FAIL.** The cache is `sessionStorage`, not `localStorage`; the task's cleanup of `localStorage.removeItem('user')` will not remove `novalab:user`.

---

## Additional Finding — Offline Mode Is Enabled With Placeholder Supabase Values

`.env.production` currently contains:

```env
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder-anon-key-replace-before-deploy
VITE_ENABLE_OFFLINE_MODE=true
```

`src/lib/env.ts:51-62` treats those values as placeholders, so `hasSupabaseConfig` is false. `src/services/authService.ts:64` then enables offline auth because the offline flag is true.

Combined with the public admin credentials in `LoginPage.tsx:184-191`, a production build from this configuration accepts `admin@example.com` / `password` as an admin with no database check.

**Severity: CRITICAL.** This must be resolved before any pilot deployment, independently of the role-service work.

---

## Audit Answers at a Glance

1. **Role sources:** `profiles.role` online; `sessionStorage` user cache; `sessionStorage` mock users; hardcoded demo users; derived client state. No `user_metadata`, JWT, URL, or cookie role reads.
2. **Primary source:** Yes for the online path, but not exclusive and not fail-closed because of the `student` fallback and offline caches.
3. **Register validation:** No explicit validation. Supabase path ignores the role and the DB sets `student`; offline path silently coerces to `student`/`teacher`.
4. **Role in `user_metadata`:** No. Only `name` is written.
5. **Admin/partner in register form:** No. The form hardcodes `student` and exposes no role picker.
6. **Guard trigger:** `protect_profile_fields_trigger` exists. It covers `role` but not `user_type`, `admin_level`, or `subscription_tier`, and it silently resets instead of raising.
7. **Silent student defaults:** `authService.ts:161`, `authService.ts:246`, and the DB trigger at migration line 309.
8. **User/role cache:** No `localStorage` user cache; `sessionStorage['novalab:user']` and `sessionStorage['novalab:mock-users']` cache roles.

## Step 1 Decision

**STOPPED.** The task's Step 1 requires `profiles.user_type` and `profiles.admin_level`. Neither column exists. Per the task instructions, no role service, hook rewrite, auth service rewrite, migration, form change, or test was created.

The schema migration must be completed in a separate task before Step 1 can begin.
