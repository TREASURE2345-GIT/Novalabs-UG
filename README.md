# NovaLab - Frontend

A comprehensive frontend application for the NovaLab platform designed for secondary schools in Uganda. Built with React, TypeScript, Tailwind CSS, and optimized for offline-first learning environments.

## 🎯 Project Overview

This is a full-stack frontend implementation featuring:

- **Multi-Role Dashboard System** - Separate interfaces for Students, Teachers, and Administrators
- **Interactive Virtual Labs** - Biology, Chemistry, Physics, and Agriculture simulations
- **Offline-First Architecture** - Full functionality without internet connectivity
- **Mobile-Responsive Design** - Works seamlessly on phones, tablets, and computers
- **Real-Time Feedback** - Immediate scoring and personalized guidance
- **CBC Alignment** - Content aligned with Uganda's Competency-Based Curriculum

## 📋 Features

### For Students
- Access to interactive science experiments
- Progress tracking and performance analytics
- Real-time feedback and scoring
- AI-powered virtual tutor integration
- Offline-first experiment simulations
- Personalized learning recommendations

### For Teachers
- Class management and student tracking
- Assignment creation and grading
- Performance analytics and reports
- Resource library (lesson plans, videos, assessments)
- Student progress monitoring

### For Administrators
- Platform-wide analytics and reporting
- User and content management
- School administration and subscription management
- System health and performance monitoring
- Policy compliance and data management

