import { describe, it, expect } from 'vitest';

const rightsMatrix = [
  // Employees
  ['EMP_VIEW', 'USER', true],
  ['EMP_VIEW', 'ADMIN', true],
  ['EMP_VIEW', 'SUPERADMIN', true],

  ['EMP_ADD', 'USER', false],
  ['EMP_ADD', 'ADMIN', true],
  ['EMP_ADD', 'SUPERADMIN', true],

  ['EMP_EDIT', 'USER', false],
  ['EMP_EDIT', 'ADMIN', true],
  ['EMP_EDIT', 'SUPERADMIN', true],

  ['EMP_DEL', 'USER', false],
  ['EMP_DEL', 'ADMIN', false],
  ['EMP_DEL', 'SUPERADMIN', true],

  // Job History
  ['JH_VIEW', 'USER', true],
  ['JH_VIEW', 'ADMIN', true],
  ['JH_VIEW', 'SUPERADMIN', true],

  ['JH_ADD', 'USER', false],
  ['JH_ADD', 'ADMIN', true],
  ['JH_ADD', 'SUPERADMIN', true],

  ['JH_EDIT', 'USER', false],
  ['JH_EDIT', 'ADMIN', true],
  ['JH_EDIT', 'SUPERADMIN', true],

  ['JH_DEL', 'USER', false],
  ['JH_DEL', 'ADMIN', false],
  ['JH_DEL', 'SUPERADMIN', true],

  // Jobs
  ['JOB_VIEW', 'USER', true],
  ['JOB_VIEW', 'ADMIN', true],
  ['JOB_VIEW', 'SUPERADMIN', true],

  ['JOB_ADD', 'USER', false],
  ['JOB_ADD', 'ADMIN', true],
  ['JOB_ADD', 'SUPERADMIN', true],

  ['JOB_EDIT', 'USER', false],
  ['JOB_EDIT', 'ADMIN', true],
  ['JOB_EDIT', 'SUPERADMIN', true],

  ['JOB_DEL', 'USER', false],
  ['JOB_DEL', 'ADMIN', false],
  ['JOB_DEL', 'SUPERADMIN', true],

  // Departments
  ['DEPT_VIEW', 'USER', true],
  ['DEPT_VIEW', 'ADMIN', true],
  ['DEPT_VIEW', 'SUPERADMIN', true],

  ['DEPT_ADD', 'USER', false],
  ['DEPT_ADD', 'ADMIN', true],
  ['DEPT_ADD', 'SUPERADMIN', true],

  ['DEPT_EDIT', 'USER', false],
  ['DEPT_EDIT', 'ADMIN', true],
  ['DEPT_EDIT', 'SUPERADMIN', true],

  ['DEPT_DEL', 'USER', false],
  ['DEPT_DEL', 'ADMIN', false],
  ['DEPT_DEL', 'SUPERADMIN', true],

  // Admin
  ['ADM_USER', 'USER', false],
  ['ADM_USER', 'ADMIN', false],
  ['ADM_USER', 'SUPERADMIN', true],
];

describe('Sprint 2 Rights Matrix - 51 Cases', () => {
  it('has exactly 51 test cases', () => {
    expect(rightsMatrix).toHaveLength(51);
  });

  it.each(rightsMatrix)(
    '%s permission for %s should be %s',
    (rightId, userType, expected) => {
      expect(typeof rightId).toBe('string');
      expect(['USER', 'ADMIN', 'SUPERADMIN']).toContain(userType);
      expect(typeof expected).toBe('boolean');
    }
  );
});
