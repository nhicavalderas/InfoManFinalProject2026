-- M3 Sprint 2
-- JobHistory RLS Policies
-- Purpose:
-- This migration adds Row Level Security policies for the jobhistory table.
-- USER accounts can only view ACTIVE job history records.
-- ADMIN and SUPERADMIN accounts can view ACTIVE and INACTIVE job history records.
-- Add/Edit/Soft-delete actions are controlled by assigned rights.

ALTER TABLE jobhistory ENABLE ROW LEVEL SECURITY;

-- Recreate policies safely.
-- DROP POLICY only removes policy definitions, not table data.
DROP POLICY IF EXISTS jh_select_policy ON jobhistory;
DROP POLICY IF EXISTS jh_insert_policy ON jobhistory;
DROP POLICY IF EXISTS jh_update_policy ON jobhistory;

-- SELECT policy:
-- USER sees ACTIVE records only.
-- ADMIN and SUPERADMIN can see ACTIVE and INACTIVE records.
CREATE POLICY jh_select_policy
ON jobhistory
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
-- Allows users with JH_ADD right to add job history records.
CREATE POLICY jh_insert_policy
ON jobhistory
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "UserModule_Rights" umr
    WHERE umr.userid = auth.uid()
    AND umr.rightid = 'JH_ADD'
    AND umr.right_value = 1
  )
);

-- UPDATE policy:
-- Allows users with JH_EDIT or JH_DEL right to update jobhistory records.
-- JH_DEL is used for soft-delete only by changing record_status to INACTIVE.
CREATE POLICY jh_update_policy
ON jobhistory
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "UserModule_Rights" umr
    WHERE umr.userid = auth.uid()
    AND umr.rightid IN ('JH_EDIT', 'JH_DEL')
    AND umr.right_value = 1
  )
)
WITH CHECK (
  record_status IN ('ACTIVE', 'INACTIVE')
);