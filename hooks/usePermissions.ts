import { useMemo } from 'react';
import { useAuth } from './useAuth';
import {
  can,
  canAny,
  describeRoles,
  getRoleLabel,
  hasRole,
  isSuspended,
  permissionsFor,
  type LegacyPermission,
  type Permission,
} from '../lib/rbac';
import type { UserRole } from '../types';

type PermissionInput = Permission | LegacyPermission;

export function usePermissions() {
  const { user } = useAuth();

  return useMemo(() => {
    const role = user?.role ?? null;
    const granted = user?.permissions ?? null;
    return {
      role,
      roleLabel: getRoleLabel(role),
      status: user?.status ?? 'active',
      isAuthenticated: Boolean(user),
      isSuspended: isSuspended(user?.status),
      isStudent: role === 'student',
      isTeacher: role === 'teacher',
      isAdmin: role === 'admin',
      isPartner: role === 'partner',
      permissions: permissionsFor(role, granted),
      can: (permission: PermissionInput) => can(role, permission, granted),
      canAny: (permissions: PermissionInput[]) => canAny(role, permissions, granted),
      isRole: (...roles: UserRole[]) => hasRole(role, roles),
      describeRoles,
    };
  }, [user]);
}
