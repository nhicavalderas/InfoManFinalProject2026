# Sprint 2 Log

## Sprint 2 Dates

Week 3 to Week 4

## Tasks Completed

### M5 — QA / Documentation Specialist

- Executed 51-case rights matrix documentation
- Verified USER, ADMIN, and SUPERADMIN access expectations
- Documented cascade soft-delete test flow
- Documented stamp visibility checks
- Documented no hard-delete audit requirement

## Test Findings

### Rights Matrix

All 51 permission cases were documented for:

- Employees
- Job History
- Jobs
- Departments
- Admin user access

### Cascade Soft-Delete

The expected behavior is:

- SUPERADMIN can soft-delete employee records
- Deleted employee records should be hidden from USER
- Related job history rows should also be hidden
- ADMIN can recover deleted records
- Recovered records should become visible again

### Stamp Visibility

Expected behavior:

- USER should not see the stamp column
- ADMIN should see the stamp column

### No Hard Delete Audit

Search term used:

```txt
.delete(
