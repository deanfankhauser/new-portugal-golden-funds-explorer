
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';

interface EmailCaptureProps {
  title: string;
  description: string;
  onEmailSubmit: (email: string) => void;
  isSubmitting?: boolean;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ 
  title, 
  description, 
  onEmailSubmit,
  isSubmitting = false 
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      onEmailSubmit(email.trim());
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
          <Lock className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!email.trim() || !email.includes('@') || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Continue'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          We'll use your email to send you updates about Portuguese Golden Visa investments.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailCapture;
