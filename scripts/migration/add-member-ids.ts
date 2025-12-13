/**
 * Migration script to add member_id to existing company team members
 * Run this once to ensure all existing team members have unique IDs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bkmvydnfhmkjnuszroim.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateMemberId(): string {
  return crypto.randomUUID();
}

async function addMemberIds() {
  try {
    console.log('Starting migration: Adding member_id to company team members...');

    // Fetch all profiles with team_members
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, company_name, team_members')
      .not('team_members', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${profiles?.length || 0} profiles with team members`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const profile of profiles || []) {
      const teamMembers = profile.team_members as any[];
      
      if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
        skippedCount++;
        continue;
      }

      // Check if any member is missing member_id
      const needsUpdate = teamMembers.some(m => !m.member_id);

      if (!needsUpdate) {
        console.log(`✓ ${profile.company_name}: All members already have IDs`);
        skippedCount++;
        continue;
      }

      // Add member_id to members that don't have one
      const updatedMembers = teamMembers.map(member => ({
        ...member,
        member_id: member.member_id || generateMemberId()
      }));

      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ team_members: updatedMembers })
        .eq('id', profile.id);

      if (updateError) {
        console.error(`✗ ${profile.company_name}: Failed to update`, updateError);
        continue;
      }

      console.log(`✓ ${profile.company_name}: Added member IDs to ${updatedMembers.length} members`);
      updatedCount++;
    }

    console.log('\nMigration complete!');
    console.log(`Updated: ${updatedCount} profiles`);
    console.log(`Skipped: ${skippedCount} profiles`);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addMemberIds();
