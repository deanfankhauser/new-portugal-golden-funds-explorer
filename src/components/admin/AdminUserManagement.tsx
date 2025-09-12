import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, UserPlus, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'moderator';
  created_at: string;
  granted_at: string;
  granted_by: string;
  user_email?: string;
}

export const AdminUserManagement: React.FC = () => {
  const { user } = useEnhancedAuth();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'moderator' | 'super_admin'>('moderator');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchAdminUsers();
    checkUserRole();
  }, [user]);

  const checkUserRole = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase.rpc('get_user_admin_role', { check_user_id: user.id });
      setUserRole(data);
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      
      // Get admin users with email information
      const { data: adminData, error } = await supabase
        .from('admin_users' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin users:', error);
        return;
      }

      // Get user emails from auth.users (this requires service role or proper RLS)
      const adminUsersWithEmails = await Promise.all(
        (adminData || []).map(async (admin: any) => {
          try {
            // Try to get user info from profiles tables
            const { data: managerProfile, error: managerError } = await supabase
              .from('manager_profiles' as any)
              .select('email')
              .eq('user_id', admin.user_id)
              .maybeSingle();

            const { data: investorProfile, error: investorError } = await supabase
              .from('investor_profiles' as any)
              .select('email')
              .eq('user_id', admin.user_id)
              .maybeSingle();

            // Only access email if data exists and no error
            const managerEmail = (!managerError && managerProfile) ? (managerProfile as any).email : null;
            const investorEmail = (!investorError && investorProfile) ? (investorProfile as any).email : null;

            return {
              ...admin,
              user_email: managerEmail || investorEmail || 'Unknown'
            };
          } catch (error) {
            console.error('Error fetching user email:', error);
            return {
              ...admin,
              user_email: 'Unknown'
            };
          }
        })
      );

      setAdminUsers(adminUsersWithEmails);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAdminUser = async () => {
    if (!newUserEmail.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setAdding(true);
    try {
      // First, find the user by email in profiles
      let targetUserId = null;
      
      try {
        const { data: managerProfile, error: managerError } = await supabase
          .from('manager_profiles' as any)
          .select('user_id')
          .eq('email', newUserEmail.trim())
          .maybeSingle();

        const { data: investorProfile, error: investorError } = await supabase
          .from('investor_profiles' as any)
          .select('user_id')
          .eq('email', newUserEmail.trim())
          .maybeSingle();

        // Only access user_id if data exists and no error
        const managerUserId = (!managerError && managerProfile) ? (managerProfile as any).user_id : null;
        const investorUserId = (!investorError && investorProfile) ? (investorProfile as any).user_id : null;
        
        targetUserId = managerUserId || investorUserId;
      } catch (profileError) {
        console.error('Error fetching user profiles:', profileError);
      }

      if (!targetUserId) {
        toast.error('User not found. User must be registered first.');
        return;
      }

      // Add admin role
      const { error } = await supabase
        .from('admin_users' as any)
        .insert([{
          user_id: targetUserId,
          role: newUserRole,
          granted_by: user?.id
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('User is already an admin');
        } else {
          toast.error(`Error adding admin user: ${error.message}`);
        }
        return;
      }

      // Log the activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'grant_admin_access',
        p_target_type: 'user',
        p_target_id: targetUserId,
        p_details: { role: newUserRole, email: newUserEmail }
      });

      toast.success(`Successfully granted ${newUserRole} access to ${newUserEmail}`);
      setNewUserEmail('');
      setNewUserRole('moderator');
      fetchAdminUsers();
    } catch (error) {
      console.error('Error adding admin user:', error);
      toast.error('Failed to add admin user');
    } finally {
      setAdding(false);
    }
  };

  const removeAdminUser = async (adminUserId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove admin access for ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users' as any)
        .delete()
        .eq('id', adminUserId);

      if (error) {
        toast.error(`Error removing admin user: ${error.message}`);
        return;
      }

      // Log the activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'revoke_admin_access',
        p_target_type: 'user',
        p_target_id: adminUserId,
        p_details: { email }
      });

      toast.success(`Successfully removed admin access for ${email}`);
      fetchAdminUsers();
    } catch (error) {
      console.error('Error removing admin user:', error);
      toast.error('Failed to remove admin user');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'default';
      case 'moderator': return 'secondary';
      default: return 'outline';
    }
  };

  const canManageUsers = userRole === 'super_admin';

  if (loading) {
    return <div className="text-center py-4">Loading admin users...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin User Management
          </CardTitle>
          <CardDescription>
            Manage who has access to the admin panel. Only super admins can add or remove admin users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!canManageUsers && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You need super admin privileges to manage admin users. Contact a super admin to modify access.
              </AlertDescription>
            </Alert>
          )}

          {canManageUsers && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add New Admin User
              </h3>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter user email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="flex-1"
                />
                <Select value={newUserRole} onValueChange={(value: 'admin' | 'moderator' | 'super_admin') => setNewUserRole(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={addAdminUser} 
                  disabled={adding || !newUserEmail.trim()}
                >
                  {adding ? 'Adding...' : 'Add User'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                User must be registered (have a profile) before they can be granted admin access.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Admin Users</h3>
            {adminUsers.length === 0 ? (
              <p className="text-muted-foreground">No admin users found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Granted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((adminUser) => (
                    <TableRow key={adminUser.id}>
                      <TableCell>{adminUser.user_email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(adminUser.role)}>
                          {adminUser.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(adminUser.granted_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {canManageUsers && adminUser.user_id !== user?.id && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeAdminUser(adminUser.id, adminUser.user_email || 'Unknown')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        {adminUser.user_id === user?.id && (
                          <span className="text-sm text-muted-foreground">You</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Badge variant="destructive" className="mb-2">Super Admin</Badge>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Full system access</li>
                <li>• Can manage admin users</li>
                <li>• Can approve/reject fund suggestions</li>
                <li>• Can view all activity logs</li>
              </ul>
            </div>
            <div>
              <Badge variant="default" className="mb-2">Admin</Badge>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Can approve/reject fund suggestions</li>
                <li>• Can view activity logs</li>
                <li>• Cannot manage admin users</li>
              </ul>
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Moderator</Badge>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Can view fund suggestions</li>
                <li>• Can view activity logs</li>
                <li>• Cannot approve/reject suggestions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};