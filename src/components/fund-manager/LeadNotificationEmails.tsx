import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, X, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeadNotificationEmailsProps {
  fundId: string;
}

interface NotificationEmail {
  id: string;
  email: string;
  created_at: string;
}

export const LeadNotificationEmails: React.FC<LeadNotificationEmailsProps> = ({ fundId }) => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<NotificationEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, [fundId]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fund_lead_notification_emails')
        .select('*')
        .eq('fund_id', fundId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching notification emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = async () => {
    if (!newEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(newEmail)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAdding(true);
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('fund_lead_notification_emails')
        .insert({
          fund_id: fundId,
          email: newEmail.toLowerCase().trim(),
          created_by: userData.user?.id,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Email Already Added',
            description: 'This email is already receiving notifications',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: 'Email Added',
        description: 'This email will now receive lead notifications',
      });

      setNewEmail('');
      fetchEmails();
    } catch (error) {
      console.error('Error adding email:', error);
      toast({
        title: 'Error',
        description: 'Failed to add email',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const removeEmail = async (id: string, email: string) => {
    try {
      const { error } = await supabase
        .from('fund_lead_notification_emails')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Email Removed',
        description: `${email} will no longer receive notifications`,
      });

      fetchEmails();
    } catch (error) {
      console.error('Error removing email:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove email',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <CardTitle className="text-lg">Lead Notification Emails</CardTitle>
            <CardDescription className="text-sm mt-1.5">
              Additional email addresses that will receive notifications when new leads enquire about this fund
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Email Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="email@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addEmail();
                }
              }}
              disabled={adding}
            />
          </div>
          <Button
            onClick={addEmail}
            disabled={adding || !newEmail.trim()}
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Email List */}
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : emails.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No additional notification emails configured</p>
            <p className="text-xs mt-1">Add email addresses above to receive lead notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {emails.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEmail(item.id, item.email)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadNotificationEmails;
