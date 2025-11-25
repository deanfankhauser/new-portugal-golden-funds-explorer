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

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('team_members')
          .ilike('company_name', companyName)
          .single();

        if (fetchError) throw fetchError;

        if (data?.team_members) {
          setMembers(data.team_members as unknown as CompanyTeamMember[]);
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
