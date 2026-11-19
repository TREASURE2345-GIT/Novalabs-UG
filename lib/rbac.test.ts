import { describe, expect, it } from 'vitest';
import {
  ALL_PERMISSIONS,
  DASHBOARD_ROLES,
  LAB_ROLES,
  LEGACY_PERMISSION_ALIASES,
  ROLE_PERMISSIONS,
  can,
  canAny,
  canAccessPath,
  hasRole,
  isSuspended,
  normalizePermission,
  permissionsFor,
} from './rbac';

describe('role permissions', () => {
  it('gives students the core experiment and self-progress permissions', () => {
    expect(can('student', 'experiment.run')).toBe(true);
    expect(can('student', 'progress.write.self')).toBe(true);
    expect(can('student', 'progress.read.self')).toBe(true);
    expect(can('student', 'class.manage')).toBe(false);
    expect(can('student', 'user.manage')).toBe(false);
  });

  it('gives teachers class, assignment and class-progress permissions', () => {
    expect(can('teacher', 'experiment.run')).toBe(true);
    expect(can('teacher', 'class.manage')).toBe(true);
    expect(can('teacher', 'assignment.manage')).toBe(true);
    expect(can('teacher', 'progress.read.class')).toBe(true);
    expect(can('teacher', 'analytics.teacher')).toBe(true);
    expect(can('teacher', 'analytics.school')).toBe(false);
    expect(can('teacher', 'user.manage')).toBe(false);
  });

  it('gives admins every permission', () => {
    for (const permission of ALL_PERMISSIONS) {
      expect(can('admin', permission)).toBe(true);
    }
  });

  it('limits partners to platform analytics', () => {
    expect(can('partner', 'analytics.platform')).toBe(true);
    expect(can('partner', 'experiment.run')).toBe(false);
    expect(can('partner', 'assignment.manage')).toBe(false);
  });

  it('denies guests', () => {
    expect(can(null, 'experiment.run')).toBe(false);
    expect(hasRole(undefined, LAB_ROLES)).toBe(false);
  });

  it('maps legacy permissions onto the canonical permission names', () => {
    for (const [legacy, canonical] of Object.entries(LEGACY_PERMISSION_ALIASES)) {
      expect(normalizePermission(legacy as keyof typeof LEGACY_PERMISSION_ALIASES)).toBe(canonical);
    }
    expect(can('student', 'labs:view')).toBe(true);
    expect(can('teacher', 'teacher:view-progress')).toBe(true);
    expect(can('partner', 'platform:analytics')).toBe(true);
  });

  it('uses server-granted permissions when present', () => {
    expect(can('student', 'user.manage', ['user.manage'])).toBe(true);
    expect(can('admin', 'user.manage', [])).toBe(true);
    expect(permissionsFor('student', ['experiment.run', 'progress.read.self'])).toEqual([
      'experiment.run',
      'progress.read.self',
    ]);
  });

  it('keeps the permission matrix consistent', () => {
    for (const permissions of Object.values(ROLE_PERMISSIONS)) {
      expect(new Set(permissions).size).toBe(permissions.length);
    }
    expect(canAny('teacher', ['user.manage', 'class.manage'])).toBe(true);
    expect(canAny('student', ['user.manage', 'school.manage'])).toBe(false);
  });
});

describe('route and account status helpers', () => {
  it('recognises dashboard and lab roles', () => {
    expect(hasRole('student', DASHBOARD_ROLES)).toBe(true);
    expect(hasRole('partner', DASHBOARD_ROLES)).toBe(true);
    expect(hasRole('student', ['admin'])).toBe(false);
    expect(hasRole('teacher', LAB_ROLES)).toBe(true);
  });

  it('gates lab and experiment paths by role', () => {
    expect(canAccessPath('student', '/labs/biology')).toBe(true);
    expect(canAccessPath('partner', '/labs/biology')).toBe(false);
    expect(canAccessPath('admin', '/experiments/flame-tests')).toBe(true);
    expect(canAccessPath('partner', '/dashboard')).toBe(true);
    expect(canAccessPath('student', '/pricing')).toBe(true);
  });

  it('detects suspended accounts', () => {
    expect(isSuspended('suspended')).toBe(true);
    expect(isSuspended('active')).toBe(false);
    expect(isSuspended(undefined)).toBe(false);
  });
});
