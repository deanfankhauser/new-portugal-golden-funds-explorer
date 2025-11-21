import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ProfileAnalyticsTabProps {
  profileId: string;
}

const ProfileAnalyticsTab: React.FC<ProfileAnalyticsTabProps> = ({ profileId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Profile Analytics
          </CardTitle>
          <CardDescription>
            Track your profile performance and visitor engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
            <p className="text-muted-foreground">
              Profile analytics tracking is currently being developed. You'll soon be able to see:
            </p>
            <ul className="text-sm text-muted-foreground mt-4 space-y-2">
              <li>• Profile page views and unique visitors</li>
              <li>• Aggregated fund enquiries</li>
              <li>• Visitor demographics and behavior</li>
              <li>• Conversion metrics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileAnalyticsTab;