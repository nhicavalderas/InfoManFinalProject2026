-- M3 Sprint 2
-- Employee Status Cascade Trigger
-- Purpose:
-- This trigger automatically updates all related jobhistory records
-- whenever an employee's record_status changes.
--
-- If employee becomes INACTIVE:
--   related jobhistory rows also become INACTIVE.
--
-- If employee becomes ACTIVE again:
--   related jobhistory rows also become ACTIVE.
--
-- This supports the soft-delete and recovery rule of the Hope HR System.

CREATE OR REPLACE FUNCTION cascade_employee_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only cascade when employee record_status actually changes
  IF NEW.record_status != OLD.record_status THEN
    UPDATE jobhistory
    SET 
      record_status = NEW.record_status,
      stamp = NEW.stamp
    WHERE empno = NEW.empno;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger safely.
-- DROP TRIGGER only removes the old trigger definition, not table data.
DROP TRIGGER IF EXISTS trg_cascade_employee_status ON employee;

CREATE TRIGGER trg_cascade_employee_status
AFTER UPDATE OF record_status ON employee
FOR EACH ROW
EXECUTE FUNCTION cascade_employee_status();