import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Trash2, Search, Building2, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { Profile } from '@/types/profile';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [canEdit, setCanEdit] = useState(true);
  const [canPublish, setCanPublish] = useState(false);
  const [assigning, setAssigning] = useState(false);

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
      // Prefer secure RPC that bypasses RLS for admins
      supabase.rpc('admin_list_profiles'),
    ]);

    // 1) Load managers first so we can enrich assignments on fallback
    let loadedManagers: Profile[] = [];
    if (managersRes.status === 'fulfilled') {
      const { data, error } = managersRes.value as any;
      if (!error && Array.isArray(data) && (data || []).length > 0) {
        loadedManagers = data || [];
        setManagers(loadedManagers);
        console.log('Profiles loaded via RPC:', loadedManagers.length);
      } else {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .select('*')
          .order('email', { ascending: true });
        if (!fallbackError) {
          loadedManagers = fallbackData || [];
          setManagers(loadedManagers);
          console.log('Profiles loaded via fallback:', loadedManagers.length);
        } else {
          console.error('Profiles fallback fetch error:', fallbackError);
          toast({
            title: 'Failed to load users',
            description: 'User list could not be loaded.',
            variant: 'destructive',
          });
        }
      }
    } else {
      console.error('Profiles request failed:', managersRes.reason);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('profiles')
        .select('*')
        .order('email', { ascending: true });
      if (!fallbackError) {
        loadedManagers = fallbackData || [];
        setManagers(loadedManagers);
        console.log('Profiles loaded via fallback:', loadedManagers.length);
      } else {
        toast({
          title: 'Failed to load users',
          description: 'User list could not be loaded.',
          variant: 'destructive',
        });
      }
    }

    // 2) Load assignments with graceful fallback if relationship embed fails
    if (assignmentsRes.status === 'fulfilled') {
      const { data, error } = assignmentsRes.value as any;
      if (!error) {
        setAssignments((data as any) || []);
        console.log('Assignments loaded:', (data || []).length);
      } else {
        console.error('Assignments fetch error:', error);
        const isRelationshipErr =
          error?.code === 'PGRST200' ||
          /relationship/i.test(error?.message || '') ||
          /relationship/i.test(error?.details || '');
        if (isRelationshipErr) {
          // Fallback: fetch without embed and enrich from loadedManagers
          const { data: bareData, error: bareError } = await supabase
            .from('fund_managers' as any)
            .select('*')
            .order('assigned_at', { ascending: false });
          if (!bareError) {
            const byUser = new Map(loadedManagers.map((m) => [m.user_id, m]));
            const enriched = (bareData || []).map((a: any) => ({
              ...a,
              profiles: byUser.get(a.user_id),
            }));
            setAssignments(enriched);
            toast({
              title: 'Loaded assignments',
              description: 'Assignments loaded without profile join.',
            });
          } else {
            console.error('Assignments bare fetch error:', bareError);
            toast({
              title: 'Assignments unavailable',
              description: 'Assignments could not load, but you can still assign users.',
            });
          }
        } else {
          toast({
            title: 'Assignments unavailable',
            description: 'Assignments could not load, but you can still assign users.',
          });
        }
      }
    } else {
      console.error('Assignments request failed:', assignmentsRes.reason);
      toast({
        title: 'Assignments unavailable',
        description: 'Assignments could not load, but you can still assign users.',
      });
    }

    setLoading(false);
  };

  const handleAssignManager = async () => {
    if (!selectedFund || selectedManagers.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select a fund and at least one manager',
        variant: 'destructive',
      });
      return;
    }

    // Validate UUIDs and deduplicate
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const managerIds = Array.from(new Set(selectedManagers.filter((id) => uuidRe.test(id))));
    if (managerIds.length === 0) {
      toast({
        title: 'No valid managers',
        description: 'Please pick at least one valid user.',
        variant: 'destructive',
      });
      return;
    }

    setAssigning(true);
    try {
      const permissions = { can_edit: canEdit, can_publish: canPublish };

      // Assign as fund manager
      const { data: results, error } = await supabase.rpc('admin_assign_fund_managers', {
        _fund_id: selectedFund,
        _manager_ids: managerIds,
        _permissions: permissions,
        _status: 'active',
        _notes: assignmentNotes || null,
      });

      if (error) throw error as any;

      const insertedCount = (results || []).filter((r: any) => r.inserted).length;
      const skippedCount = (results || []).length - insertedCount;

      // Also assign as company manager
      // Find the fund's manager company
      const selectedFundData = funds.find(f => f.id === selectedFund);
      if (selectedFundData?.managerName) {
        // Find matching company profile
        const { data: companyProfiles } = await supabase.rpc('get_public_manager_profiles');
        
        if (companyProfiles && companyProfiles.length > 0) {
          const matchingProfile = companyProfiles.find((p: any) => 
            p.company_name?.toLowerCase() === selectedFundData.managerName.toLowerCase()
          );

          if (matchingProfile) {
            // Assign to company profile with appropriate permissions
            await supabase.rpc('admin_assign_profile_managers', {
              _profile_id: matchingProfile.id,
              _manager_ids: managerIds,
              _permissions: {
                can_edit_profile: true,
                can_edit_funds: true,
                can_manage_team: false,
                can_view_analytics: true,
              },
              _status: 'active',
              _notes: `Auto-assigned via fund manager assignment for ${selectedFundData.name}`,
            });

            console.log('Also assigned as company manager for:', matchingProfile.company_name);
          }
        }
      }

      toast({
        title: 'Managers Assigned',
        description: `Inserted ${insertedCount} manager(s)${skippedCount > 0 ? `, skipped ${skippedCount} (already assigned)` : ''} and assigned as company managers`,
      });

      // Reset form and close dialog
      setSelectedFund('');
      setSelectedManagers([]);
      setAssignmentNotes('');
      setCanEdit(true);
      setCanPublish(false);
      setIsAssignDialogOpen(false);

      // Refresh data
      fetchData();
    } catch (error: any) {
      console.error('Error assigning manager:', error);
      const parts = [
        error?.message,
        error?.code ? `code: ${error.code}` : '',
        error?.details ? `details: ${error.details}` : '',
        error?.hint ? `hint: ${error.hint}` : '',
      ].filter(Boolean);
      toast({
        title: 'Assignment Failed',
        description: parts.join(' | ') || 'Failed to assign manager',
        variant: 'destructive',
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string, managerName: string, fundName: string) => {
    if (!confirm(`Remove ${managerName} from managing ${fundName}?`)) return;

    try {
      const { error } = await supabase
        .from('fund_managers' as any)
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: 'Manager Removed',
        description: `${managerName} has been removed from ${fundName}`,
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
    newPermissions: { can_edit: boolean; can_publish: boolean }
  ) => {
    try {
      const { error } = await supabase
        .from('fund_managers' as any)
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectContent className="z-[9999] bg-popover">
                        {funds.map(fund => (
                          <SelectItem key={fund.id} value={fund.id}>
                            {fund.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Managers ({selectedManagers.length} selected)</Label>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-2">
                      {managers.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No users found or access denied
                        </div>
                      ) : (
                        managers.map(manager => {
                          const displayName = manager.manager_name && manager.company_name
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
                                  setSelectedManagers(prev =>
                                    checked
                                      ? [...prev, manager.user_id]
                                      : prev.filter(id => id !== manager.user_id)
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
                        })
                      )}
                    </ScrollArea>
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

                  <Button onClick={handleAssignManager} className="w-full" disabled={assigning}>
                    {assigning ? 'Assigning…' : 'Assign Manager'}
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
                <TableHead>Permissions</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No assignments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssignments.map((assignment) => {
                  const fund = funds.find(f => f.id === assignment.fund_id);
                  const managerName = assignment.profiles?.manager_name && assignment.profiles?.company_name
                    ? assignment.profiles.manager_name
                    : assignment.profiles?.first_name && assignment.profiles?.last_name
                    ? `${assignment.profiles.first_name} ${assignment.profiles.last_name}`
                    : assignment.profiles?.email || 'Unknown User';
                  
                  return (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {fund?.name || assignment.fund_id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{managerName}</div>
                          <div className="text-xs text-muted-foreground">
                            {assignment.profiles?.manager_name && assignment.profiles?.company_name
                              ? assignment.profiles.company_name
                              : assignment.profiles?.email
                            }
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={assignment.permissions?.can_edit || false}
                              onCheckedChange={(checked) =>
                                handleUpdatePermissions(assignment.id, {
                                  ...assignment.permissions,
                                  can_edit: checked,
                                })
                              }
                            />
                            <Label className="text-sm cursor-pointer">Edit</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={assignment.permissions?.can_publish || false}
                              onCheckedChange={(checked) =>
                                handleUpdatePermissions(assignment.id, {
                                  ...assignment.permissions,
                                  can_publish: checked,
                                })
                              }
                            />
                            <Label className="text-sm cursor-pointer">Publish</Label>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(assignment.assigned_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveAssignment(assignment.id, managerName, fund?.name || assignment.fund_id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
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
