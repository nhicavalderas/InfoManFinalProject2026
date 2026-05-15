-- M3 Final Verification
-- Purpose:
-- This script verifies the database objects required for the Hope HR System.
-- This is for checking only. It does not modify, delete, or update data.

-- 1. Count public tables, views, policies, and triggers
SELECT 
  'tables' AS object_type,
  COUNT(*) AS total
FROM information_schema.tables
WHERE table_schema = 'public'

UNION ALL

SELECT 
  'views' AS object_type,
  COUNT(*) AS total
FROM information_schema.views
WHERE table_schema = 'public'

UNION ALL

SELECT 
  'policies' AS object_type,
  COUNT(*) AS total
FROM pg_policies
WHERE schemaname = 'public'

UNION ALL

SELECT 
  'triggers' AS object_type,
  COUNT(*) AS total
FROM information_schema.triggers
WHERE trigger_schema IN ('public', 'auth');


-- 2. Verify HR tables
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


-- 3. Verify rights/user tables
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


-- 4. Verify record_status and stamp columns
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN (
  'employee',
  'jobhistory',
  'job',
  'department'
)
AND column_name IN (
  'record_status',
  'stamp'
)
ORDER BY table_name, column_name;


-- 5. Verify SQL views
SELECT 
  viewname
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN (
  'employee_current_job',
  'headcount_by_dept',
  'salary_summary_by_job',
  'employee_full_history'
)
ORDER BY viewname;


-- 6. Verify RLS policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
  'employee',
  'jobhistory',
  'job',
  'department',
  'user',
  'user_module',
  'UserModule_Rights'
)
ORDER BY tablename, policyname;


-- 7. Verify triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema IN ('public', 'auth')
ORDER BY trigger_name;


-- 8. Verify module seed data
SELECT *
FROM "Module"
ORDER BY moduleid;


-- 9. Verify rights seed data
SELECT *
FROM rights
ORDER BY rightid;