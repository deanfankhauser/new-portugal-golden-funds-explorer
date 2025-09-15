import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Filter, Search, Clock, User, Building, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SuggestionDetailModal } from './SuggestionDetailModal';

interface EnhancedSuggestionsTableProps {
  onDataChange?: () => void;
}

export const EnhancedSuggestionsTable: React.FC<EnhancedSuggestionsTableProps> = ({ onDataChange }) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({});
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitterTypeFilter, setSubmitterTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [suggestions, statusFilter, searchTerm, submitterTypeFilter]);

  const fetchSuggestions = async () => {
    try {
      console.log('Fetching suggestions...');
      
      // First fetch basic suggestions data
      const { data: basicData, error: basicError } = await supabase
        .from('fund_edit_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (basicError) {
        console.error('Basic query error:', basicError);
        throw basicError;
      }

      console.log('Basic suggestions data:', basicData);
      setSuggestions(basicData || []);

      // Fetch user profiles for all unique user_ids
      if (basicData && basicData.length > 0) {
        const uniqueUserIds = [...new Set(basicData.map(s => s.user_id))];
        await fetchUserProfiles(uniqueUserIds);
      }
      
      // Notify parent component of data change
      onDataChange?.();
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfiles = async (userIds: string[]) => {
    try {
      const profiles: Record<string, any> = {};

      // Fetch manager profiles
      const { data: managerProfiles, error: managerError } = await supabase
        .from('manager_profiles')
        .select('user_id, company_name, manager_name, email')
        .in('user_id', userIds);

      if (!managerError && managerProfiles) {
        managerProfiles.forEach(profile => {
          profiles[profile.user_id] = {
            ...profile,
            type: 'manager'
          };
        });
      }

      // Fetch investor profiles for remaining user_ids
      const remainingUserIds = userIds.filter(id => !profiles[id]);
      if (remainingUserIds.length > 0) {
        const { data: investorProfiles, error: investorError } = await supabase
          .from('investor_profiles')
          .select('user_id, first_name, last_name, email')
          .in('user_id', remainingUserIds);

        if (!investorError && investorProfiles) {
          investorProfiles.forEach(profile => {
            profiles[profile.user_id] = {
              ...profile,
              type: 'investor'
            };
          });
        }
      }

      console.log('Fetched user profiles:', profiles);
      setUserProfiles(profiles);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  };

  const applyFilters = () => {
    console.log('Applying filters to suggestions:', suggestions);
    console.log('Current filters:', { statusFilter, searchTerm, submitterTypeFilter });
    
    let filtered = [...suggestions];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
      console.log('After status filter:', filtered);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.fund_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After search filter:', filtered);
    }

    // Submitter type filter
    if (submitterTypeFilter !== 'all') {
      filtered = filtered.filter(s => {
        const profile = userProfiles[s.user_id];
        if (submitterTypeFilter === 'investor') {
          return profile?.type === 'investor';
        } else if (submitterTypeFilter === 'manager') {
          return profile?.type === 'manager';
        }
        return true;
      });
      console.log('After submitter type filter:', filtered);
    }

    console.log('Final filtered suggestions:', filtered);
    setFilteredSuggestions(filtered);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const icons = {
      pending: <Clock className="h-3 w-3 mr-1" />,
      approved: <CheckCircle className="h-3 w-3 mr-1" />,
      rejected: <XCircle className="h-3 w-3 mr-1" />
    };

    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const getSubmitterInfo = (suggestion: any) => {
    const profile = userProfiles[suggestion.user_id];
    
    if (!profile) {
      return {
        name: `User ${suggestion.user_id?.slice(-8) || 'Unknown'}`,
        type: 'User',
        icon: <User className="h-3 w-3" />
      };
    }

    if (profile.type === 'manager') {
      return {
        name: profile.company_name || profile.manager_name || 'Manager',
        type: 'Manager',
        icon: <Building className="h-3 w-3" />
      };
    } else if (profile.type === 'investor') {
      return {
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Investor',
        type: 'Investor',
        icon: <User className="h-3 w-3" />
      };
    }

    return {
      name: `User ${suggestion.user_id?.slice(-8) || 'Unknown'}`,
      type: 'User',
      icon: <User className="h-3 w-3" />
    };
  };

  const handleViewSuggestion = (suggestion: any) => {
    // Enrich suggestion with user profile information
    const profile = userProfiles[suggestion.user_id];
    const enrichedSuggestion = {
      ...suggestion,
      userProfile: profile
    };
    setSelectedSuggestion(enrichedSuggestion);
    setIsModalOpen(true);
  };

  const getChangedFieldsCount = (suggestion: any) => {
    return Object.keys(suggestion.suggested_changes || {}).length;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fund Edit Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Fund Edit Suggestions ({filteredSuggestions.length})
            {suggestions.length > 0 && (
              <Badge variant="outline" className="ml-2">
                Total: {suggestions.length}
              </Badge>
            )}
          </CardTitle>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search by Fund ID or Suggestion ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={submitterTypeFilter} onValueChange={setSubmitterTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Submitter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="investor">Investors</SelectItem>
                <SelectItem value="manager">Managers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Suggestion ID</TableHead>
                <TableHead>Fund ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitter</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuggestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {loading ? 'Loading suggestions...' : 
                     suggestions.length === 0 ? 'No suggestions found in database.' :
                     'No suggestions found matching your filters.'}
                    {suggestions.length > 0 && filteredSuggestions.length === 0 && (
                      <div className="mt-2 text-sm">
                        Total suggestions: {suggestions.length} | Current filters: {JSON.stringify({statusFilter, searchTerm, submitterTypeFilter})}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuggestions.map((suggestion) => {
                  const submitterInfo = getSubmitterInfo(suggestion);
                  
                  return (
                    <TableRow key={suggestion.id}>
                      <TableCell className="font-mono text-sm">
                        {suggestion.id.slice(-8)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {suggestion.fund_id}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(suggestion.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {submitterInfo.icon}
                          <span className="text-sm">{submitterInfo.name}</span>
                          <Badge variant="outline" className="text-xs ml-1">
                            {submitterInfo.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getChangedFieldsCount(suggestion)} fields
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(suggestion.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSuggestion(suggestion)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Review
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

      <SuggestionDetailModal
        suggestion={selectedSuggestion}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={fetchSuggestions}
      />
    </>
  );
};