import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Search, Building2, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface ProfileAssignment {
  id: string;
  profile_id: string;
  user_id: string;
  status: string;
  assigned_at: string;
  permissions: {
    can_edit_profile: boolean;
    can_edit_funds: boolean;
    can_manage_team: boolean;
    can_view_analytics: boolean;
  };
  notes?: string;
  profiles?: Profile;
}

export const ManagerProfileAssignment: React.FC = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<ProfileAssignment[]>([]);
  const [approvedProfiles, setApprovedProfiles] = useState<Profile[]>([]);
  const [managers, setManagers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Assignment form state
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [canEditProfile, setCanEditProfile] = useState(true);
  const [canEditFunds, setCanEditFunds] = useState(false);
  const [canManageTeam, setCanManageTeam] = useState(false);
  const [canViewAnalytics, setCanViewAnalytics] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      // Fetch approved manager profiles
      const { data: profilesData, error: profilesError } = await supabase.rpc(
        'get_public_manager_profiles'
      );
      if (!profilesError && profilesData) {
        setApprovedProfiles(profilesData as Profile[]);
      }

      // Fetch all users for assignment
      const { data: managersData, error: managersError } = await supabase.rpc('admin_list_profiles');
      if (!managersError && managersData) {
        setManagers((managersData || []).map((m: any) => ({
          ...m,
          id: m.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })));
      }

      // Fetch existing assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('manager_profile_assignments' as any)
        .select(`
          *,
          profiles (*)
        `)
        .order('assigned_at', { ascending: false });

      if (!assignmentsError && assignmentsData) {
        setAssignments(assignmentsData as any);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignManager = async () => {
    if (!selectedProfile || selectedManagers.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select a profile and at least one manager',
        variant: 'destructive',
      });
      return;
    }

    setAssigning(true);
    try {
      const permissions = {
        can_edit_profile: canEditProfile,
        can_edit_funds: canEditFunds,
        can_manage_team: canManageTeam,
        can_view_analytics: canViewAnalytics,
      };

      const { data: results, error } = await supabase.rpc('admin_assign_profile_managers', {
        _profile_id: selectedProfile,
        _manager_ids: selectedManagers,
        _permissions: permissions,
        _status: 'active',
        _notes: assignmentNotes || null,
      });

      if (error) throw error;

      const insertedCount = (results || []).filter((r: any) => r.inserted).length;

      // Send notification emails
      const profile = approvedProfiles.find((p) => p.id === selectedProfile);
      if (profile) {
        for (const managerId of selectedManagers) {
          const manager = managers.find((m) => m.user_id === managerId);
          if (manager) {
            // Construct the assigned user's name from their profile
            const assignedUserName = manager.first_name && manager.last_name
              ? `${manager.first_name} ${manager.last_name}`
              : manager.first_name || manager.email.split('@')[0];
            
            console.log('Sending assignment email:', {
              profile_id: profile.id,
              company_name: profile.company_name,
              assigned_user_name: assignedUserName,
              assigned_user_email: manager.email,
            });
            
            await supabase.functions.invoke('notify-manager-profile-assignment', {
              body: {
                profile_id: profile.id,
                company_name: profile.company_name,
                manager_name: assignedUserName,
                manager_email: manager.email,
                permissions,
                notes: assignmentNotes,
                assigned_at: new Date().toISOString(),
              },
            });
          }
        }
      }

      toast({
        title: 'Managers Assigned',
        description: `Assigned ${insertedCount} manager(s) to ${profile?.company_name}`,
      });

      // Reset form
      setSelectedProfile('');
      setSelectedManagers([]);
      setAssignmentNotes('');
      setCanEditProfile(true);
      setCanEditFunds(false);
      setCanManageTeam(false);
      setCanViewAnalytics(true);
      setIsAssignDialogOpen(false);

      fetchData();
    } catch (error: any) {
      console.error('Error assigning manager:', error);
      toast({
        title: 'Assignment Failed',
        description: error.message || 'Failed to assign manager',
        variant: 'destructive',
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string, managerName: string, companyName: string) => {
    if (!confirm(`Remove ${managerName} from managing ${companyName}?`)) return;

    try {
      const { error } = await supabase
        .from('manager_profile_assignments' as any)
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: 'Manager Removed',
        description: `${managerName} has been removed from ${companyName}`,
      });

      fetchData();
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove assignment',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePermissions = async (
    assignmentId: string,
    newPermissions: ProfileAssignment['permissions']
  ) => {
    try {
      const { error } = await supabase
        .from('manager_profile_assignments' as any)
        .update({ permissions: newPermissions })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: 'Permissions Updated',
        description: 'Manager permissions have been updated',
      });

      fetchData();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to update permissions',
        variant: 'destructive',
      });
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const profile = approvedProfiles.find((p) => p.id === assignment.profile_id);
    const assignedUser = assignment.profiles;
    const query = searchQuery.toLowerCase();

    return (
      profile?.company_name?.toLowerCase().includes(query) ||
      profile?.manager_name?.toLowerCase().includes(query) ||
      assignedUser?.email?.toLowerCase().includes(query) ||
      assignedUser?.first_name?.toLowerCase().includes(query) ||
      assignedUser?.last_name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Assignments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Profiles</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedProfiles.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Company Manager Assignments</CardTitle>
              <CardDescription>
                Assign users to manage company-level profiles and information
              </CardDescription>
            </div>
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Manager
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Profile Manager</DialogTitle>
                  <DialogDescription>
                    Assign a user to manage a company profile
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Company Profile</Label>
                    <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a profile" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        {approvedProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id!}>
                            {profile.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Managers ({selectedManagers.length} selected)</Label>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-2">
                      {managers.map((manager) => {
                        const displayName =
                          manager.manager_name && manager.company_name
                            ? `${manager.manager_name} (${manager.company_name})`
                            : manager.first_name && manager.last_name
                            ? `${manager.first_name} ${manager.last_name}`
                            : manager.email;

                        return (
                          <div key={manager.user_id} className="flex items-center space-x-2 py-2">
                            <Checkbox
                              id={`manager-${manager.user_id}`}
                              checked={selectedManagers.includes(manager.user_id)}
                              onCheckedChange={(checked) => {
                                setSelectedManagers((prev) =>
                                  checked
                                    ? [...prev, manager.user_id]
                                    : prev.filter((id) => id !== manager.user_id)
                                );
                              }}
                            />
                            <Label
                              htmlFor={`manager-${manager.user_id}`}
                              className="flex-1 cursor-pointer text-sm"
                            >
                              {displayName}
                            </Label>
                          </div>
                        );
                      })}
                    </ScrollArea>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="can_edit_profile"
                          checked={canEditProfile}
                          onChange={(e) => setCanEditProfile(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="can_edit_profile" className="cursor-pointer">
                          Can Edit Profile
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="can_edit_funds"
                          checked={canEditFunds}
                          onChange={(e) => setCanEditFunds(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="can_edit_funds" className="cursor-pointer">
                          Can Edit Associated Funds
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="can_manage_team"
                          checked={canManageTeam}
                          onChange={(e) => setCanManageTeam(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="can_manage_team" className="cursor-pointer">
                          Can Manage Team
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="can_view_analytics"
                          checked={canViewAnalytics}
                          onChange={(e) => setCanViewAnalytics(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="can_view_analytics" className="cursor-pointer">
                          Can View Analytics
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={assignmentNotes}
                      onChange={(e) => setAssignmentNotes(e.target.value)}
                      placeholder="Add any notes about this assignment..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAssignDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAssignManager} disabled={assigning}>
                      {assigning ? 'Assigning...' : 'Assign Manager'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No profile assignments found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Assigned User</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => {
                  const profile = approvedProfiles.find((p) => p.id === assignment.profile_id);
                  const assignedUser = assignment.profiles;
                  const displayName =
                    assignedUser?.manager_name && assignedUser?.company_name
                      ? `${assignedUser.manager_name} (${assignedUser.company_name})`
                      : assignedUser?.first_name && assignedUser?.last_name
                      ? `${assignedUser.first_name} ${assignedUser.last_name}`
                      : assignedUser?.email;

                  return (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div className="font-medium">{profile?.company_name}</div>
                      </TableCell>
                      <TableCell>{displayName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {assignment.permissions.can_edit_profile && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Edit Profile
                            </span>
                          )}
                          {assignment.permissions.can_edit_funds && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Edit Funds
                            </span>
                          )}
                          {assignment.permissions.can_view_analytics && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              Analytics
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleRemoveAssignment(
                              assignment.id,
                              displayName || 'User',
                              profile?.company_name || 'Profile'
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};