-- M3 Final Verification
-- Purpose:
-- This script checks database tables, views, policies, triggers, modules, and rights.
-- This is for verification only. It does not change or delete data.

-- 1. Check all public tables
SELECT 
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Check all public views
SELECT 
  schemaname,
  viewname
FROM pg_views
WHERE schemaname = 'public'
ORDER BY viewname;

-- 3. Check all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Check required HR tables
SELECT 
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'employee',
  'jobhistory',
  'job',
  'department'
)
ORDER BY table_name;

-- 5. Check required user/rights tables
SELECT 
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'user',
  'Module',
  'rights',
  'user_module',
  'UserModule_Rights'
)
ORDER BY table_name;

-- 6. Check record_status and stamp columns
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('employee', 'jobhistory', 'job', 'department')
AND column_name IN ('record_status', 'stamp')
ORDER BY table_name, column_name;

-- 7. Check report/helper views
SELECT 
  table_name AS view_name
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN (
  'employee_current_job',
  'headcount_by_dept',
  'salary_summary_by_job',
  'employee_full_history'
)
ORDER BY table_name;

-- 8. Check employee cascade trigger
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name IN (
  'trg_cascade_employee_status',
  'on_employee_status_change'
);

-- 9. Check auth auto-provision trigger
SELECT 
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 10. Check module seed data
SELECT *
FROM "Module"
ORDER BY moduleid;

-- 11. Check rights seed data
SELECT *
FROM rights
ORDER BY rightid;