-- M3 Sprint 2
-- Job RLS Policies
-- Purpose:
-- This migration adds Row Level Security policies for the job table.
-- USER accounts can only view ACTIVE job records.
-- ADMIN and SUPERADMIN accounts can view ACTIVE and INACTIVE job records.
-- Add/Edit/Soft-delete actions are controlled by assigned rights.

ALTER TABLE job ENABLE ROW LEVEL SECURITY;

-- Recreate policies safely.
-- DROP POLICY only removes policy definitions, not table data.
DROP POLICY IF EXISTS job_select_policy ON job;
DROP POLICY IF EXISTS job_insert_policy ON job;
DROP POLICY IF EXISTS job_update_policy ON job;

-- SELECT policy:
-- USER sees ACTIVE records only.
-- ADMIN and SUPERADMIN can see ACTIVE and INACTIVE records.
CREATE POLICY job_select_policy
ON job
FOR SELECT
TO authenticated
USING (
  record_status = 'ACTIVE'
  OR EXISTS (
    SELECT 1
    FROM "user" u
    WHERE u.userid = auth.uid()
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);

-- INSERT policy:
-- Allows users with JOB_ADD right to add job records.
CREATE POLICY job_insert_policy
ON job
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "UserModule_Rights" umr
    WHERE umr.userid = auth.uid()
    AND umr.rightid = 'JOB_ADD'
    AND umr.right_value = 1
  )
);

-- UPDATE policy:
-- Allows users with JOB_EDIT or JOB_DEL right to update job records.
-- JOB_DEL is used for soft-delete only by changing record_status to INACTIVE.
CREATE POLICY job_update_policy
ON job
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "UserModule_Rights" umr
    WHERE umr.userid = auth.uid()
    AND umr.rightid IN ('JOB_EDIT', 'JOB_DEL')
    AND umr.right_value = 1
  )
)
WITH CHECK (
  record_status IN ('ACTIVE', 'INACTIVE')
);