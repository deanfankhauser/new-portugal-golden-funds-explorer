-- 1) Fix fund_brief_submissions relationships for PostgREST embeds
-- Add manager_user_id and investor_user_id columns and valid FKs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='fund_brief_submissions' AND column_name='manager_user_id'
  ) THEN
    ALTER TABLE public.fund_brief_submissions
      ADD COLUMN manager_user_id uuid NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='fund_brief_submissions' AND column_name='investor_user_id'
  ) THEN
    ALTER TABLE public.fund_brief_submissions
      ADD COLUMN investor_user_id uuid NULL;
  END IF;

  -- Drop ambiguous FKs (if any) that pointed fund_brief_submissions.user_id to both tables
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='fund_brief_submissions' AND constraint_name='fund_brief_submissions_user_id_manager_fk'
  ) THEN
    ALTER TABLE public.fund_brief_submissions
      DROP CONSTRAINT fund_brief_submissions_user_id_manager_fk;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='fund_brief_submissions' AND constraint_name='fund_brief_submissions_user_id_investor_fk'
  ) THEN
    ALTER TABLE public.fund_brief_submissions
      DROP CONSTRAINT fund_brief_submissions_user_id_investor_fk;
  END IF;

  -- Ensure FK to funds exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='fund_brief_submissions' AND constraint_name='fund_brief_submissions_fund_id_fkey'
  ) THEN
    ALTER TABLE public.fund_brief_submissions
      ADD CONSTRAINT fund_brief_submissions_fund_id_fkey
      FOREIGN KEY (fund_id) REFERENCES public.funds(id) ON DELETE NO ACTION;
  END IF;

  -- Add FKs on the new columns (VALID)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='fund_brief_submissions' AND constraint_name='fund_brief_submissions_manager_user_fk'
  ) THEN
    ALTER TABLE public.fund_brief_submissions
      ADD CONSTRAINT fund_brief_submissions_manager_user_fk
      FOREIGN KEY (manager_user_id) REFERENCES public.manager_profiles(user_id)
      ON UPDATE CASCADE ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='fund_brief_submissions' AND constraint_name='fund_brief_submissions_investor_user_fk'
  ) THEN
    ALTER TABLE public.fund_brief_submissions
      ADD CONSTRAINT fund_brief_submissions_investor_user_fk
      FOREIGN KEY (investor_user_id) REFERENCES public.investor_profiles(user_id)
      ON UPDATE CASCADE ON DELETE SET NULL;
  END IF;
END $$;

-- Backfill manager_user_id / investor_user_id from existing user_id
UPDATE public.fund_brief_submissions f
SET manager_user_id = f.user_id
FROM public.manager_profiles m
WHERE f.manager_user_id IS NULL AND m.user_id = f.user_id;

UPDATE public.fund_brief_submissions f
SET investor_user_id = f.user_id
FROM public.investor_profiles i
WHERE f.investor_user_id IS NULL AND i.user_id = f.user_id;

-- Create trigger to keep these columns in sync
CREATE OR REPLACE FUNCTION public.set_fund_brief_profile_links()
RETURNS trigger AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.manager_profiles mp WHERE mp.user_id = NEW.user_id) THEN
      NEW.manager_user_id := NEW.user_id;
    ELSE
      NEW.manager_user_id := NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM public.investor_profiles ip WHERE ip.user_id = NEW.user_id) THEN
      NEW.investor_user_id := NEW.user_id;
    ELSE
      NEW.investor_user_id := NULL;
    END IF;
  ELSE
    NEW.manager_user_id := NULL;
    NEW.investor_user_id := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_set_fund_brief_profile_links ON public.fund_brief_submissions;
CREATE TRIGGER trg_set_fund_brief_profile_links
BEFORE INSERT OR UPDATE OF user_id
ON public.fund_brief_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_fund_brief_profile_links();

-- 2) Ensure storage policies exist for all buckets in Funds_Develop
-- Enable public read for fund-logos and profile-photos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public read fund logos'
  ) THEN
    CREATE POLICY "Public read fund logos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'fund-logos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public read profile photos'
  ) THEN
    CREATE POLICY "Public read profile photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-photos');
  END IF;

  -- Private buckets: fund-briefs-pending
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users can view own pending fund briefs'
  ) THEN
    CREATE POLICY "Users can view own pending fund briefs"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'fund-briefs-pending'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users can upload own pending fund briefs'
  ) THEN
    CREATE POLICY "Users can upload own pending fund briefs"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'fund-briefs-pending'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can view pending fund briefs'
  ) THEN
    CREATE POLICY "Admins can view pending fund briefs"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'fund-briefs-pending' AND public.is_user_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can modify pending fund briefs'
  ) THEN
    CREATE POLICY "Admins can modify pending fund briefs"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'fund-briefs-pending' AND public.is_user_admin());
  END IF;

  -- Private bucket: fund-briefs (approved/archived)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users can view own fund briefs'
  ) THEN
    CREATE POLICY "Users can view own fund briefs"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'fund-briefs'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can view all fund briefs'
  ) THEN
    CREATE POLICY "Admins can view all fund briefs"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'fund-briefs' AND public.is_user_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can modify fund briefs'
  ) THEN
    CREATE POLICY "Admins can modify fund briefs"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'fund-briefs' AND public.is_user_admin());
  END IF;
END $$;