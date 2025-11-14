import React, { useState } from 'react';
import { useInviteTeamMember } from '@/hooks/useTeamManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UserPlus } from 'lucide-react';

interface InviteTeamMemberFormProps {
  companyName: string;
}

const InviteTeamMemberForm: React.FC<InviteTeamMemberFormProps> = ({ companyName }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const inviteMutation = useInviteTeamMember();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    inviteMutation.mutate(
      {
        companyName,
        inviteeEmail: email.trim().toLowerCase(),
        personalMessage: message || undefined,
      },
      {
        onSuccess: () => {
          setEmail('');
          setMessage('');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="colleague@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={inviteMutation.isPending}
        />
        <p className="text-xs text-muted-foreground">
          They'll receive an invitation email with instructions to join your team.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Personal Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Add a personal note to your invitation..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={inviteMutation.isPending}
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={!email || inviteMutation.isPending}
        className="w-full sm:w-auto"
      >
        {inviteMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Sending Invitation...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Send Invitation
          </>
        )}
      </Button>
    </form>
  );
};

export default InviteTeamMemberForm;
