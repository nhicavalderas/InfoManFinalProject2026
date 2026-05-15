-- M3 Sprint 1 PR 03
-- Fix provision_new_user trigger
-- This trigger automatically creates an app user profile after Supabase Auth creates a new account.
-- New users are created as USER / INACTIVE pending admin activation.

CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_uid TEXT := NEW.id::TEXT;
  new_email TEXT := COALESCE(NEW.email, '');
  new_username TEXT;
BEGIN
  -- Create a safe username from metadata/email/user id
  new_username := LEFT(
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      SPLIT_PART(new_email, '@', 1),
      'user'
    ) || '_' || LEFT(new_uid, 6),
    30
  );

  -- Insert user profile as USER / INACTIVE
  INSERT INTO public."user" (
    userid,
    username,
    email,
    user_type,
    record_status,
    stamp
  )
  VALUES (
    new_uid,
    new_username,
    new_email,
    'USER',
    'INACTIVE',
    'AUTO-PROVISION ' || NOW()::TEXT
  )
  ON CONFLICT (userid) DO UPDATE
  SET
    email = EXCLUDED.email,
    stamp = 'AUTO-PROVISION UPDATE ' || NOW()::TEXT;

  -- Insert default module access
  INSERT INTO public.user_module (
    userid,
    modulecode,
    rights_value
  )
  SELECT
    new_uid,
    m.modulecode,
    CASE
      WHEN m.modulecode = 'Adm_Mod' THEN 0
      ELSE 1
    END
  FROM public."Module" m
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.user_module um
    WHERE um.userid = new_uid
    AND um.modulecode = m.modulecode
  );

  -- Insert default VIEW-only rights
  INSERT INTO public."UserModule_Rights" (
    userid,
    rightcode,
    right_value
  )
  SELECT
    new_uid,
    r.rightcode,
    CASE
      WHEN r.rightcode IN ('EMP_VIEW', 'JH_VIEW', 'JOB_VIEW', 'DEPT_VIEW') THEN 1
      ELSE 0
    END
  FROM public.rights r
  WHERE NOT EXISTS (
    SELECT 1
    FROM public."UserModule_Rights" umr
    WHERE umr.userid = new_uid
    AND umr.rightcode = r.rightcode
  );

  RETURN NEW;
END;
$$;

-- Recreate auth trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.provision_new_user();