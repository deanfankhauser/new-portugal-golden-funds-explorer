import React, { useState } from 'react';
import { useInviteTeamMember, useBulkInviteTeamMembers } from '@/hooks/useTeamManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UserPlus, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { z } from 'zod';

interface InviteTeamMemberFormProps {
  companyName: string;
}

const emailSchema = z.string().email('Invalid email address');

const InviteTeamMemberForm: React.FC<InviteTeamMemberFormProps> = ({ companyName }) => {
  const [email, setEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [message, setMessage] = useState('');
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const inviteMutation = useInviteTeamMember();
  const bulkInviteMutation = useBulkInviteTeamMembers();

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

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkEmails) return;

    // Parse and validate emails
    const emailList = bulkEmails
      .split(/[\n,]/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 0);

    // Remove duplicates
    const uniqueEmails = Array.from(new Set(emailList));

    // Validate emails
    const errors: string[] = [];
    const validEmails = uniqueEmails.filter(email => {
      const result = emailSchema.safeParse(email);
      if (!result.success) {
        errors.push(`Invalid email: ${email}`);
        return false;
      }
      return true;
    });

    setEmailErrors(errors);

    if (validEmails.length === 0) return;

    bulkInviteMutation.mutate(
      {
        companyName,
        emails: validEmails,
        personalMessage: message || undefined,
      },
      {
        onSuccess: () => {
          setBulkEmails('');
          setMessage('');
          setEmailErrors([]);
        },
      }
    );
  };

  return (
    <Tabs defaultValue="single" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="single">
          <UserPlus className="h-4 w-4 mr-2" />
          Single Invite
        </TabsTrigger>
        <TabsTrigger value="bulk">
          <Users className="h-4 w-4 mr-2" />
          Bulk Invite
        </TabsTrigger>
      </TabsList>

      <TabsContent value="single">
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
      </TabsContent>

      <TabsContent value="bulk">
        <form onSubmit={handleBulkSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulkEmails">Email Addresses *</Label>
            <Textarea
              id="bulkEmails"
              placeholder="Enter multiple emails (one per line or comma-separated)&#10;colleague1@example.com&#10;colleague2@example.com, colleague3@example.com"
              value={bulkEmails}
              onChange={(e) => setBulkEmails(e.target.value)}
              disabled={bulkInviteMutation.isPending}
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Separate emails with commas or line breaks. Duplicates will be removed automatically.
            </p>
            {emailErrors.length > 0 && (
              <div className="text-xs text-destructive space-y-1">
                {emailErrors.map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulkMessage">Personal Message (Optional)</Label>
            <Textarea
              id="bulkMessage"
              placeholder="Add a personal note to your invitations..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={bulkInviteMutation.isPending}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={!bulkEmails || bulkInviteMutation.isPending}
            className="w-full sm:w-auto"
          >
            {bulkInviteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending Invitations...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Send Bulk Invitations
              </>
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default InviteTeamMemberForm;
