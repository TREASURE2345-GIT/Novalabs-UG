import { useAuth } from '@hooks/useAuth';
import { usePermissions } from '@hooks/usePermissions';
import { ROLE_PERMISSIONS } from '../lib/rbac';

export default function PartnerDashboard() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const permissions = user?.role ? ROLE_PERMISSIONS[user.role] : [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white shadow-lg">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-100">Partner portal</p>
        <h1 className="mt-2 text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="mt-2 text-amber-50">Role-based access is active for your partnership account.</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="card">
          <h2 className="text-xl font-bold text-gray-900">Platform analytics</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {can('platform:analytics')
              ? 'You have read access to anonymised platform usage and school participation analytics.'
              : 'Analytics access is not enabled for this account.'}
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            Analytics dashboards are being prepared. No student personal data is shared with partner accounts.
          </div>
        </section>

        <section className="card">
          <h2 className="text-xl font-bold text-gray-900">Your permissions</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {permissions.map((permission) => (
              <li key={permission} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">✓</span>
                <span className="font-mono text-xs">{permission}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
