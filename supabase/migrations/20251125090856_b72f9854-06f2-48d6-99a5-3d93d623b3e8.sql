-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, slug)
);

-- Create fund_team_members join table
CREATE TABLE public.fund_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id TEXT NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  fund_role TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(fund_id, team_member_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_team_members_profile_id ON public.team_members(profile_id);
CREATE INDEX idx_team_members_slug ON public.team_members(slug);
CREATE INDEX idx_fund_team_members_fund_id ON public.fund_team_members(fund_id);
CREATE INDEX idx_fund_team_members_team_member_id ON public.fund_team_members(team_member_id);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_members
CREATE POLICY "Public read access to team members"
  ON public.team_members
  FOR SELECT
  USING (true);

CREATE POLICY "Company managers can insert their own team members"
  ON public.team_members
  FOR INSERT
  WITH CHECK (
    can_user_edit_profile(auth.uid(), profile_id) OR is_user_admin()
  );

CREATE POLICY "Company managers can update their own team members"
  ON public.team_members
  FOR UPDATE
  USING (
    can_user_edit_profile(auth.uid(), profile_id) OR is_user_admin()
  );

CREATE POLICY "Company managers can delete their own team members"
  ON public.team_members
  FOR DELETE
  USING (
    can_user_edit_profile(auth.uid(), profile_id) OR is_user_admin()
  );

-- RLS Policies for fund_team_members
CREATE POLICY "Public read access to fund team assignments"
  ON public.fund_team_members
  FOR SELECT
  USING (true);

CREATE POLICY "Fund managers can assign team members to their funds"
  ON public.fund_team_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.funds f
      WHERE f.id = fund_id
        AND (can_user_manage_company_funds(auth.uid(), f.manager_name) OR is_user_admin())
    )
  );

CREATE POLICY "Fund managers can update team assignments for their funds"
  ON public.fund_team_members
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.funds f
      WHERE f.id = fund_id
        AND (can_user_manage_company_funds(auth.uid(), f.manager_name) OR is_user_admin())
    )
  );

CREATE POLICY "Fund managers can remove team members from their funds"
  ON public.fund_team_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.funds f
      WHERE f.id = fund_id
        AND (can_user_manage_company_funds(auth.uid(), f.manager_name) OR is_user_admin())
    )
  );

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Data migration function to move JSONB team_members to dedicated table
CREATE OR REPLACE FUNCTION public.migrate_team_members_from_jsonb()
RETURNS TABLE(
  profile_id UUID,
  company_name TEXT,
  members_migrated INTEGER,
  funds_linked INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record RECORD;
  member_record JSONB;
  new_member_id UUID;
  slug_base TEXT;
  final_slug TEXT;
  slug_counter INTEGER;
  fund_record RECORD;
  members_count INTEGER;
  funds_count INTEGER;
BEGIN
  -- Loop through all profiles with team_members
  FOR profile_record IN 
    SELECT id, company_name, team_members
    FROM public.profiles
    WHERE team_members IS NOT NULL 
      AND jsonb_array_length(team_members) > 0
  LOOP
    members_count := 0;
    funds_count := 0;
    
    -- Loop through each team member in the JSONB array
    FOR member_record IN 
      SELECT * FROM jsonb_array_elements(profile_record.team_members)
    LOOP
      -- Generate slug from name
      slug_base := lower(trim(member_record->>'name'));
      slug_base := regexp_replace(slug_base, '\s+', '-', 'g');
      slug_base := regexp_replace(slug_base, '[^\w\-]+', '', 'g');
      slug_base := regexp_replace(slug_base, '--+', '-', 'g');
      slug_base := regexp_replace(slug_base, '^-+|-+$', '', 'g');
      
      -- Handle duplicate slugs by appending numbers
      final_slug := slug_base;
      slug_counter := 1;
      WHILE EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE team_members.profile_id = profile_record.id 
          AND team_members.slug = final_slug
      ) LOOP
        final_slug := slug_base || '-' || slug_counter;
        slug_counter := slug_counter + 1;
      END LOOP;
      
      -- Insert team member (check if already exists by member_id)
      INSERT INTO public.team_members (
        id,
        profile_id,
        slug,
        name,
        role,
        bio,
        photo_url,
        linkedin_url,
        email
      )
      VALUES (
        COALESCE((member_record->>'member_id')::UUID, gen_random_uuid()),
        profile_record.id,
        final_slug,
        member_record->>'name',
        member_record->>'role',
        member_record->>'bio',
        member_record->>'photoUrl',
        member_record->>'linkedinUrl',
        member_record->>'email'
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id INTO new_member_id;
      
      -- If insert was successful, increment counter
      IF new_member_id IS NOT NULL THEN
        members_count := members_count + 1;
        
        -- Link team member to funds (if member_id exists in funds.team_members)
        IF member_record->>'member_id' IS NOT NULL THEN
          FOR fund_record IN
            SELECT f.id, tm->>'fund_role' as fund_role
            FROM public.funds f,
            jsonb_array_elements(f.team_members) tm
            WHERE tm->>'member_id' = member_record->>'member_id'
              AND f.manager_name = profile_record.company_name
          LOOP
            INSERT INTO public.fund_team_members (
              fund_id,
              team_member_id,
              fund_role
            )
            VALUES (
              fund_record.id,
              new_member_id,
              fund_record.fund_role
            )
            ON CONFLICT (fund_id, team_member_id) DO NOTHING;
            
            funds_count := funds_count + 1;
          END LOOP;
        END IF;
      END IF;
    END LOOP;
    
    -- Return migration results for this profile
    RETURN QUERY SELECT 
      profile_record.id,
      profile_record.company_name,
      members_count,
      funds_count;
  END LOOP;
  
  RETURN;
END;
$$;

-- Execute migration (comment out if you want to run manually)
-- SELECT * FROM public.migrate_team_members_from_jsonb();