### Backend
- Supabase Auth with automatic profile provisioning and role-based access
- PostgreSQL schema for schools, classes, assignments, progress, and teacher workspaces
- Row Level Security (RLS) on every table
- Reporting views and RPC endpoints for student, teacher, school, and platform analytics
- Flutterwave subscription checkout and verified webhook activation
- Offline-first frontend with a typed Supabase service layer for online sync

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser for development

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "c:\Users\PRECIOUS\Desktop\my vr lab"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

   Add your Supabase project URL and anon key:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up the backend** (see [Backend (Supabase)](#-backend-supabase) for details):
   ```bash
   npx supabase login
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5187`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ai/              # AI assistant components
│   ├── apparatus/       # Apparatus illustrations
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout and navigation
│   └── simulations/     # Virtual lab simulations
├── pages/               # Page components (routes)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── StudentDashboard.tsx
│   ├── TeacherDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── labs/            # Lab pages
│   └── experiments/     # Experiment pages
├── hooks/               # Custom React hooks
│   └── useAuth.tsx      # Authentication hook
├── lib/
│   └── supabase.ts      # Supabase client
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── services/            # Local + Supabase service layer
│   ├── authService.ts
│   ├── backendService.ts    # Typed Supabase data API
│   ├── progressService.ts
│   ├── subscriptionService.ts
│   └── teacherWorkspaceService.ts
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles

supabase/
├── config.toml          # Supabase CLI project config
├── migrations/
│   ├── 20261031000000_novalab_backend.sql   # Schema, RLS, triggers, RPCs
│   └── 20261112000000_rbac_hardening.sql    # Permissions, status, audit, admin RPCs
├── functions/
│   ├── _shared/         # Shared CORS and Supabase helpers
│   ├── flutterwave-initiate/   # Creates pending subscription + checkout link
│   └── flutterwave-webhook/    # Verifies payment and activates subscription
├── seed.sql             # Optional demo data
└── .env.example         # Edge Function secrets template
```

## 🛠️ Technology Stack

- **Frontend Framework:** React 18.2.0
- **Language:** TypeScript 5.2.2
- **Styling:** Tailwind CSS 3.4.0
- **Build Tool:** Vite 5.0.8
- **State Management:** React Query + Context API
- **Routing:** React Router DOM 6.20.0
- **Simulations:** p5.js, Three.js (future phases)
- **UI Components:** Custom Tailwind CSS components
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security, Edge Functions)
- **Payments:** Flutterwave hosted checkout + verified webhook
- **Edge Runtime:** Deno (Supabase Edge Functions)

## 🔐 Authentication

Authentication uses Supabase Auth when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured. It supports:

- Email + password sign-up / sign-in
- OAuth providers (Google, X, LinkedIn, Facebook) via Supabase
- Persistent sessions with automatic token refresh
- Role-based access (`student`, `teacher`, `admin`, `partner`) stored in `public.profiles`
- Automatic profile creation through the `on_auth_user_created` trigger

When Supabase is not configured, the app falls back to a local demo/localStorage login so it can run fully offline.

Demo credentials for the offline fallback:
- Email: `student@example.com`
- Password: `password`
- Teacher: `teacher@example.com` / `password`
- Admin: `admin@example.com` / `password`

## 🗄️ Backend (Supabase)

The backend is implemented entirely on Supabase: PostgreSQL for data, Row Level Security for authorization, RPC functions for analytics and class joining, and Deno Edge Functions for Flutterwave payments.

### Architecture

```
React SPA (Vite)
  ├── Supabase JS client (auth + data + RPC)
  └── Edge Functions (payments)
          │
          ▼
Supabase
  ├── Auth (email/password + OAuth)
  ├── PostgreSQL + RLS
  │     ├── profiles, schools, subscriptions
  │     ├── classes, class_members, assignments
  │     ├── assignment_submissions, student_progress
  │     └── teacher_videos, student_questions, online_lectures
  ├── RPC: join_class, activate_subscription, analytics
  └── Edge Functions: flutterwave-initiate, flutterwave-webhook
```

### Prerequisites

- A Supabase project ([supabase.com](https://supabase.com))
- Supabase CLI: `npm install -g supabase` (or use `npx supabase`)
- Docker Desktop for running the stack locally
- A Flutterwave account with API keys and a webhook secret hash

### 1. Configure frontend environment

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Link and push the database schema

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

This applies `supabase/migrations/20261031000000_novalab_backend.sql`, which creates the schema, indexes, triggers, RPCs, reporting views, RLS policies, and grants.

Optional demo data:

```bash
npx supabase db seed
```

### 3. Configure Edge Function secrets

Copy the template and fill in real values:

```bash
cp supabase/.env.example supabase/.env
```

| Secret | Required | Purpose |
|--------|----------|---------|
| `FLUTTERWAVE_SECRET_KEY` | Yes | Server-side Flutterwave API key |
| `FLUTTERWAVE_WEBHOOK_HASH` | Yes | Must match the webhook secret hash set in Flutterwave |
| `SITE_URL` | Recommended | Frontend origin used for the payment redirect (defaults to request origin) |

Push them to the project:

```bash
npx supabase secrets set --env-file supabase/.env
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically by Supabase.

### 4. Deploy Edge Functions

```bash
npx supabase functions deploy flutterwave-initiate
npx supabase functions deploy flutterwave-webhook --no-verify-jwt
```

The webhook must be publicly reachable, so JWT verification is disabled for it in `supabase/config.toml`; it authenticates requests with the `verif-hash` header instead.

### 5. Configure the Flutterwave webhook

In the Flutterwave dashboard set:

- **URL:** `https://<project-ref>.functions.supabase.co/flutterwave-webhook`
- **Secret hash:** the same value as `FLUTTERWAVE_WEBHOOK_HASH`
- **Events:** `charge.completed`

Payment flow:

1. `PricingPage` calls `startSubscriptionCheckout(plan)` → `flutterwave-initiate`.
2. The function verifies the Supabase session, inserts a `pending` subscription, and creates a Flutterwave checkout link.
3. Flutterwave redirects the user to `/subscription/callback?status=successful&tx_ref=...`.
4. Flutterwave calls `flutterwave-webhook`; the function verifies the `verif-hash`, re-verifies the transaction with Flutterwave, and calls `activate_subscription(reference, transaction_id)`.
5. The database trigger updates `profiles` (or `schools` for school plans); the callback page polls until the subscription is active.

If Supabase is not configured, the frontend keeps using the local Flutterwave checkout fallback so offline demos still work.

### Data model

| Table | Purpose |
|-------|---------|
| `profiles` | App user profile, role, subjects, school, subscription state (1:1 with `auth.users`) |
| `schools` | Schools, location, ICT readiness, subscription state, counts |
| `subscriptions` | Flutterwave subscriptions (user or school), status and expiry |
| `classes` | Teacher-owned classes with unique `join_code` |
| `class_members` | Student enrolment per class |
| `assignments` | Experiment assignments per class |
| `assignment_submissions` | Student submissions, scores, feedback |
| `student_progress` | Per-student, per-experiment progress and scores |
| `teacher_videos` | Teacher resource videos |
| `student_questions` | Student questions and teacher answers |
| `online_lectures` | Scheduled online lectures |

Reporting views:

- `class_performance` — per-class students, assignments, average score, completions
- `school_overview` — per-school counts, subscription state, average score

### Security model

- RLS is enabled on every public table. The frontend guards are defence-in-depth only; Supabase policies remain the source of truth.
- Canonical permissions are `experiment.run`, `progress.write.self`, `progress.read.self`, `class.manage`, `assignment.manage`, `progress.read.class`, `resource.manage`, `analytics.teacher`, `analytics.school`, `analytics.platform`, `user.manage`, `school.manage`, and `subscription.manage`.
- Legacy permission strings (`labs:view`, `reports:submit`, `teacher:*`, `admin:*`, `platform:analytics`) are normalized client-side so existing local sessions keep working.
- `public.role_permissions` stores the server-side matrix. `has_permission(text)` and `get_my_permissions()` resolve the signed-in user's effective permissions, and a non-empty server permission list overrides the built-in role matrix. An empty list falls back to the matrix for backward compatibility.
- `profiles.status` is `active`, `suspended`, or `pending`. Suspended users are redirected to `/suspended`, and `app_status()` plus status-aware helpers block their data access server-side.
- Students can read/write only their own progress and submissions, and can read classes they are enrolled in.
- Teachers can manage their own classes, assignments, videos, lectures, and read progress for their students.
- School staff can read profiles, classes, and subscriptions within their school.
- Admins can manage all records. Platform analytics and user administration require `user.manage` / `analytics.platform`.
- `profiles` updates are guarded by a trigger so users cannot change their own role, status, school, or subscription fields. Role and status changes go through `admin_set_user_role` and `admin_set_user_status`, which prevent self-demotion, self-suspension, and removal of the last active admin, and write to `audit_log`.
- `audit_log` is readable only by callers with `user.manage`.
- Helper functions (`app_role`, `app_status`, `has_permission`, `get_my_permissions`, `is_admin`, `teaches_class`, `is_enrolled`, `teacher_of_student`) are `SECURITY DEFINER` with a fixed `search_path`.

Permission matrix:

| Role | Permissions |
|------|-------------|
| Student | `experiment.run`, `progress.write.self`, `progress.read.self` |
| Teacher | student permissions + `class.manage`, `assignment.manage`, `progress.read.class`, `resource.manage`, `analytics.teacher` |
| Admin | teacher permissions + `analytics.school`, `analytics.platform`, `user.manage`, `school.manage`, `subscription.manage` |
| Partner | `analytics.platform` |

### RPC endpoints

| RPC | Caller | Returns |
|-----|--------|---------|
| `join_class(p_join_code)` | Authenticated student | Class row after enrolling the caller |
| `get_teacher_analytics()` | Teacher | Classes, students, assignments, completions, average score, pending questions |
| `get_student_analytics(p_student_id?)` | Student, their teacher, or admin | Experiments started/completed, average score, time spent, last activity |
| `get_school_analytics(p_school_id?)` | School staff or admin | Students, teachers, classes, assignments, completions, average score, active subscriptions |
| `get_platform_analytics()` | Admin | Platform-wide user, school, class, experiment, and subscription totals |
| `activate_subscription(p_reference, p_transaction_id?)` | Service role (webhook only) | Activated subscription row |

### Edge Function API

`flutterwave-initiate` — `POST` with the user's bearer token:

```json
{ "plan": "monthly_premium" }
```

```json
{ "link": "https://checkout.flutterwave.com/...", "reference": "NOVALAB-PREMIUM-...", "amount": 15000, "currency": "UGX" }
```

`flutterwave-webhook` — `POST` from Flutterwave:

- Requires header `verif-hash: <FLUTTERWAVE_WEBHOOK_HASH>`
- Accepts `charge.completed`
- Verifies `tx_ref`, currency, and amount before activation
- Returns `200` for handled/ignored events, `202` when the transaction is not yet verified, `401` for a bad signature

### Client service

`src/services/backendService.ts` exposes a typed wrapper around the backend:

```typescript
import {
  isBackendEnabled,
  getProfile,
  listClasses,
  joinClass,
  createAssignment,
  saveStudentProgress,
  startSubscriptionCheckout,
  getTeacherAnalytics,
} from './services/backendService';

if (isBackendEnabled) {
  const profile = await getProfile();
  const classes = await listClasses();
  const joined = await joinClass('ABCD1234');
  const progress = await saveStudentProgress('dna-extraction', { score: 80, status: 'completed' });
  const analytics = await getTeacherAnalytics();
}
```

Available helpers cover profiles, classes, members, assignments, submissions, progress, videos, questions, lectures, subscriptions, analytics RPCs, and the reporting views.

### Local backend development

```bash
npm run backend:start      # starts local Supabase stack (Docker)
npm run backend:push       # applies migrations to the linked project
npm run backend:serve      # serves Edge Functions locally
npm run backend:deploy     # deploys all Edge Functions
```

When running locally, point `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` at the values printed by `supabase start`, and set `SITE_URL=http://localhost:5187` in `supabase/.env`.

### Backend troubleshooting

| Issue | Solution |
|-------|----------|
| `new row violates row-level security policy` | Check the signed-in user's role/subscription and the policy for that table |
| Profiles are not created on sign-up | Confirm the `on_auth_user_created` trigger exists on `auth.users` |
| 401 from `flutterwave-initiate` | Send a valid `Authorization: Bearer <access_token>` header |
| Webhook returns 401 | `verif-hash` does not match `FLUTTERWAVE_WEBHOOK_HASH` |
| Webhook returns 202 | Transaction not yet verified by Flutterwave; it will retry |
| Subscription stays pending | Check function logs with `npx supabase functions logs flutterwave-webhook` |
| Analytics returns zeros | Ensure the caller is enrolled/owns the class, or is an admin |

## 📱 Offline-First Architecture

The platform implements offline-first principles:

1. **Local-first storage** - Progress and teacher workspaces are kept in `localStorage` so labs keep working without a connection
2. **Supabase sync layer** - `backendService.ts` mirrors data to PostgreSQL when a session is available
3. **Optimistic UI** - Local writes happen immediately; remote sync happens in the background
4. **Graceful fallback** - Without Supabase credentials, auth, progress, and subscriptions use local demo implementations

> Service workers and IndexedDB-backed queues are still on the roadmap; the current offline layer uses `localStorage`.

## 🧪 Virtual Labs Available

### Phase 1 (MVP)
- **Biology Lab**
  - DNA Extraction
  - Cell Division
  - Genetics Simulation
  - Photosynthesis Lab

### Interactive practicals

All catalog experiments use the shared drag-and-drop apparatus bench, PPE checks, required/distractor scoring, and local progress saving. Every experiment also has a runnable data simulation; these six have purpose-built simulators:

- `osmosis-in-potato-cells` — Biology
- `enzyme-activity-temperature` — Biology
- `acid-base-titration` — Chemistry
- `simple-circuits` — Physics
- `simple-pendulum` — Physics
- `flame-tests` — Chemistry

The remaining experiments use experiment-specific quantitative models with live graph readings, recorded trials, trend guidance, and scientific interpretation.

### Future Phases
- Chemistry Lab (Equilibrium, organic reactions)
- Physics Lab (Optics, waves, mechanics)
- Agriculture Lab (Soil Analysis, Crop Management)

## 📊 Data Collection & Analytics

Each experiment collects:
- Student actions and interactions
- Time spent on each step
- Accuracy and scoring data
- Learning patterns and progress
- Competency attainment

## 🎨 Customization

### Colors and Theme

Edit `tailwind.config.js` to customize:
- Color palette (primary, lab, success, etc.)
- Fonts and typography
- Breakpoints and spacing

### Simulations

Simulations are in `src/components/simulations/`. To add new simulations:

1. Create a new component file
2. Implement using Canvas API or p5.js
3. Follow the simulation interface pattern
4. Add to experiment page

## 🧱 Component Architecture

Components follow these patterns:

```typescript
interface ComponentProps {
  // Props definition
}

export default function Component({ prop }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

## 🔄 State Management

- **Global Auth:** Context API + useAuth hook
- **Server Data:** React Query (TanStack Query)
- **Local State:** useState for component-level state
- **Offline Queue:** IndexedDB for sync management

## 📡 API Integration

The app talks directly to Supabase:

```
Auth                - supabase.auth (email/password + OAuth)
PostgREST           - /rest/v1/profiles, classes, assignments, student_progress, ...
RPC                 - /rest/v1/rpc/join_class, get_teacher_analytics, ...
Edge Functions      - /functions/v1/flutterwave-initiate
                    - /functions/v1/flutterwave-webhook
Reporting views     - /rest/v1/class_performance, school_overview
```

All data access is protected by RLS, so the anon key is safe to ship to the browser. The service-role key is used only inside Edge Functions and must never be exposed to the frontend.

## 🧪 Testing

```bash
npm run build        # TypeScript strict check + production bundle
npm run lint         # ESLint, zero warnings allowed
npm test             # Vitest unit tests (RBAC, apparatus scoring, experiments, services)
npm run test:e2e     # Playwright RBAC/practical smoke tests
```

The end-to-end suite seeds an offline session for each role and verifies route guards, suspended-account redirects, teacher-only navigation, admin user management, and the interactive experiment bench. Run `npx playwright install chromium` once before the first e2e run.

RBAC verification checklist:

- Confirm `npx supabase db push` applied both migrations and `public.role_permissions` contains the canonical matrix.
- Sign in as a suspended profile and verify `/suspended` and blocked data requests.
- Verify a teacher cannot call `admin_set_user_role`, and an admin cannot demote or suspend themselves.
- Verify demoting the last active admin fails, and successful role/status changes appear in `audit_log`.
- Verify a student's cached permissions fall back to the role matrix when `get_my_permissions()` returns an empty list.

## 🏫 Deployment

### Development
```bash
npm run dev
```

### Staging
```bash
npm run build
npm run preview
```

### Production
1. Create the Supabase project and run `npx supabase db push`
2. Set Edge Function secrets and deploy `flutterwave-initiate` and `flutterwave-webhook`
3. Configure the Flutterwave webhook URL and secret hash
4. Build: `npm run build`
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the hosting environment
6. Deploy `dist/` folder to the hosting service
7. Point `SITE_URL` at the production frontend origin and redeploy the functions
8. Set up CDN for static assets
9. Enable HTTPS and security headers

### Render (static site)

`render.yaml` is included. Create either a Blueprint (`New > Blueprint`) or a manual static site:

- **Build command:** `npm ci && npm run build`
- **Publish directory:** `dist`
- **Rewrite rule:** Source `/*` → Destination `/index.html`, Action `Rewrite` (also configured in `render.yaml`)
- **Node version:** `22.23.5` (set as `NODE_VERSION` in `render.yaml`)

Set these build-time environment variables in Render (`VITE_*` values are baked into the bundle, so redeploy after changing them):

| Variable | Value |
|----------|-------|
| `VITE_APP_NAME` | `NovaLab` |
| `VITE_API_URL` | Your API origin (e.g. `https://api.novalab.ug`) |
| `VITE_SITE_URL` | Your deployed origin (e.g. `https://your-app.onrender.com`) |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key (public; protected by RLS) |
| `VITE_FLUTTERWAVE_PUBLIC_KEY` | Your `FLWPUBK_...` public key |
| `VITE_ENABLE_OFFLINE_MODE` | `true` (keeps the offline demo fallback) |

Optional public variables: `VITE_GOOGLE_CLIENT_ID`, `VITE_GEMINI_MODEL`, `VITE_YOUTUBE_API_KEY`, `VITE_GEMINI_API_KEY` (the last two are browser-visible; only set them if that is acceptable). Supabase service-role and Flutterwave secret keys belong in Supabase Edge Function secrets, never in Render frontend variables.

### Hosting Options
- Render (recommended for this deployment)
- Vercel (recommended for Vite)
- Netlify
- AWS CloudFront + S3
- Hostinger (as per project recommendation)
- Local cloud infrastructure

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Query Docs](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Create feature branches from `develop`
2. Follow component patterns and TypeScript conventions
3. Write meaningful commit messages
4. Test thoroughly before submitting changes
5. Update documentation as needed

## 📝 Development Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Set up environment variables (`.env.local`)
- [ ] Run dev server (`npm run dev`)
- [ ] Test authentication flow
- [ ] Review component library
- [ ] Check responsive design on mobile
- [ ] Test experiment navigation and the drag-and-drop bench
- [ ] Verify offline mode (if enabled)
- [ ] Run `npm run build`, `npm run lint`, `npm test`, and `npm run test:e2e`
- [ ] Apply both Supabase migrations (`npx supabase db push`)
- [ ] Verify `role_permissions`, suspended-account redirects, and `/admin/users` audit entries
- [ ] Verify the `on_auth_user_created` trigger creates profiles
- [ ] Deploy Edge Functions and set Flutterwave secrets
- [ ] Send a test `charge.completed` webhook

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3000
```

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript errors
```bash
# Ensure types are installed
npm install --save-dev typescript
npm run build
```

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review component documentation
3. Check TypeScript error messages
4. Consult React and Tailwind documentation

## 📜 License

This project is part of the Virtual Science Laboratory initiative for Uganda's education system. All rights reserved.

## 🙏 Acknowledgments

- Inspired by the successful SOMANEX platform
- Aligned with Uganda's Competency-Based Curriculum
- Developed with support from education stakeholders
- Designed for low-bandwidth, offline-first environments

---

**Version:** 0.2.0  
**Last Updated:** October 2026  
**Status:** MVP with Supabase backend
