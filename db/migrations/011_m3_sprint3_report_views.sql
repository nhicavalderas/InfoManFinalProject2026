-- M3 Sprint 3
-- HR Report Views
-- Purpose:
-- This migration creates SQL views for HR reporting.
-- Views included:
-- 1. headcount_by_dept
-- 2. salary_summary_by_job
--
-- These views use ACTIVE records only for safe reporting.

-- Report 1:
-- Shows active employee headcount per department.
CREATE OR REPLACE VIEW headcount_by_dept AS
SELECT 
  d.deptcode,
  d.deptname,
  COUNT(DISTINCT jh.empno) AS activeheadcount
FROM department d
LEFT JOIN jobhistory jh 
  ON jh.deptcode = d.deptcode
  AND jh.record_status = 'ACTIVE'
  AND jh.effdate = (
    SELECT MAX(effdate)
    FROM jobhistory
    WHERE empno = jh.empno
    AND record_status = 'ACTIVE'
  )
WHERE d.record_status = 'ACTIVE'
GROUP BY d.deptcode, d.deptname
ORDER BY activeheadcount DESC;

-- Report 2:
-- Shows salary summary per job based on active jobhistory records.
CREATE OR REPLACE VIEW salary_summary_by_job AS
SELECT 
  j.jobcode,
  j.jobdesc,
  COUNT(*) AS assignments,
  MIN(jh.salary) AS minsalary,
  MAX(jh.salary) AS maxsalary,
  ROUND(AVG(jh.salary), 2) AS avgsalary
FROM job j
JOIN jobhistory jh 
  ON jh.jobcode = j.jobcode
WHERE jh.record_status = 'ACTIVE'
AND j.record_status = 'ACTIVE'
GROUP BY j.jobcode, j.jobdesc
ORDER BY avgsalary DESC;