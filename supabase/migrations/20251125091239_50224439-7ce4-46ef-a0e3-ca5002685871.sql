-- Execute team member data migration from JSONB to dedicated tables
DO $$
DECLARE
  migration_results RECORD;
  total_members INTEGER := 0;
  total_funds INTEGER := 0;
BEGIN
  -- Execute migration and capture results
  FOR migration_results IN 
    SELECT * FROM public.migrate_team_members_from_jsonb()
  LOOP
    total_members := total_members + migration_results.members_migrated;
    total_funds := total_funds + migration_results.funds_linked;
    
    RAISE NOTICE 'Migrated % members and linked % funds for company: %', 
      migration_results.members_migrated,
      migration_results.funds_linked,
      migration_results.company_name;
  END LOOP;
  
  RAISE NOTICE 'Total migration complete: % team members, % fund assignments', 
    total_members, total_funds;
END $$;