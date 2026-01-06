import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { supabase } from '@/integrations/supabase/client';
import { TeamMemberAvatar } from '@/components/shared/TeamMemberAvatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  slug: string;
  photo_url: string | null;
  profile_id: string;
  company_name?: string;
}

const TeamDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Fetch all team members
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-directory-members'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_public_team_members', {
        limit_input: 200,
      });

      if (error) {
        console.error('Error fetching team members:', error);
        return [];
      }

      return (data || []).map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        slug: member.slug,
        photo_url: member.photo_url,
        profile_id: member.profile_id,
        company_name: member.company_name || undefined,
      })) as TeamMember[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Extract unique companies and roles for filters
  const { companies, roles } = useMemo(() => {
    if (!teamMembers) return { companies: [], roles: [] };

    const uniqueCompanies = [...new Set(teamMembers.map(m => m.company_name).filter(Boolean))] as string[];
    const uniqueRoles = [...new Set(teamMembers.map(m => m.role).filter(Boolean))];

    return {
      companies: uniqueCompanies.sort(),
      roles: uniqueRoles.sort(),
    };
  }, [teamMembers]);

  // Filter team members
  const filteredMembers = useMemo(() => {
    if (!teamMembers) return [];

    return teamMembers.filter(member => {
      // Search filter
      const matchesSearch = !searchQuery.trim() || 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.company_name?.toLowerCase().includes(searchQuery.toLowerCase());

      // Company filter
      const matchesCompany = companyFilter === 'all' || member.company_name === companyFilter;

      // Role filter
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;

      return matchesSearch && matchesCompany && matchesRole;
    });
  }, [teamMembers, searchQuery, companyFilter, roleFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setCompanyFilter('all');
    setRoleFilter('all');
  };

  const hasActiveFilters = searchQuery || companyFilter !== 'all' || roleFilter !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="team-directory" />
      
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Fund Professionals Directory
              </h1>
              <p className="text-lg text-muted-foreground">
                Meet the investment professionals behind Portugal's Golden Visa funds. 
                Search by name, company, or role to find the right expert.
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Company Filter */}
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="shrink-0">
                  Clear filters
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-3 text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {teamMembers?.length || 0} professionals
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-muted mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No professionals found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredMembers.map((member) => (
                <Link
                  key={member.id}
                  to={`/team/${member.slug}`}
                  className="block bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-200 group"
                >
                  {/* Photo */}
                  <div className="flex justify-start mb-4">
                    <TeamMemberAvatar
                      photoUrl={member.photo_url}
                      name={member.name}
                      size="lg"
                      className="ring-2 ring-border group-hover:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                  
                  {/* Name */}
                  <h3 className="font-semibold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  
                  {/* Role */}
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                    {member.role}
                  </p>
                  
                  {/* Company */}
                  {member.company_name && (
                    <p className="text-sm text-primary mt-3 line-clamp-1">
                      {member.company_name}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeamDirectory;
