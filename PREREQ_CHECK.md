# PREREQ_CHECK.md

**Task:** NovaLab admin experience (8 pages, shared library, 4 security layers)  
**Repository:** `D:\my vr lab`  
**Date:** 2026-10-31  
**Method:** Read-only static inspection of `supabase/migrations/20261031000000_novalab_backend.sql`, `package.json`, and the `src/` tree. No database connection was available.

## Result

**BLOCKED — 1 PASS, 5 FAIL.**

Per the task instructions, I stopped before writing any admin code. The latest migration does not contain the admin data model, audit model, consent model, or admin-level values required by the task. The schema must be added in a separate migration task before the admin experience can be built.

## Required Checks

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | `profiles` has `user_type`, `admin_level`, `subscription_tier`, `subscription_status`, `subscription_expires_at` | **FAIL** | Only `subscription_status` and `subscription_expires_at` exist. `user_type`, `admin_level`, and `subscription_tier` are absent. The table uses `subscription_plan` instead of `subscription_tier`. See migration lines 28–43. |
| 2 | `audit_log` exists with all required columns | **FAIL** | No `audit_log` table, columns, indexes, or policies exist anywhere in `src/` or `supabase/`. |
| 3 | `guardian_consents` exists | **FAIL** | No `guardian_consents` table, columns, or policies exist anywhere in `src/` or `supabase/`. |
| 4 | `profiles.user_type` includes `school_student`, `school_teacher`, `solo_student`, `solo_teacher`, `admin`, `super_admin`, `support_admin` | **FAIL** | `user_type` does not exist. The current role check only allows `student`, `teacher`, `admin`, `partner`. See migration line 32. |
| 5 | Admin read RLS exists on all 11 tables | **FAIL** | 10 of 11 tables have an admin-readable policy, but `audit_log` does not exist. See matrix below. |
| 6 | `get_teacher_analytics`, `get_school_analytics`, `get_platform_analytics` RPCs exist | **PASS** | All three exist at migration lines 636, 712, and 761. They are old-model RPCs and do not use `user_type`/`admin_level`. Stub/adapt calls as needed in a later task. |

## Check 5 — RLS Matrix

Current admin access is binary: `public.is_admin()` checks only `profiles.role = 'admin'`. There is no `support_admin`, `super_admin`, `school` admin level, or platform scoping.

| Table | Admin read | Notes |
|-------|------------|-------|
| `profiles` | PASS | `Profiles: self or staff can view` uses `is_admin()` |
| `schools` | PASS | `Schools: members can view own school` uses `is_admin()` |
| `classes` | PASS | `Classes: teacher, member, school staff, admin can view` |
| `class_members` | PASS | `Class members: student, teacher, admin can view` |
| `assignments` | PASS | `Assignments: class participants can view` |
| `assignment_submissions` | PASS | `Submissions: student or teacher can view` |
| `student_progress` | PASS | `Progress: student or teacher can view` |
| `subscriptions` | PASS | `Subscriptions: owner or admin can view` |
| `student_questions` | PASS | `Questions: student, teacher or admin can view` |
| `teacher_videos` | PASS | `Videos: authenticated users can view`; this includes admins |
| `audit_log` | **FAIL** | Table and policies do not exist |

## Additional Blockers Found While Reading the Task’s File List

These are not part of the six schema checks above, but they also prevent the task as written:

- `src/components/layout/SyncStatus.tsx` does not exist. `AdminShell` requires it.
- `src/stores/syncStore.ts` does not exist.
- `src/i18n/locales/en.json` does not exist, and `react-i18next`/`i18next` are not installed. The non-negotiable `t()` requirement cannot be met yet.
- `src/components/admin/`, `src/pages/admin/`, and `src/services/adminService.ts` do not exist.
- `src/types/index.ts` still defines the old four-role model: `student | teacher | admin | partner`.
- `src/components/auth/PrivateRoute.tsx` does not know `super_admin` or `support_admin`.
- Missing dependencies for the required test stack: `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@playwright/test`, `axe-core`/`vitest-axe`.
- `recharts` is not installed; the task permits hand-built SVG charts as a fallback.
- Missing scripts required by Phases 6–7: `test`, `typecheck`, `test:e2e`, `build:analyze`.
- `npm run lint` cannot run because there is no ESLint configuration file.

## Required Follow-Up

A separate migration task must add, at minimum:

1. `profiles.user_type` with the seven required values.
2. `profiles.admin_level` (`school`, `support`, `platform`).
3. `profiles.subscription_tier` with a migration from `subscription_plan`.
4. `audit_log` with the required columns, indexes, and admin read policy.
5. `guardian_consents` with the required columns and RLS.
6. Admin-level-aware RLS policies covering school, support, and platform scopes.
7. Updated analytics RPCs for the new populations and admin levels.

No schema changes were made in this task. No admin components, routes, services, hooks, Edge Functions, or tests were created.
