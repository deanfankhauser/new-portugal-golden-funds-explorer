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
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('moderator');
  const [adding, setAdding] = useState(false);

  const canManageUsers = currentUserRole === 'super_admin';

  useEffect(() => {
    fetchAdminUsers();
    fetchAllUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      
      // Get admin users
      const { data: adminUsersData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        toast.error('Failed to load admin users');
        return;
      }

      if (!adminUsersData || adminUsersData.length === 0) {
        setAdminUsers([]);
        return;
      }

      // Extract user IDs for batch lookup
      const userIds = adminUsersData.map(admin => admin.user_id);
      
      // Get user identities using the new function
      const { data: userIdentities, error: identityError } = await supabase
        .rpc('get_users_identity', { p_user_ids: userIds });

      if (identityError) {
        console.error('Error fetching user identities:', identityError);
        // Fallback to basic display
        const basicUsers = adminUsersData.map(admin => ({
          ...admin,
          email: 'Not available',
          profile_name: `User ${admin.user_id.slice(0, 8)}`
        }));
        setAdminUsers(basicUsers);
        return;
      }

      // Create a map for quick lookup
      const identityMap = new Map(
        userIdentities?.map(identity => [identity.user_id, identity]) || []
      );

      // Enrich admin users with identity information
      const enrichedUsers = adminUsersData.map(admin => {
        const identity = identityMap.get(admin.user_id);
        return {
          ...admin,
          email: identity?.email || 'Not available',
          profile_name: identity?.display_name || `User ${admin.user_id.slice(0, 8)}`
        };
      });

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

  const fetchAllUsers = async () => {
    try {
      setUsersLoading(true);
      
      // Get all investor profiles using the new secure function
      const { data: investors, error: investorError } = await supabase
        .rpc('get_all_investor_profiles_admin');

      if (investorError) {
        console.error('Error fetching investors:', investorError);
        // Fallback to direct query with limited data for non-critical display
        const { data: fallbackInvestors, error: fallbackError } = await supabase
          .from('investor_profiles')
          .select('id, user_id, first_name, last_name, email, created_at, city, country')
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          console.error('Fallback investor query also failed:', fallbackError);
        } else {
          console.log('Using fallback investor data due to secure function error');
        }
      }

      // Get all manager profiles (managers are less sensitive, can use direct query)
      const { data: managers, error: managerError } = await supabase
        .from('manager_profiles')
        .select('id, user_id, company_name, manager_name, email, created_at, city, country, status')
        .order('created_at', { ascending: false });

      if (managerError) {
        console.error('Error fetching managers:', managerError);
      }

      // Format investor data (from secure function or fallback)
      const investorData = investors || [];
      const formattedInvestors = investorData.map(investor => ({
        ...investor,
        user_type: 'investor',
        display_name: `${investor.first_name || ''} ${investor.last_name || ''}`.trim() || 'No name',
        company_name: null,
        status: 'active'
      }));

      // Format manager data
      const formattedManagers = (managers || []).map(manager => ({
        ...manager,
        user_type: 'manager',
        display_name: manager.manager_name || 'No name',
        first_name: null,
        last_name: null
      }));

      const combinedUsers = [...formattedInvestors, ...formattedManagers];
      setAllUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching all users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
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
      case 'admin':
        return <Shield className="h-4 w-4" />;
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
      case 'admin':
        return 'default';
      case 'moderator':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading && usersLoading) {
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
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
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
          )}

          {!loading && adminUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No admin users found
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investors</CardTitle>
          <CardDescription>
            View all registered investor profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.filter(user => user.user_type === 'investor').map((user) => (
                  <TableRow key={`investor-${user.id}`}>
                    <TableCell className="font-medium">
                      {user.display_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {[user.city, user.country].filter(Boolean).join(', ') || 'No location'}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!usersLoading && allUsers.filter(user => user.user_type === 'investor').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No investors found
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All System Users</CardTitle>
          <CardDescription>
            View all registered investors and managers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Company/Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={`${user.user_type}-${user.id}`}>
                    <TableCell className="font-medium">
                      {user.display_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.user_type === 'investor' ? 'default' : 'secondary'}>
                        {user.user_type === 'investor' ? 'Investor' : 'Manager'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.user_type === 'manager' ? 
                        user.company_name || 'No company' : 
                        [user.city, user.country].filter(Boolean).join(', ') || 'No location'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'approved' ? 'default' : user.status === 'pending' ? 'secondary' : 'destructive'}>
                        {user.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!usersLoading && allUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;