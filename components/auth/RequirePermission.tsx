import type { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import type { LegacyPermission, Permission } from '../../lib/rbac';
import UnauthorizedPage from '../../pages/UnauthorizedPage';

type RequirePermissionProps = {
  permission?: Permission | LegacyPermission;
  anyOf?: Array<Permission | LegacyPermission>;
  fallback?: ReactNode;
  children: ReactNode;
};

export default function RequirePermission({
  permission,
  anyOf,
  fallback,
  children,
}: RequirePermissionProps) {
  const { can, canAny } = usePermissions();
  const allowed = permission
    ? can(permission)
    : anyOf && anyOf.length > 0
      ? canAny(anyOf)
      : true;

  if (!allowed) {
    return <>{fallback ?? <UnauthorizedPage />}</>;
  }

  return <>{children}</>;
}
