import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Edit3, ExternalLink, Building2, Plus } from 'lucide-react';
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

export const EditCompanyProfilesManagement: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, company_name, manager_name, logo_url, city, country, website, founded_year')
        .not('company_name', 'is', null)
        .order('company_name');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load company profiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.manager_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Company Profiles</h1>
          <p className="text-muted-foreground mt-2">
            Direct access to edit all company profile pages as super admin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/admin/edit-profiles/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Company Profile
          </Button>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {filteredProfiles.length} Profile{filteredProfiles.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No company profiles found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProfiles.map((profile) => (
                  <Card key={profile.id} className="hover:border-primary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {profile.logo_url ? (
                          <img
                            src={profile.logo_url}
                            alt={`${profile.company_name} logo`}
                            className="h-14 w-14 rounded-lg object-cover border border-border/40"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate mb-1">
                            {profile.company_name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {profile.manager_name && (
                              <span className="truncate">{profile.manager_name}</span>
                            )}
                            {(profile.city || profile.country) && (
                              <>
                                <span>•</span>
                                <span className="truncate">
                                  {[profile.city, profile.country].filter(Boolean).join(', ')}
                                </span>
                              </>
                            )}
                            {profile.founded_year && (
                              <>
                                <span>•</span>
                                <span>Est. {profile.founded_year}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {profile.manager_name && (
                            <Link to={`/manager/${managerToSlug(profile.manager_name)}`} target="_blank">
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Link to={`/dashboard/company/${profile.id}`}>
                            <Button size="sm">
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          </Link>
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
