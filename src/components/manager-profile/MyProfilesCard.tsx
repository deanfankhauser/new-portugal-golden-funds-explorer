import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Edit3, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Profile } from '@/types/profile';

interface ProfileAssignment {
  id: string;
  profile_id: string;
  status: string;
  assigned_at: string;
  permissions: {
    can_edit_profile: boolean;
    can_edit_funds: boolean;
    can_manage_team: boolean;
    can_view_analytics: boolean;
  };
}

const MyProfilesCard: React.FC = () => {
  const { user } = useEnhancedAuth();
  const [assignments, setAssignments] = useState<ProfileAssignment[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get profile assignments
        const { data: assignmentsData, error: assignError } = await supabase
          .from('manager_profile_assignments')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('assigned_at', { ascending: false });

        if (assignError) throw assignError;

        const assignmentsList = (assignmentsData || []) as any as ProfileAssignment[];
        setAssignments(assignmentsList);

        // Get full profile data for each assignment
        if (assignmentsList.length > 0) {
          const profileIds = assignmentsList.map(a => a.profile_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', profileIds);

          if (!profilesError && profilesData) {
            setProfiles(profilesData as Profile[]);
          }
        }
      } catch (error) {
        console.error('Error fetching profile assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  if (loading || assignments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              My Company Profiles
            </CardTitle>
            <CardDescription>
              Manage your assigned company profiles
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const profile = profiles.find(p => p.id === assignment.profile_id);
            if (!profile) return null;

            return (
              <Link
                key={assignment.id}
                to={`/manage-profile/${profile.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors">
                  <div className="flex items-center gap-4">
                    {profile.logo_url && (
                      <img
                        src={profile.logo_url}
                        alt={profile.company_name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{profile.company_name}</h3>
                      <div className="flex gap-2 mt-1">
                        {assignment.permissions.can_edit_profile && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Edit Profile
                          </span>
                        )}
                        {assignment.permissions.can_view_analytics && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Analytics
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyProfilesCard;