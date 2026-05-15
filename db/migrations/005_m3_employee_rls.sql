-- M3 Sprint 2
-- Employee Current Job View
-- Purpose:
-- This view displays each ACTIVE employee with their latest ACTIVE job assignment.
-- It joins employee, jobhistory, job, and department tables.
-- This view is used by the frontend to show the current job, department, and salary of each employee.

CREATE OR REPLACE VIEW employee_current_job AS
SELECT 
  -- Employee basic information
  e.empno,
  e.lastname,
  e.firstname,
  e.gender,
  e.hiredate,

  -- Current job information from latest active jobhistory row
  jh.jobcode,
  j.jobdesc,

  -- Current department information
  jh.deptcode,
  d.deptname,

  -- Current salary and effective date
  jh.salary,
  jh.effdate AS current_effdate

FROM employee e

-- Connect employee to job history
JOIN jobhistory jh 
  ON jh.empno = e.empno

-- Connect job history to job description
JOIN job j 
  ON j.jobcode = jh.jobcode

-- Connect job history to department name
JOIN department d 
  ON d.deptcode = jh.deptcode

-- Get only the latest ACTIVE jobhistory record per employee
WHERE jh.effdate = (
  SELECT MAX(jh2.effdate)
  FROM jobhistory jh2
  WHERE jh2.empno = e.empno
  AND jh2.record_status = 'ACTIVE'
)

-- Only include active records from all related tables
AND e.record_status = 'ACTIVE'
AND jh.record_status = 'ACTIVE'
AND j.record_status = 'ACTIVE'
AND d.record_status = 'ACTIVE';