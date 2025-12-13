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

        // Use RPC function to bypass RLS and fetch team members
        const { data, error: fetchError } = await supabase
          .rpc('get_team_members_by_company_name', { 
            company_name_input: companyName 
          });

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

  const refetch = () => {
    if (companyName) {
      const fetchMembers = async () => {
        try {
          setLoading(true);
          setError(null);

          const { data, error: fetchError } = await supabase
            .rpc('get_team_members_by_company_name', { 
              company_name_input: companyName 
            });

          if (fetchError) throw fetchError;

          if (data) {
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
    }
  };

  return { members, loading, error, refetch };
}
