import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InvitationDetails {
  email: string;
  companyName: string;
  inviterName: string;
  personalMessage?: string;
  expiresAt: string;
  createdAt: string;
}

export function useInvitationValidation(invitationToken: string | null) {
  const [isValidating, setIsValidating] = useState(false);
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!invitationToken) {
      setInvitation(null);
      setError(null);
      return;
    }

    const validateInvitation = async () => {
      setIsValidating(true);
      setError(null);

      try {
        const { data, error: functionError } = await supabase.functions.invoke(
          'validate-team-invitation',
          {
            body: { invitationToken },
          }
        );

        if (functionError) throw functionError;
        
        if (data?.error || !data?.valid) {
          setError(data?.error || 'Invalid invitation');
          setInvitation(null);
          return;
        }

        setInvitation(data.invitation);
      } catch (err: any) {
        console.error('Invitation validation error:', err);
        const errorMessage = err.message || 'Failed to validate invitation';
        setError(errorMessage);
        setInvitation(null);
        
        toast({
          title: 'Invalid Invitation',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsValidating(false);
      }
    };

    validateInvitation();
  }, [invitationToken, toast]);

  return { isValidating, invitation, error };
}

export function useInvitationAcceptance() {
  const [isAccepting, setIsAccepting] = useState(false);
  const { toast } = useToast();

  const acceptInvitation = async (invitationToken: string, userId: string) => {
    setIsAccepting(true);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'accept-team-invitation',
        {
          body: { invitationToken, userId },
        }
      );

      if (functionError) throw functionError;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Success!',
        description: data.message || 'Successfully joined the team',
      });

      return { success: true, alreadyAssigned: data.alreadyAssigned };
    } catch (err: any) {
      console.error('Invitation acceptance error:', err);
      const errorMessage = err.message || 'Failed to accept invitation';
      
      toast({
        title: 'Failed to accept invitation',
        description: errorMessage,
        variant: 'destructive',
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsAccepting(false);
    }
  };

  return { acceptInvitation, isAccepting };
}
