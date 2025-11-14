import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Building2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface InvitationBannerProps {
  companyName: string;
  inviterName: string;
  personalMessage?: string;
  expiresAt: string;
  email: string;
}

export const InvitationBanner: React.FC<InvitationBannerProps> = ({
  companyName,
  inviterName,
  personalMessage,
  expiresAt,
  email,
}) => {
  const expiresIn = formatDistanceToNow(new Date(expiresAt), { addSuffix: true });

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Team Invitation
            </CardTitle>
            <CardDescription className="mt-2">
              You've been invited to join <strong>{companyName}</strong>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            <Calendar className="h-3 w-3 mr-1" />
            Expires {expiresIn}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>Invited by <strong>{inviterName}</strong></span>
        </div>
        
        <div className="rounded-lg bg-background/50 p-4 border">
          <p className="text-sm text-foreground">
            <strong>Invitation Email:</strong> {email}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please sign up using this email address to accept the invitation.
          </p>
        </div>

        {personalMessage && (
          <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
            <p className="text-sm font-medium text-foreground mb-2">Personal Message:</p>
            <p className="text-sm text-muted-foreground italic">"{personalMessage}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
