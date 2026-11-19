import { Navigate, useLocation } from 'react-router-dom';
import UnauthorizedPage from '../../pages/UnauthorizedPage';
import { hasRole } from '../../lib/rbac';
import { usePermissions } from '../../hooks/usePermissions';
import type { UserRole } from '../../types';

interface PrivateRouteProps {
  isAuthenticated: boolean;
  role?: UserRole;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export default function PrivateRoute({ isAuthenticated, role, allowedRoles, children }: PrivateRouteProps) {
  const location = useLocation();
  const { isSuspended } = usePermissions();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isSuspended) {
    return <Navigate to="/suspended" replace />;
  }

  if (allowedRoles && !hasRole(role, allowedRoles)) {
    return <UnauthorizedPage requiredRoles={allowedRoles} />;
  }

  return <>{children}</>;
}
