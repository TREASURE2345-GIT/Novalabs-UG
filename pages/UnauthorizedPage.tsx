import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { describeRoles, getRoleLabel } from '../lib/rbac';
import type { UserRole } from '../types';

type UnauthorizedPageProps = {
  requiredRoles?: UserRole[];
};

export default function UnauthorizedPage({ requiredRoles }: UnauthorizedPageProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl">🔒</div>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your account role does not have permission to view this page.
        </p>

        <dl className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">Signed in as</dt>
            <dd className="font-bold text-slate-900">{user?.name ?? 'Guest'}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">Your role</dt>
            <dd className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {getRoleLabel(user?.role)}
            </dd>
          </div>
          {requiredRoles?.length ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="font-semibold text-slate-500">Required role</dt>
              <dd className="font-bold text-slate-900">{describeRoles(requiredRoles)}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">Requested path</dt>
            <dd className="truncate font-mono text-xs text-slate-700">{location.pathname}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard" className="btn-primary inline-block">
            Go to my dashboard
          </Link>
          <Link to="/" className="btn-secondary inline-block">
            Return home
          </Link>
          {user && (
            <button
              type="button"
              onClick={() => {
                void logout();
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Switch account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
