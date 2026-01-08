import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Edit3, ExternalLink, Building2, Plus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { managerToSlug } from '@/lib/utils';

interface ProfileData {
  id: string;
  user_id: string;
  company_name?: string;
  manager_name?: string;
  logo_url?: string;
  city?: string;
  country?: string;
  website?: string;
  founded_year?: number;
}

interface ManagerItem {
  name: string;
  profile?: ProfileData;
  fundsCount: number;
}

export const EditCompanyProfilesManagement: React.FC = () => {
  const [managers, setManagers] = useState<ManagerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchManagersAndProfiles();
  }, []);

  const fetchManagersAndProfiles = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles with company_name
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, company_name, manager_name, logo_url, city, country, website, founded_year')
        .not('company_name', 'is', null);

      if (profilesError) throw profilesError;

      // Fetch all unique manager_name from funds
      const { data: funds, error: fundsError } = await supabase
        .from('funds')
        .select('manager_name');

      if (fundsError) throw fundsError;

      // Count funds per manager
      const managerFundsCount = new Map<string, number>();
      funds?.forEach(fund => {
        if (fund.manager_name) {
          const normalized = fund.manager_name.toLowerCase();
          managerFundsCount.set(normalized, (managerFundsCount.get(normalized) || 0) + 1);
        }
      });

      // Get unique manager names
      const uniqueManagerNames = new Set<string>();
      funds?.forEach(fund => {
        if (fund.manager_name) {
          uniqueManagerNames.add(fund.manager_name);
        }
      });

      // Build merged list
      const mergedManagers: ManagerItem[] = [];
      const processedProfiles = new Set<string>();

      // First, add all managers from funds with their profile if exists
      uniqueManagerNames.forEach(managerName => {
        const normalizedName = managerName.toLowerCase()
          .replace(/,?\s*scr,?\s*s\.?a\.?/gi, '')
          .replace(/,?\s*s\.?a\.?/gi, '')
          .trim();
        
        // Find matching profile
        const matchingProfile = profiles?.find(p => {
          const profileCompany = (p.company_name || '').toLowerCase()
            .replace(/,?\s*scr,?\s*s\.?a\.?/gi, '')
            .replace(/,?\s*s\.?a\.?/gi, '')
            .trim();
          const profileManager = (p.manager_name || '').toLowerCase()
            .replace(/,?\s*scr,?\s*s\.?a\.?/gi, '')
            .replace(/,?\s*s\.?a\.?/gi, '')
            .trim();
          return profileCompany === normalizedName || profileManager === normalizedName;
        });

        if (matchingProfile) {
          processedProfiles.add(matchingProfile.id);
        }

        mergedManagers.push({
          name: managerName,
          profile: matchingProfile || undefined,
          fundsCount: managerFundsCount.get(managerName.toLowerCase()) || 0,
        });
      });

      // Add any profiles that weren't matched to funds
      profiles?.forEach(profile => {
        if (!processedProfiles.has(profile.id) && profile.company_name) {
          mergedManagers.push({
            name: profile.company_name,
            profile,
            fundsCount: 0,
          });
        }
      });

      // Sort by name
      mergedManagers.sort((a, b) => a.name.localeCompare(b.name));
      
      setManagers(mergedManagers);
    } catch (error: any) {
      console.error('Error fetching managers and profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load company profiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.profile?.manager_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const profilesCount = filteredManagers.filter(m => m.profile).length;
  const missingCount = filteredManagers.filter(m => !m.profile).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Company Profiles</h1>
          <p className="text-muted-foreground mt-2">
            Manage all fund manager profiles. Create profiles for managers without one.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {profilesCount} with Profile
          </Badge>
          {missingCount > 0 && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
              {missingCount} Missing
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search managers by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Link to="/admin/edit-profiles/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Profile
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredManagers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No managers found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredManagers.map((manager, index) => (
                  <Card 
                    key={manager.profile?.id || `manager-${index}`} 
                    className={`hover:border-primary/40 transition-colors ${!manager.profile ? 'border-amber-500/40 bg-amber-500/5' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {manager.profile?.logo_url ? (
                          <img
                            src={manager.profile.logo_url}
                            alt={`${manager.name} logo`}
                            className="h-14 w-14 rounded-lg object-cover border border-border/40"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg truncate">
                              {manager.name}
                            </h3>
                            {!manager.profile && (
                              <Badge variant="outline" className="text-amber-600 border-amber-500/50 text-xs">
                                No Profile
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{manager.fundsCount} fund{manager.fundsCount !== 1 ? 's' : ''}</span>
                            {manager.profile && (manager.profile.city || manager.profile.country) && (
                              <>
                                <span>•</span>
                                <span className="truncate">
                                  {[manager.profile.city, manager.profile.country].filter(Boolean).join(', ')}
                                </span>
                              </>
                            )}
                            {manager.profile?.founded_year && (
                              <>
                                <span>•</span>
                                <span>Est. {manager.profile.founded_year}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link to={`/manager/${managerToSlug(manager.name)}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          {manager.profile ? (
                            <>
                              <Link to={`/dashboard/company/${manager.profile.id}/team-members`}>
                                <Button size="sm" variant="outline">
                                  <Users className="h-4 w-4 mr-2" />
                                  Edit Team
                                </Button>
                              </Link>
                              <Link to={`/dashboard/company/${manager.profile.id}`}>
                                <Button size="sm">
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit Profile
                                </Button>
                              </Link>
                            </>
                          ) : (
                            <Link to={`/admin/edit-profiles/new?company_name=${encodeURIComponent(manager.name)}`}>
                              <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-600 hover:bg-amber-500/10">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Profile
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
