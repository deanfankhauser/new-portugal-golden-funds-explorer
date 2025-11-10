import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
import { Plus, Trash2, Search, Building2, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { Profile } from '@/types/profile';

interface FundManagerAssignment {
  id: string;
  fund_id: string;
  user_id: string;
  status: string;
  assigned_at: string;
  permissions: {
    can_edit: boolean;
    can_publish: boolean;
  };
  notes?: string;
  profiles?: Profile;
}

export const FundManagerAssignment: React.FC = () => {
  const { toast } = useToast();
  const { funds } = useRealTimeFunds();
  const [assignments, setAssignments] = useState<FundManagerAssignment[]>([]);
  const [managers, setManagers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  // Assignment form state
  const [selectedFund, setSelectedFund] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [canEdit, setCanEdit] = useState(true);
  const [canPublish, setCanPublish] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [assignmentsRes, managersRes] = await Promise.allSettled([
      supabase
        .from('fund_managers' as any)
        .select(`
          *,
          profiles (*)
        `)
        .order('assigned_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('*')
        .order('email', { ascending: true }),
    ]);

    if (assignmentsRes.status === 'fulfilled') {
      const { data, error } = assignmentsRes.value as any;
      if (!error) {
        setAssignments((data as any) || []);
        console.log('Assignments loaded:', (data || []).length);
      } else {
        console.error('Assignments fetch error:', error);
        toast({
          title: 'Assignments unavailable',
          description: 'Assignments could not load, but you can still assign users.',
        });
      }
    } else {
      console.error('Assignments request failed:', assignmentsRes.reason);
      toast({
        title: 'Assignments unavailable',
        description: 'Assignments could not load, but you can still assign users.',
      });
    }

    if (managersRes.status === 'fulfilled') {
      const { data, error } = managersRes.value as any;
      if (!error) {
        setManagers(data || []);
        console.log('Profiles loaded:', (data || []).length);
      } else {
        console.error('Profiles fetch error:', error);
        toast({
          title: 'Failed to load users',
          description: 'User list could not be loaded.',
          variant: 'destructive',
        });
      }
    } else {
      console.error('Profiles request failed:', managersRes.reason);
      toast({
        title: 'Failed to load users',
        description: 'User list could not be loaded.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  const handleAssignManager = async () => {
    if (!selectedFund || !selectedManager) {
      toast({
        title: 'Missing Information',
        description: 'Please select both a fund and a manager',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('fund_managers' as any)
        .insert({
          fund_id: selectedFund,
          user_id: selectedManager,
          status: 'active',
          permissions: {
            can_edit: canEdit,
            can_publish: canPublish,
          },
          notes: assignmentNotes || null,
        });

      if (error) throw error;

      toast({
        title: 'Manager Assigned',
        description: 'Fund manager has been successfully assigned',
      });

      // Reset form and close dialog
      setSelectedFund('');
      setSelectedManager('');
      setAssignmentNotes('');
      setCanEdit(true);
      setCanPublish(false);
      setIsAssignDialogOpen(false);

      // Refresh data
      fetchData();
    } catch (error: any) {
      console.error('Error assigning manager:', error);
      toast({
        title: 'Assignment Failed',
        description: error.message || 'Failed to assign manager',
        variant: 'destructive',
      });
    }
  };

  const handleRevokeAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to revoke this assignment?')) return;

    try {
      const { error } = await supabase
        .from('fund_managers' as any)
        .update({ status: 'revoked' })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: 'Assignment Revoked',
        description: 'Manager assignment has been revoked',
      });

      fetchData();
    } catch (error) {
      console.error('Error revoking assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke assignment',
        variant: 'destructive',
      });
    }
  };

  const handleSuspendAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('fund_managers' as any)
        .update({ status: 'suspended' })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: 'Assignment Suspended',
        description: 'Manager assignment has been suspended',
      });

      fetchData();
    } catch (error) {
      console.error('Error suspending assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to suspend assignment',
        variant: 'destructive',
      });
    }
  };

  const handleReactivateAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('fund_managers' as any)
        .update({ status: 'active' })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: 'Assignment Reactivated',
        description: 'Manager assignment has been reactivated',
      });

      fetchData();
    } catch (error) {
      console.error('Error reactivating assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to reactivate assignment',
        variant: 'destructive',
      });
    }
  };

  // Filter assignments based on search
  const filteredAssignments = assignments.filter(assignment => {
    const fund = funds.find(f => f.id === assignment.fund_id);
    const managerName = assignment.profiles?.manager_name || '';
    const companyName = assignment.profiles?.company_name || '';
    const firstName = assignment.profiles?.first_name || '';
    const lastName = assignment.profiles?.last_name || '';
    const email = assignment.profiles?.email || '';
    const fundName = fund?.name || '';
    
    const query = searchQuery.toLowerCase();
    return (
      managerName.toLowerCase().includes(query) ||
      companyName.toLowerCase().includes(query) ||
      firstName.toLowerCase().includes(query) ||
      lastName.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      fundName.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'suspended').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fund Manager Assignments</CardTitle>
              <CardDescription>
                Assign and manage fund managers with editing permissions
              </CardDescription>
            </div>
            <Dialog modal={false} open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Manager
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Fund Manager</DialogTitle>
                  <DialogDescription>
                    Assign a manager to manage and edit a fund
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Fund</Label>
                    <Select value={selectedFund} onValueChange={setSelectedFund}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fund" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        {funds.map(fund => (
                          <SelectItem key={fund.id} value={fund.id}>
                            {fund.name}
                          </SelectItem>
                        ))}
                      </SelectContent
                      >
                    </Select>
                  </div>

                  <div>
                    <Label>Manager</Label>
                    <Select value={selectedManager} onValueChange={setSelectedManager}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manager" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        {managers.map(manager => (
                          <SelectItem key={manager.user_id} value={manager.user_id}>
                            {manager.manager_name && manager.company_name
                              ? `${manager.manager_name} (${manager.company_name})`
                              : manager.first_name && manager.last_name
                              ? `${manager.first_name} ${manager.last_name} (${manager.email})`
                              : manager.email
                            }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="can_edit"
                        checked={canEdit}
                        onChange={(e) => setCanEdit(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="can_edit" className="cursor-pointer">
                        Can Edit Fund
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="can_publish"
                        checked={canPublish}
                        onChange={(e) => setCanPublish(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="can_publish" className="cursor-pointer">
                        Can Publish Changes
                      </Label>
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

                  <Button onClick={handleAssignManager} className="w-full">
                    Assign Manager
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by fund or manager name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Assignments Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No assignments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssignments.map((assignment) => {
                  const fund = funds.find(f => f.id === assignment.fund_id);
                  return (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {fund?.name || assignment.fund_id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {assignment.profiles?.manager_name && assignment.profiles?.company_name
                              ? assignment.profiles.manager_name
                              : assignment.profiles?.first_name && assignment.profiles?.last_name
                              ? `${assignment.profiles.first_name} ${assignment.profiles.last_name}`
                              : assignment.profiles?.email || 'Unknown User'
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {assignment.profiles?.manager_name && assignment.profiles?.company_name
                              ? assignment.profiles.company_name
                              : assignment.profiles?.email
                            }
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            assignment.status === 'active'
                              ? 'default'
                              : assignment.status === 'suspended'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {assignment.permissions?.can_edit && (
                            <Badge variant="outline" className="text-xs">Edit</Badge>
                          )}
                          {assignment.permissions?.can_publish && (
                            <Badge variant="outline" className="text-xs">Publish</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(assignment.assigned_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {assignment.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspendAssignment(assignment.id)}
                            >
                              Suspend
                            </Button>
                          )}
                          {assignment.status === 'suspended' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReactivateAssignment(assignment.id)}
                            >
                              Reactivate
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevokeAssignment(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
