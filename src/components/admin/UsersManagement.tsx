import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, UserPlus, Crown, Shield, User } from 'lucide-react';

interface AdminUser {
  id: string;
  user_id: string;
  role: string; // Allow any string to handle enum variations
  granted_by: string;
  granted_at: string;
  email?: string;
  profile_name?: string;
}

interface UsersManagementProps {
  currentUserRole?: string;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ currentUserRole }) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('moderator');
  const [adding, setAdding] = useState(false);

  const canManageUsers = currentUserRole === 'super_admin';

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      
      // Get admin users with their profile information
      const { data: adminUsersData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        toast.error('Failed to load admin users');
        return;
      }

      // Fetch profile information for each admin user
      const enrichedUsers = await Promise.all(
        adminUsersData.map(async (admin) => {
          // Try to get manager profile first
          const { data: managerProfile } = await supabase
            .from('manager_profiles')
            .select('email, manager_name, company_name')
            .eq('user_id', admin.user_id)
            .single();

          if (managerProfile) {
            return {
              ...admin,
              email: managerProfile.email,
              profile_name: `${managerProfile.manager_name} (${managerProfile.company_name})`
            };
          }

          // Try investor profile
          const { data: investorProfile } = await supabase
            .from('investor_profiles')
            .select('email, first_name, last_name')
            .eq('user_id', admin.user_id)
            .single();

          if (investorProfile) {
            return {
              ...admin,
              email: investorProfile.email,
              profile_name: `${investorProfile.first_name} ${investorProfile.last_name}`
            };
          }

          return {
            ...admin,
            email: 'Unknown',
            profile_name: 'Unknown User'
          };
        })
      );

      setAdminUsers(enrichedUsers);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const addAdminUser = async () => {
    if (!newUserEmail || !canManageUsers) return;

    try {
      setAdding(true);

      // Find user by email
      const { data: foundUserId, error: findError } = await supabase
        .rpc('find_user_by_email', { user_email: newUserEmail });

      if (findError) {
        console.error('Error finding user:', findError);
        toast.error('Failed to find user with that email');
        return;
      }

      if (!foundUserId) {
        toast.error('No user found with that email address');
        return;
      }

      // Check if user is already an admin
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', foundUserId)
        .single();

      if (existingAdmin) {
        toast.error('User is already an admin');
        return;
      }

      // Add user as admin
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: foundUserId,
          role: newUserRole as any, // Type assertion for enum
          granted_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (insertError) {
        console.error('Error adding admin user:', insertError);
        toast.error('Failed to add admin user');
        return;
      }

      // Log the activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'grant_admin_access',
        p_target_type: 'user',
        p_target_id: foundUserId,
        p_details: { role: newUserRole, email: newUserEmail }
      });

      toast.success(`Successfully granted ${newUserRole} access to ${newUserEmail}`);
      setNewUserEmail('');
      setNewUserRole('moderator');
      await fetchAdminUsers();
    } catch (error) {
      console.error('Error adding admin user:', error);
      toast.error('Failed to add admin user');
    } finally {
      setAdding(false);
    }
  };

  const removeAdminUser = async (adminUser: AdminUser) => {
    if (!canManageUsers) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminUser.id);

      if (error) {
        console.error('Error removing admin user:', error);
        toast.error('Failed to remove admin access');
        return;
      }

      // Log the activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'revoke_admin_access',
        p_target_type: 'user',
        p_target_id: adminUser.user_id,
        p_details: { 
          removed_role: adminUser.role, 
          email: adminUser.email,
          profile_name: adminUser.profile_name 
        }
      });

      toast.success(`Successfully removed admin access from ${adminUser.profile_name}`);
      await fetchAdminUsers();
    } catch (error) {
      console.error('Error removing admin user:', error);
      toast.error('Failed to remove admin access');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-4 w-4" />;
      case 'moderator':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'moderator':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {canManageUsers && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Admin User
            </CardTitle>
            <CardDescription>
              Grant admin access to users by email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={addAdminUser} 
                  disabled={!newUserEmail || adding}
                  className="w-full"
                >
                  {adding ? 'Adding...' : 'Add Admin'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            Manage admin access and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Granted</TableHead>
                {canManageUsers && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((adminUser) => (
                <TableRow key={adminUser.id}>
                  <TableCell className="font-medium">
                    {adminUser.profile_name}
                  </TableCell>
                  <TableCell>{adminUser.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getRoleBadgeVariant(adminUser.role)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {getRoleIcon(adminUser.role)}
                      {adminUser.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(adminUser.granted_at).toLocaleDateString()}
                  </TableCell>
                  {canManageUsers && (
                    <TableCell>
                      {adminUser.role !== 'super_admin' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove admin access from {adminUser.profile_name}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => removeAdminUser(adminUser)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove Access
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {adminUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No admin users found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;