import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Building2, Settings, LogOut, Home, Mail, ChevronRight, TrendingUp, BarChart3, Megaphone, Users as UsersIcon, Edit, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { toast } from 'sonner';

interface CompanyWithFunds {
  profileId: string;
  companyName: string;
  logo: string | null;
  funds: Array<{ id: string; name: string }>;
}

export default function FundManagerSidebar() {
  const { user } = useEnhancedAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = state === "collapsed";
  const [totalOpenLeads, setTotalOpenLeads] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companies, setCompaniesWithFunds] = useState<CompanyWithFunds[]>([]);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [expandedFunds, setExpandedFunds] = useState<Set<string>>(new Set());
  const { funds: allFunds } = useRealTimeFunds();

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      const { data } = await supabase.rpc('is_user_admin');
      setIsAdmin(!!data);
    };
    checkAdminStatus();
  }, [user]);

  // Fetch companies and their funds
  useEffect(() => {
    const fetchCompaniesAndFunds = async () => {
      if (!user || !allFunds) return;

      try {
        let companiesData: CompanyWithFunds[] = [];

        if (isAdmin) {
          const { data: allProfiles } = await supabase
            .from('profiles')
            .select('id, company_name, logo_url')
            .not('company_name', 'is', null)
            .order('company_name');

          if (allProfiles) {
            companiesData = await Promise.all(
              allProfiles.map(async (profile) => {
                const { data: companyFunds } = await supabase.rpc('get_funds_by_company_name', {
                  company_name_param: profile.company_name
                });

                return {
                  profileId: profile.id,
                  companyName: profile.company_name,
                  logo: profile.logo_url,
                  funds: (companyFunds || []).map((f: any) => ({ id: f.id, name: f.name }))
                };
              })
            );
          }
        } else {
          const { data: assignments } = await supabase
            .from('manager_profile_assignments')
            .select('profile_id, profiles!inner(id, company_name, logo_url)')
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (assignments) {
            companiesData = await Promise.all(
              assignments.map(async (assignment: any) => {
                const profile = assignment.profiles;
                const { data: companyFunds } = await supabase.rpc('get_funds_by_company_name', {
                  company_name_param: profile.company_name
                });

                return {
                  profileId: profile.id,
                  companyName: profile.company_name,
                  logo: profile.logo_url,
                  funds: (companyFunds || []).map((f: any) => ({ id: f.id, name: f.name }))
                };
              })
            );
          }
        }

        setCompaniesWithFunds(companiesData);
        
        if (companiesData.length > 0 && !expandedCompany) {
          setExpandedCompany(companiesData[0].profileId);
        }
      } catch (error) {
        console.error('Error fetching companies and funds:', error);
      }
    };

    fetchCompaniesAndFunds();
  }, [user, isAdmin, allFunds]);

  // Fetch total open leads
  useEffect(() => {
    const fetchOpenLeadsCount = async () => {
      if (!user) return;

      try {
        let companyNames: string[] = [];

        if (isAdmin) {
          const { data: allProfiles } = await supabase
            .from('profiles')
            .select('company_name')
            .not('company_name', 'is', null);
          
          companyNames = allProfiles?.map(p => p.company_name) || [];
        } else {
          const { data: assignments } = await supabase
            .from('manager_profile_assignments')
            .select('profiles!inner(company_name)')
            .eq('user_id', user.id)
            .eq('status', 'active');

          companyNames = assignments?.map(a => (a.profiles as any).company_name) || [];
        }

        let totalCount = 0;
        for (const companyName of companyNames) {
          const { data: companyFunds } = await supabase.rpc('get_funds_by_company_name', {
            company_name_param: companyName
          });

          const fundIds = companyFunds?.map((f: any) => f.id) || [];

          if (fundIds.length > 0) {
            const { count: fundLeadsCount } = await supabase
              .from('fund_enquiries')
              .select('*', { count: 'exact', head: true })
              .in('fund_id', fundIds)
              .eq('status', 'open');

            totalCount += (fundLeadsCount || 0);
          }

          const { count: generalLeadsCount } = await supabase
            .from('fund_enquiries')
            .select('*', { count: 'exact', head: true })
            .is('fund_id', null)
            .eq('manager_name', companyName)
            .eq('status', 'open');

          totalCount += (generalLeadsCount || 0);
        }

        setTotalOpenLeads(totalCount);
      } catch (error) {
        console.error('Error fetching open leads count:', error);
      }
    };

    fetchOpenLeadsCount();
  }, [user, isAdmin]);

  const topNavItems = [
    {
      title: 'Leads',
      to: '/dashboard',
      icon: Mail,
      badge: totalOpenLeads > 0 ? totalOpenLeads : undefined,
    },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const toggleFundExpanded = (fundId: string) => {
    setExpandedFunds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fundId)) {
        newSet.delete(fundId);
      } else {
        newSet.add(fundId);
      }
      return newSet;
    });
  };

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r">
      <SidebarHeader>
        <Link 
          to="/" 
          className="flex items-center px-4 py-4 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/9bdf45a5-6a2f-466e-8c2d-b8ba65863e8a.png" 
            alt="Movingto" 
            className={isCollapsed ? "h-8 w-8 object-contain" : "h-8 object-contain"}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.to}>
                    <Link to={item.to} onClick={handleNavClick}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && !isCollapsed && (
                        <Badge variant="default" className="ml-auto">{item.badge}</Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {companies.map((company) => (
          <Collapsible
            key={company.profileId}
            open={expandedCompany === company.profileId}
            onOpenChange={(open) => setExpandedCompany(open ? company.profileId : null)}
          >
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1.5">
                  {company.logo && !isCollapsed && (
                    <img src={company.logo} alt="" className="h-4 w-4 rounded object-cover" />
                  )}
                  <span className="flex-1 truncate">{isCollapsed ? company.companyName.substring(0, 2) : company.companyName}</span>
                  {!isCollapsed && (
                    <ChevronRight className={`h-4 w-4 transition-transform ${expandedCompany === company.profileId ? 'rotate-90' : ''}`} />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === `/dashboard/company/${company.profileId}`}>
                        <Link to={`/dashboard/company/${company.profileId}`} onClick={handleNavClick}>
                          <Edit className="h-4 w-4" />
                          <span>Edit Company Profile</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Team Members Management */}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === `/dashboard/company/${company.profileId}/team-members`}>
                        <Link to={`/dashboard/company/${company.profileId}/team-members`} onClick={handleNavClick}>
                          <User className="h-4 w-4" />
                          <span>Team Members</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Team Access at company level */}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === `/dashboard/company/${company.profileId}/team`}>
                        <Link to={`/dashboard/company/${company.profileId}/team`} onClick={handleNavClick}>
                          <UsersIcon className="h-4 w-4" />
                          <span>Team Access</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {company.funds.length > 0 && (
                      <SidebarMenuSub>
                        {company.funds.map((fund) => {
                          const isFundExpanded = expandedFunds.has(fund.id);
                          return (
                            <Collapsible key={fund.id} open={isFundExpanded} onOpenChange={() => toggleFundExpanded(fund.id)}>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubItem className="cursor-pointer">
                                  <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded-md">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    <span className="flex-1 truncate text-sm">{fund.name}</span>
                                    <ChevronRight className={`h-3 w-3 transition-transform ${isFundExpanded ? 'rotate-90' : ''}`} />
                                  </div>
                                </SidebarMenuSubItem>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent>
                                <SidebarMenuSub className="pl-4">
                                  <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild isActive={location.pathname === `/dashboard/fund/${fund.id}/update`}>
                                      <Link to={`/dashboard/fund/${fund.id}/update`} onClick={handleNavClick}>
                                        Update Fund
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                  <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild isActive={location.pathname === `/dashboard/fund/${fund.id}/analytics`}>
                                      <Link to={`/dashboard/fund/${fund.id}/analytics`} onClick={handleNavClick}>
                                        Analytics
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                   <SidebarMenuSubItem>
                                     <SidebarMenuSubButton asChild isActive={location.pathname === `/dashboard/fund/${fund.id}/advertising`}>
                                       <Link to={`/dashboard/fund/${fund.id}/advertising`} onClick={handleNavClick}>
                                         Advertising
                                       </Link>
                                     </SidebarMenuSubButton>
                                   </SidebarMenuSubItem>
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/account-settings"}>
                  <Link to="/account-settings" onClick={handleNavClick}>
                    <User className="h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" onClick={handleNavClick}>
                    <Home className="h-4 w-4" />
                    <span>Back to Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
