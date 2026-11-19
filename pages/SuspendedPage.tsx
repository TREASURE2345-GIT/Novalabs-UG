import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';

export default function SuspendedPage() {
  const { user, logout } = useAuth();
  const { roleLabel } = usePermissions();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
          !
        </div>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">Account suspended</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This account has been suspended by an administrator. You cannot access labs, experiments or
          progress data until your account is reactivated.
        </p>

        <dl className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">Account</dt>
            <dd className="font-bold text-slate-900">{user?.email ?? 'Unknown'}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">Role</dt>
            <dd className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {roleLabel}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-slate-500">Status</dt>
            <dd className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-800">
              Suspended
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-secondary inline-block">
            Return home
          </Link>
          <button
            type="button"
            onClick={() => {
              void logout();
            }}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          If you believe this is a mistake, contact your school administrator.
        </p>
      </div>
    </div>
  );
}
