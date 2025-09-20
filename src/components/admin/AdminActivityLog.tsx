import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, Shield, CheckCircle, XCircle, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminActivityLogProps {
  limit?: number;
  showHeader?: boolean;
}

export const AdminActivityLog: React.FC<AdminActivityLogProps> = ({ 
  limit = 10, 
  showHeader = true 
}) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [limit]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_activity_log')
        .select(`
          *,
          admin_users!inner(
            user_id,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching admin activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'suggestion_approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'suggestion_rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'user_role_changed':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'system_config_updated':
        return <Settings className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionDescription = (activity: any) => {
    const { action_type, target_type, details } = activity;
    
    switch (action_type) {
      case 'suggestion_approved':
        return `Approved a suggestion for fund ${details?.fund_id || 'Unknown'}`;
      case 'suggestion_rejected':
        return `Rejected a suggestion for fund ${details?.fund_id || 'Unknown'}`;
      case 'user_role_changed':
        return `Changed user role to ${details?.new_role || 'Unknown'}`;
      case 'system_config_updated':
        return `Updated system configuration: ${details?.config_key || 'Unknown'}`;
      default:
        return `Performed ${action_type} on ${target_type}`;
    }
  };

  const getActionBadgeColor = (actionType: string) => {
    switch (actionType) {
      case 'suggestion_approved':
        return 'bg-green-100 text-green-800';
      case 'suggestion_rejected':
        return 'bg-red-100 text-red-800';
      case 'user_role_changed':
        return 'bg-blue-100 text-blue-800';
      case 'system_config_updated':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Admin Activity
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Admin Activity
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No admin activity recorded yet.
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">
                    {getActionIcon(activity.action_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className={getActionBadgeColor(activity.action_type)}
                      >
                        {activity.action_type.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground mb-1">
                      {getActionDescription(activity)}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>Admin Role: {activity.admin_users?.role || 'Unknown'}</span>
                      {activity.ip_address && (
                        <>
                          <span>•</span>
                          <span>IP: {activity.ip_address}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};