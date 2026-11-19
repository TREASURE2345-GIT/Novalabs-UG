import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import type { LegacyPermission, Permission } from '../../lib/rbac';
import type { UserRole } from '../../types';
import UnauthorizedPage from '../../pages/UnauthorizedPage';

type ProtectedRouteProps = {
  permission?: Permission | LegacyPermission;
  anyOf?: Array<Permission | LegacyPermission>;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
};

export default function ProtectedRoute({
  permission,
  anyOf,
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { can, canAny, isSuspended, role } = usePermissions();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isSuspended) {
    return <Navigate to="/suspended" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <UnauthorizedPage requiredRoles={allowedRoles} />;
  }

  if (permission && !can(permission)) {
    return <UnauthorizedPage />;
  }

  if (anyOf && anyOf.length > 0 && !canAny(anyOf)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}
