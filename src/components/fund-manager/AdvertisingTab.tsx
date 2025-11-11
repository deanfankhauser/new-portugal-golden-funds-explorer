import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Star, TrendingUp, Zap, Trophy, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { toast } from 'sonner';

interface AdvertisingTabProps {
  fundId: string;
  fundName: string;
}

const AdvertisingTab: React.FC<AdvertisingTabProps> = ({ fundId, fundName }) => {
  const { user } = useEnhancedAuth();
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const handleRequestAccess = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to request access');
      return;
    }

    setIsRequesting(true);
    try {
      const { error } = await supabase.functions.invoke('request-advertising-access', {
        body: { fundId, userId: user.id }
      });
      
      if (error) throw error;
      
      toast.success('Access request sent successfully! We\'ll be in touch soon.');
      setHasRequested(true);
    } catch (error: any) {
      console.error('Error requesting access:', error);
      toast.error('Failed to send request. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Megaphone className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Advertising & Promotion Coming Soon</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Boost your fund's visibility with premium placement and advertising options.
        </p>
        <Badge variant="secondary" className="mb-8">In Development</Badge>
        
        <Button 
          onClick={handleRequestAccess}
          disabled={isRequesting || hasRequested}
          size="lg"
          className="bg-primary hover:bg-primary/90 shadow-md"
        >
          {isRequesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending request...
            </>
          ) : hasRequested ? (
            'Access Requested'
          ) : (
            'Request Early Access'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Listing
            </CardTitle>
            <CardDescription>
              Stand out with premium placement on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Top position in fund listings
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Highlighted with distinctive badge
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                2x visibility increase
              </li>
            </ul>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Homepage Banner
            </CardTitle>
            <CardDescription>
              Full-width banner promotion on homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Prime homepage visibility
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Custom creative assets
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Maximum exposure
              </li>
            </ul>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Category Highlighting
            </CardTitle>
            <CardDescription>
              Featured placement in relevant category pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Top of category listings
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Targeted audience reach
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Enhanced card display
              </li>
            </ul>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-600" />
              Sponsored Comparisons
            </CardTitle>
            <CardDescription>
              Include your fund in popular comparison pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Appear in top comparisons
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Direct comparison visibility
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Qualified lead generation
              </li>
            </ul>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvertisingTab;
