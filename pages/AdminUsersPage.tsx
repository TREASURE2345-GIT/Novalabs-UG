import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import {
  adminSetUserRole,
  adminSetUserStatus,
  isBackendEnabled,
  listAuditLog,
  listUsers,
  type AuditLogEntry,
  type BackendProfile,
} from '../services/backendService';
import { ROLE_LABELS, STATUS_LABELS } from '../lib/rbac';
import type { UserRole } from '../types';

const roles: UserRole[] = ['student', 'teacher', 'admin', 'partner'];

type PendingAction =
  | { kind: 'role'; user: BackendProfile; role: UserRole }
  | { kind: 'status'; user: BackendProfile; status: 'active' | 'suspended' };

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [users, setUsers] = useState<BackendProfile[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState<PendingAction | null>(null);

  const refreshAudit = useCallback(async () => {
    try {
      setAuditLog(await listAuditLog(20));
    } catch {
      setAuditLog([]);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!isBackendEnabled) {
        setLoading(false);
        setError('User management needs Supabase to be configured.');
        return;
      }
      try {
        const [loadedUsers, loadedAudit] = await Promise.all([listUsers(), listAuditLog(20)]);
        if (!active) return;
        setUsers(loadedUsers);
        setAuditLog(loadedAudit);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Could not load users.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return users.filter((entry) => {
      if (roleFilter !== 'all' && entry.role !== roleFilter) return false;
      if (!term) return true;
      return (
        entry.name.toLowerCase().includes(term) ||
        entry.email.toLowerCase().includes(term) ||
        entry.id.toLowerCase().includes(term)
      );
    });
  }, [query, roleFilter, users]);

  const applyRole = async (target: BackendProfile, role: UserRole) => {
    if (target.id === user?.id) {
      setError('You cannot change your own role.');
      return;
    }
    const snapshot = users;
    setSavingId(target.id);
    setError('');
    setUsers((current) => current.map((entry) => (entry.id === target.id ? { ...entry, role } : entry)));
    try {
      await adminSetUserRole(target.id, role);
      setMessage(`${target.name} is now ${ROLE_LABELS[role]}.`);
      await refreshAudit();
    } catch (saveError) {
      setUsers(snapshot);
      setError(saveError instanceof Error ? saveError.message : 'Could not change the role.');
    } finally {
      setSavingId(null);
      setPending(null);
    }
  };

  const applyStatus = async (target: BackendProfile, status: 'active' | 'suspended') => {
    if (target.id === user?.id) {
      setError('You cannot suspend your own account.');
      return;
    }
    const snapshot = users;
    setSavingId(target.id);
    setError('');
    setUsers((current) => current.map((entry) => (entry.id === target.id ? { ...entry, status } : entry)));
    try {
      await adminSetUserStatus(target.id, status);
      setMessage(`${target.name} is now ${STATUS_LABELS[status].toLowerCase()}.`);
      await refreshAudit();
    } catch (saveError) {
      setUsers(snapshot);
      setError(saveError instanceof Error ? saveError.message : 'Could not change the account status.');
    } finally {
      setSavingId(null);
      setPending(null);
    }
  };

  if (!can('user.manage')) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
        You do not have permission to manage users.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Administration</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Users and access</h1>
          <p className="mt-1 text-sm text-slate-600">
            Search accounts, change roles and suspend or reactivate access. Every change is audited.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
          <span className="font-semibold text-slate-900">{users.length}</span> accounts
        </div>
      </header>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" aria-live="polite">
          {message}
        </p>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="user-search">
            Search users
          </label>
          <input
            id="user-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email or user ID"
            className="min-w-[16rem] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <label className="sr-only" htmlFor="role-filter">
            Filter by role
          </label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as UserRole | 'all')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading users...</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <caption className="sr-only">User accounts and access controls</caption>
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-3 py-2">User</th>
                  <th scope="col" className="px-3 py-2">Role</th>
                  <th scope="col" className="px-3 py-2">Status</th>
                  <th scope="col" className="px-3 py-2">Created</th>
                  <th scope="col" className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => {
                  const status = entry.status ?? 'active';
                  return (
                    <tr key={entry.id} className="odd:bg-white even:bg-slate-50/60">
                      <th scope="row" className="px-3 py-3 text-left font-medium text-slate-900">
                        <span className="block">{entry.name}</span>
                        <span className="block text-xs font-normal text-slate-500">{entry.email}</span>
                      </th>
                      <td className="px-3 py-3">
                        <label className="sr-only" htmlFor={`role-${entry.id}`}>
                          Role for {entry.name}
                        </label>
                        <select
                          id={`role-${entry.id}`}
                          value={entry.role}
                          disabled={savingId === entry.id || entry.id === user?.id}
                          onChange={(event) => {
                            const role = event.target.value as UserRole;
                            if (role !== entry.role) setPending({ kind: 'role', user: entry, role });
                          }}
                          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm disabled:opacity-60"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {ROLE_LABELS[role]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            status === 'suspended'
                              ? 'bg-rose-100 text-rose-800'
                              : status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {STATUS_LABELS[status]}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          disabled={savingId === entry.id || entry.id === user?.id}
                          onClick={() =>
                            setPending({
                              kind: 'status',
                              user: entry,
                              status: status === 'suspended' ? 'active' : 'suspended',
                            })
                          }
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-60 ${
                            status === 'suspended'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-rose-600 text-white hover:bg-rose-700'
                          }`}
                        >
                          {status === 'suspended' ? 'Reactivate' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-slate-500">No users match your filters.</p>
            ) : null}
          </div>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent audit log</h2>
        {auditLog.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No audit entries yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {auditLog.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="font-medium text-slate-800">{entry.action}</span>
                <span className="text-slate-500">
                  {entry.targetUserId ? `target ${entry.targetUserId.slice(0, 8)}` : 'no target'} ·{' '}
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pending ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 id="confirm-title" className="text-lg font-bold text-slate-900">
              Confirm access change
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {pending.kind === 'role'
                ? `Change ${pending.user.name} from ${ROLE_LABELS[pending.user.role]} to ${ROLE_LABELS[pending.role]}?`
                : `${pending.status === 'suspended' ? 'Suspend' : 'Reactivate'} ${pending.user.name}?`}
            </p>
            {pending.kind === 'status' && pending.status === 'suspended' ? (
              <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800">
                A suspended user is signed out of protected routes immediately and cannot run experiments.
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pending.kind === 'role') void applyRole(pending.user, pending.role);
                  else void applyStatus(pending.user, pending.status);
                }}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Confirm change
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
