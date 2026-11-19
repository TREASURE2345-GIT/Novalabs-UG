import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { usePermissions } from '@hooks/usePermissions';
import { ROLE_BADGE_CLASSES } from '../../lib/rbac';
import SubjectIcon from '../ui/SubjectIcon';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { can, roleLabel, isPartner, isAdmin } = usePermissions();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-blue-900 text-white shadow-lg transition-all duration-300 overflow-y-auto`}
      >
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center justify-center p-4 hover:bg-blue-800 transition">
          {sidebarOpen ? (
            <img src="/novalab-logo-light.png" alt="NovaLabs" className="h-11 w-auto" />
          ) : (
            <img src="/novalab-icon.svg" alt="NovaLabs" className="h-10 w-10" />
          )}
        </Link>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-2">
          <NavLink
            to="/dashboard"
            icon={<span className="text-xl">📊</span>}
            label="Dashboard"
            sidebarOpen={sidebarOpen}
          />

          {can('experiment.run') && (
            <>
              <NavLink
                to="/labs/biology"
                icon={<SubjectIcon subject="biology" className="h-6 w-6" />}
                label="Biology Lab"
                sidebarOpen={sidebarOpen}
              />
              <NavLink
                to="/labs/chemistry"
                icon={<SubjectIcon subject="chemistry" className="h-6 w-6" />}
                label="Chemistry Lab"
                sidebarOpen={sidebarOpen}
              />
              <NavLink
                to="/labs/physics"
                icon={<SubjectIcon subject="physics" className="h-6 w-6" />}
                label="Physics Lab"
                sidebarOpen={sidebarOpen}
              />
              <NavLink
                to="/labs/agriculture"
                icon={<SubjectIcon subject="agriculture" className="h-6 w-6" />}
                label="Agriculture Lab"
                sidebarOpen={sidebarOpen}
              />
            </>
          )}

          {can('class.manage') && (
            <>
              <NavLink
                to="/dashboard"
                icon={<span className="text-xl">📚</span>}
                label="My Classes"
                sidebarOpen={sidebarOpen}
              />
              <NavLink
                to="/dashboard"
                icon={<span className="text-xl">📝</span>}
                label="Assignments"
                sidebarOpen={sidebarOpen}
              />
              <NavLink
                to="/dashboard"
                icon={<span className="text-xl">📈</span>}
                label="Student Progress"
                sidebarOpen={sidebarOpen}
              />
            </>
          )}

          {can('user.manage') && (
            <>
              <NavLink
                to="/admin/users"
                icon={<span className="text-xl">👥</span>}
                label="Users"
                sidebarOpen={sidebarOpen}
              />
              <NavLink
                to="#"
                icon={<span className="text-xl">🏫</span>}
                label="Schools"
                sidebarOpen={sidebarOpen}
              />
            </>
          )}

          {can('analytics.platform') && (
            <NavLink
              to={isPartner ? '/dashboard' : '#'}
              icon={<span className="text-xl">📊</span>}
              label={isPartner ? 'Partner Analytics' : 'Platform Analytics'}
              sidebarOpen={sidebarOpen}
            />
          )}

          {isAdmin && (
            <NavLink
              to="#"
              icon={<span className="text-xl">🛡️</span>}
              label="Access Control"
              sidebarOpen={sidebarOpen}
            />
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              ☰
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              {user?.role && (
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ${ROLE_BADGE_CLASSES[user.role]}`}>
                  {roleLabel}
                </span>
              )}
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  sidebarOpen: boolean;
}

function NavLink({ to, icon, label, sidebarOpen }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition text-white no-underline"
    >
      {icon}
      {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}
