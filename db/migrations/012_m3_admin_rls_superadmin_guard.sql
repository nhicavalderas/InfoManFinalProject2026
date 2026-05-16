-- M3 Sprint 3
-- Admin RLS and SUPERADMIN Guard
-- Purpose:
-- This migration adds Row Level Security policies for admin-related user management.
-- ADMIN and SUPERADMIN can manage normal USER accounts.
-- ADMIN is blocked from modifying SUPERADMIN accounts.
-- SUPERADMIN keeps full administrative control.

ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserModule_Rights" ENABLE ROW LEVEL SECURITY;

-- Recreate user table policies safely.
-- DROP POLICY only removes policy definitions, not table data.
DROP POLICY IF EXISTS user_select_policy ON "user";
DROP POLICY IF EXISTS user_update_policy ON "user";

-- SELECT policy:
-- A user can view their own profile.
-- ADMIN and SUPERADMIN can view all user profiles.
CREATE POLICY user_select_policy
ON "user"
FOR SELECT
TO authenticated
USING (
  userid = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM "user" current_user_row
    WHERE current_user_row.userid = auth.uid()
    AND current_user_row.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);

-- UPDATE policy:
-- SUPERADMIN can update any user account.
-- ADMIN can update non-SUPERADMIN accounts only.
-- This blocks ADMIN from modifying SUPERADMIN rows.
CREATE POLICY user_update_policy
ON "user"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "user" current_user_row
    WHERE current_user_row.userid = auth.uid()
    AND (
      current_user_row.user_type = 'SUPERADMIN'
      OR (
        current_user_row.user_type = 'ADMIN'
        AND "user".user_type <> 'SUPERADMIN'
      )
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "user" current_user_row
    WHERE current_user_row.userid = auth.uid()
    AND (
      current_user_row.user_type = 'SUPERADMIN'
      OR (
        current_user_row.user_type = 'ADMIN'
        AND "user".user_type <> 'SUPERADMIN'
      )
    )
  )
);

-- Recreate UserModule_Rights policies safely.
DROP POLICY IF EXISTS usermodule_rights_select_policy ON "UserModule_Rights";
DROP POLICY IF EXISTS usermodule_rights_update_policy ON "UserModule_Rights";

-- SELECT policy:
-- Users can view their own rights.
-- ADMIN and SUPERADMIN can view assigned rights.
CREATE POLICY usermodule_rights_select_policy
ON "UserModule_Rights"
FOR SELECT
TO authenticated
USING (
  userid = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM "user" current_user_row
    WHERE current_user_row.userid = auth.uid()
    AND current_user_row.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);

-- UPDATE policy:
-- SUPERADMIN can update rights.
-- ADMIN can update rights only for non-SUPERADMIN users.
-- This prevents ADMIN from changing SUPERADMIN rights.
CREATE POLICY usermodule_rights_update_policy
ON "UserModule_Rights"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "user" current_user_row
    WHERE current_user_row.userid = auth.uid()
    AND (
      current_user_row.user_type = 'SUPERADMIN'
      OR (
        current_user_row.user_type = 'ADMIN'
        AND EXISTS (
          SELECT 1
          FROM "user" target_user
          WHERE target_user.userid = "UserModule_Rights".userid
          AND target_user.user_type <> 'SUPERADMIN'
        )
      )
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "user" current_user_row
    WHERE current_user_row.userid = auth.uid()
    AND (
      current_user_row.user_type = 'SUPERADMIN'
      OR (
        current_user_row.user_type = 'ADMIN'
        AND EXISTS (
          SELECT 1
          FROM "user" target_user
          WHERE target_user.userid = "UserModule_Rights".userid
          AND target_user.user_type <> 'SUPERADMIN'
        )
      )
    )
  )
);