import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyTeamMember } from '@/types/team';

export function useCompanyTeamMembers(companyName: string) {
  const [members, setMembers] = useState<CompanyTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!companyName) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Find profile by company name
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .ilike('company_name', companyName)
          .single();

        if (profileError || !profileData) {
          console.log('No profile found for company:', companyName);
          setMembers([]);
          setLoading(false);
          return;
        }

        // Step 2: Get team members for that profile
        const { data, error: fetchError } = await supabase
          .from('team_members')
          .select('id, slug, name, role, bio, photo_url, linkedin_url, email')
          .eq('profile_id', profileData.id)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          // Map to CompanyTeamMember format
          const mappedMembers: CompanyTeamMember[] = data.map(member => ({
            member_id: member.id,
            slug: member.slug,
            name: member.name,
            role: member.role,
            bio: member.bio || undefined,
            photoUrl: member.photo_url || undefined,
            linkedinUrl: member.linkedin_url || undefined,
            email: member.email || undefined,
          }));
          setMembers(mappedMembers);
        } else {
          setMembers([]);
        }
      } catch (err) {
        console.error('Error fetching company team members:', err);
        setError(err as Error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [companyName]);

  return { members, loading, error };
}
