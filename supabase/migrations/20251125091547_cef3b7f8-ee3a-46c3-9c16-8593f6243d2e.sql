-- Enhanced migration function to populate fund_team_members table (variable names fixed)
CREATE OR REPLACE FUNCTION public.migrate_fund_team_members()
RETURNS TABLE(result_fund_id TEXT, members_migrated INT, members_created INT, members_linked INT) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fund_record RECORD;
  member_record JSONB;
  v_team_member_id UUID;
  v_profile_id_for_fund UUID;
  v_slug_base TEXT;
  v_final_slug TEXT;
  v_slug_counter INTEGER;
  v_members_count INT;
  v_created_count INT;
  v_linked_count INT;
BEGIN
  -- Loop through all funds with team_members data
  FOR fund_record IN 
    SELECT f.id, f.name, f.manager_name, f.team_members
    FROM public.funds f
    WHERE f.team_members IS NOT NULL 
      AND jsonb_array_length(f.team_members) > 0
  LOOP
    v_members_count := 0;
    v_created_count := 0;
    v_linked_count := 0;
    
    -- Get profile_id for this fund's manager
    SELECT p.id INTO v_profile_id_for_fund
    FROM public.profiles p
    WHERE p.company_name = fund_record.manager_name
    LIMIT 1;
    
    -- Skip if no matching profile found
    IF v_profile_id_for_fund IS NULL THEN
      CONTINUE;
    END IF;
    
    -- Loop through each team member in the fund's JSONB array
    FOR member_record IN 
      SELECT * FROM jsonb_array_elements(fund_record.team_members)
    LOOP
      v_team_member_id := NULL;
      
      -- Try to find existing team member by member_id
      IF member_record->>'member_id' IS NOT NULL THEN
        SELECT tm.id INTO v_team_member_id
        FROM public.team_members tm
        WHERE tm.id = (member_record->>'member_id')::UUID
          AND tm.profile_id = v_profile_id_for_fund;
      END IF;
      
      -- If not found by member_id, try to match by name
      IF v_team_member_id IS NULL AND member_record->>'name' IS NOT NULL THEN
        SELECT tm.id INTO v_team_member_id
        FROM public.team_members tm
        WHERE tm.profile_id = v_profile_id_for_fund
          AND tm.name = member_record->>'name'
        LIMIT 1;
      END IF;
      
      -- If still not found, create new team member
      IF v_team_member_id IS NULL AND member_record->>'name' IS NOT NULL THEN
        -- Generate slug from name
        v_slug_base := lower(trim(member_record->>'name'));
        v_slug_base := regexp_replace(v_slug_base, '\s+', '-', 'g');
        v_slug_base := regexp_replace(v_slug_base, '[^\w\-]+', '', 'g');
        v_slug_base := regexp_replace(v_slug_base, '--+', '-', 'g');
        v_slug_base := regexp_replace(v_slug_base, '^-+|-+$', '', 'g');
        
        -- Handle duplicate slugs
        v_final_slug := v_slug_base;
        v_slug_counter := 1;
        WHILE EXISTS (
          SELECT 1 FROM public.team_members 
          WHERE team_members.profile_id = v_profile_id_for_fund 
            AND team_members.slug = v_final_slug
        ) LOOP
          v_final_slug := v_slug_base || '-' || v_slug_counter;
          v_slug_counter := v_slug_counter + 1;
        END LOOP;
        
        -- Insert new team member
        INSERT INTO public.team_members (
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
          v_profile_id_for_fund,
          v_final_slug,
          member_record->>'name',
          COALESCE(member_record->>'role', member_record->>'position', 'Team Member'),
          member_record->>'bio',
          member_record->>'photoUrl',
          member_record->>'linkedinUrl',
          member_record->>'email'
        )
        RETURNING id INTO v_team_member_id;
        
        v_created_count := v_created_count + 1;
      END IF;
      
      -- Create fund_team_members assignment if we have a valid team_member_id
      IF v_team_member_id IS NOT NULL THEN
        INSERT INTO public.fund_team_members (
          fund_id,
          team_member_id,
          fund_role
        )
        VALUES (
          fund_record.id,
          v_team_member_id,
          member_record->>'fund_role'
        )
        ON CONFLICT (fund_id, team_member_id) DO NOTHING;
        
        v_linked_count := v_linked_count + 1;
      END IF;
      
      v_members_count := v_members_count + 1;
    END LOOP;
    
    -- Return migration results for this fund
    RETURN QUERY SELECT 
      fund_record.id,
      v_members_count,
      v_created_count,
      v_linked_count;
  END LOOP;
  
  RETURN;
END;
$$;

-- Execute the enhanced migration
DO $$
DECLARE
  result_record RECORD;
  total_funds INT := 0;
  total_members INT := 0;
  total_created INT := 0;
  total_linked INT := 0;
BEGIN
  RAISE NOTICE 'Starting enhanced fund team members migration...';
  
  FOR result_record IN SELECT * FROM public.migrate_fund_team_members()
  LOOP
    total_funds := total_funds + 1;
    total_members := total_members + result_record.members_migrated;
    total_created := total_created + result_record.members_created;
    total_linked := total_linked + result_record.members_linked;
    
    RAISE NOTICE 'Fund %: % members processed, % created, % linked', 
      result_record.result_fund_id, 
      result_record.members_migrated,
      result_record.members_created,
      result_record.members_linked;
  END LOOP;
  
  RAISE NOTICE 'Migration complete: % funds, % members, % created, % linked', 
    total_funds, total_members, total_created, total_linked;
END $$;