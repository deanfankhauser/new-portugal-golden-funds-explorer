-- Ensure profiles.user_id is unique and create FK from fund_managers.user_id to profiles.user_id
-- Also cleanup any dangling fund_managers rows to avoid FK creation failure

-- 1) Ensure UNIQUE constraint on profiles.user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_user_id_key'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- 2) Cleanup dangling fund_managers.user_id rows without a matching profile
DELETE FROM public.fund_managers fm
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.user_id = fm.user_id
);

-- 3) Add FK fund_managers.user_id -> profiles.user_id with ON DELETE CASCADE (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fund_managers_user_id_profiles_user_id_fkey'
      AND conrelid = 'public.fund_managers'::regclass
  ) THEN
    ALTER TABLE public.fund_managers
    ADD CONSTRAINT fund_managers_user_id_profiles_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(user_id)
    ON DELETE CASCADE;
  END IF;
END $$;