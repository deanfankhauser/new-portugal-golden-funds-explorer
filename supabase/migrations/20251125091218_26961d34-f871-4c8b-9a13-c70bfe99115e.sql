-- Fix ambiguous column reference in migration function
DROP FUNCTION IF EXISTS public.migrate_team_members_from_jsonb();

CREATE OR REPLACE FUNCTION public.migrate_team_members_from_jsonb()
RETURNS TABLE(profile_id UUID, company_name TEXT, members_migrated INTEGER, funds_linked INTEGER)
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
    SELECT p.id, p.company_name, p.team_members
    FROM public.profiles p
    WHERE p.team_members IS NOT NULL 
      AND jsonb_array_length(p.team_members) > 0
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