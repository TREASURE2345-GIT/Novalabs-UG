import type { UserRole, UserStatus } from '../types';

export type Permission =
  | 'experiment.run'
  | 'progress.write.self'
  | 'progress.read.self'
  | 'class.manage'
  | 'assignment.manage'
  | 'progress.read.class'
  | 'resource.manage'
  | 'analytics.teacher'
  | 'analytics.school'
  | 'analytics.platform'
  | 'user.manage'
  | 'school.manage'
  | 'subscription.manage';

export type LegacyPermission =
  | 'labs:view'
  | 'experiments:run'
  | 'progress:view-own'
  | 'reports:submit'
  | 'teacher:classes'
  | 'teacher:grade'
  | 'teacher:resources'
  | 'teacher:view-progress'
  | 'admin:users'
  | 'admin:schools'
  | 'admin:analytics'
  | 'platform:analytics';

export const LEGACY_PERMISSION_ALIASES: Record<LegacyPermission, Permission> = {
  'labs:view': 'experiment.run',
  'experiments:run': 'experiment.run',
  'progress:view-own': 'progress.read.self',
  'reports:submit': 'progress.write.self',
  'teacher:classes': 'class.manage',
  'teacher:grade': 'assignment.manage',
  'teacher:resources': 'resource.manage',
  'teacher:view-progress': 'progress.read.class',
  'admin:users': 'user.manage',
  'admin:schools': 'school.manage',
  'admin:analytics': 'analytics.school',
  'platform:analytics': 'analytics.platform',
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  'experiment.run': 'Run virtual experiments',
  'progress.write.self': 'Save own progress',
  'progress.read.self': 'View own progress',
  'class.manage': 'Manage classes',
  'assignment.manage': 'Manage assignments and grading',
  'progress.read.class': 'View class progress',
  'resource.manage': 'Manage learning resources',
  'analytics.teacher': 'View teacher analytics',
  'analytics.school': 'View school analytics',
  'analytics.platform': 'View platform analytics',
  'user.manage': 'Manage users and roles',
  'school.manage': 'Manage schools',
  'subscription.manage': 'Manage subscriptions',
};

const ADMIN_PERMISSIONS: Permission[] = [
  'experiment.run',
  'progress.write.self',
  'progress.read.self',
  'class.manage',
  'assignment.manage',
  'progress.read.class',
  'resource.manage',
  'analytics.teacher',
  'analytics.school',
  'analytics.platform',
  'user.manage',
  'school.manage',
  'subscription.manage',
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: ['experiment.run', 'progress.write.self', 'progress.read.self'],
  teacher: [
    'experiment.run',
    'progress.write.self',
    'progress.read.self',
    'class.manage',
    'assignment.manage',
    'progress.read.class',
    'resource.manage',
    'analytics.teacher',
  ],
  admin: ADMIN_PERMISSIONS,
  partner: ['analytics.platform'],
};

export const ALL_PERMISSIONS: Permission[] = ADMIN_PERMISSIONS;

export const SELF_SERVICE_ROLES: UserRole[] = ['student', 'teacher', 'partner'];
export const DASHBOARD_ROLES: UserRole[] = ['student', 'teacher', 'admin', 'partner'];
export const LAB_ROLES: UserRole[] = ['student', 'teacher', 'admin'];
export const TEACHER_ROLES: UserRole[] = ['teacher', 'admin'];
export const ADMIN_ROLES: UserRole[] = ['admin'];
export const PARTNER_ROLES: UserRole[] = ['partner'];

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  teacher: 'Teacher',
  admin: 'Administrator',
  partner: 'Partner',
};

export const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  student: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  teacher: 'bg-blue-100 text-blue-800 ring-blue-200',
  admin: 'bg-violet-100 text-violet-800 ring-violet-200',
  partner: 'bg-amber-100 text-amber-900 ring-amber-200',
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  pending: 'Pending',
};

export function normalizePermission(permission: Permission | LegacyPermission): Permission {
  if (permission in LEGACY_PERMISSION_ALIASES) {
    return LEGACY_PERMISSION_ALIASES[permission as LegacyPermission];
  }
  return permission as Permission;
}

export function hasRole(role: UserRole | null | undefined, allowedRoles: UserRole[]): boolean {
  if (!role) return false;
  return allowedRoles.includes(role);
}

export function can(
  role: UserRole | null | undefined,
  permission: Permission | LegacyPermission,
  grantedPermissions?: readonly string[] | null,
): boolean {
  if (!role) return false;
  const normalized = normalizePermission(permission);
  if (grantedPermissions && grantedPermissions.length > 0) {
    return grantedPermissions.some((entry) => normalizePermission(entry as Permission) === normalized);
  }
  return ROLE_PERMISSIONS[role]?.includes(normalized) ?? false;
}

export function canAny(
  role: UserRole | null | undefined,
  permissions: Array<Permission | LegacyPermission>,
  grantedPermissions?: readonly string[] | null,
): boolean {
  return permissions.some((permission) => can(role, permission, grantedPermissions));
}

export function permissionsFor(
  role: UserRole | null | undefined,
  grantedPermissions?: readonly string[] | null,
): Permission[] {
  if (grantedPermissions && grantedPermissions.length > 0) {
    return Array.from(
      new Set(grantedPermissions.map((permission) => normalizePermission(permission as Permission))),
    );
  }
  if (!role) return [];
  return ROLE_PERMISSIONS[role] ?? [];
}

export function isSuspended(status: UserStatus | null | undefined): boolean {
  return status === 'suspended';
}

export function getRoleLabel(role: UserRole | null | undefined): string {
  return role ? ROLE_LABELS[role] : 'Guest';
}

export type RouteRule = {
  pattern: RegExp;
  roles: UserRole[];
  label: string;
};

export const ROUTE_ACCESS: RouteRule[] = [
  { pattern: /^\/dashboard\/?$/, roles: DASHBOARD_ROLES, label: 'Dashboard' },
  { pattern: /^\/labs\/[^/]+\/?$/, roles: LAB_ROLES, label: 'Subject lab' },
  { pattern: /^\/experiments\/[^/]+\/?$/, roles: LAB_ROLES, label: 'Experiment' },
  { pattern: /^\/unauthorized\/?$/, roles: ['student', 'teacher', 'admin', 'partner'], label: 'Access notice' },
];

export function canAccessPath(role: UserRole | null | undefined, pathname: string): boolean {
  const rule = ROUTE_ACCESS.find((entry) => entry.pattern.test(pathname));
  if (!rule) return true;
  return hasRole(role, rule.roles);
}

export function describeRoles(roles: UserRole[]): string {
  if (roles.length === 1) return ROLE_LABELS[roles[0]];
  const labels = roles.map((role) => ROLE_LABELS[role]);
  return `${labels.slice(0, -1).join(', ')} or ${labels[labels.length - 1]}`;
}
