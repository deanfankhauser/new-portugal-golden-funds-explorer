import { Building2, BarChart3, User, LogOut, Home, Edit3, Users, Megaphone, ArrowLeft, UserPlus, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";

interface FundManagerSidebarProps {
  fundId?: string;
  fundName?: string;
}

const FundManagerSidebar = ({ fundId, fundName }: FundManagerSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user } = useEnhancedAuth();
  const [totalOpenLeads, setTotalOpenLeads] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      const { data } = await supabase.rpc('is_user_admin');
      setIsAdmin(!!data);
    };
    checkAdminStatus();
  }, [user]);

  // Fetch total open leads count
  useEffect(() => {
    const fetchOpenLeadsCount = async () => {
      if (!user) return;

      try {
        let companyNames: string[] = [];

        if (isAdmin) {
          // Admin sees all companies
          const { data: allProfiles } = await supabase
            .from('profiles')
            .select('company_name')
            .not('company_name', 'is', null);
          
          companyNames = allProfiles?.map(p => p.company_name) || [];
        } else {
          // Get user's assigned companies
          const { data: assignments } = await supabase
            .from('manager_profile_assignments')
            .select('profiles!inner(company_name)')
            .eq('user_id', user.id)
            .eq('status', 'active');

          companyNames = assignments?.map(a => (a.profiles as any).company_name) || [];
        }

        // Get all funds for these companies
        let totalCount = 0;
        for (const companyName of companyNames) {
          const { data: companyFunds } = await supabase.rpc('get_funds_by_company_name', {
            company_name_param: companyName
          });

          const fundIds = companyFunds?.map((f: any) => f.id) || [];

          // Count open leads for fund-specific enquiries
          if (fundIds.length > 0) {
            const { count: fundLeadsCount } = await supabase
              .from('fund_enquiries')
              .select('*', { count: 'exact', head: true })
              .in('fund_id', fundIds)
              .eq('status', 'open');

            totalCount += (fundLeadsCount || 0);
          }

          // Count open leads for general company enquiries
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

  // Top-level navigation items (always shown)
  const topNavItems = [
    {
      title: "My Companies",
      url: "/my-funds",
      icon: Building2,
    },
    {
      title: "Leads",
      url: "/my-leads",
      icon: Mail,
      badge: totalOpenLeads > 0 ? totalOpenLeads : undefined,
    },
  ];

  // Fund-specific navigation items (only shown when managing a fund)
  const fundNavItems = fundId ? [
    {
      title: "Update Fund",
      url: `/manage-fund/${fundId}/update`,
      icon: Edit3,
    },
    {
      title: "Analytics",
      url: `/manage-fund/${fundId}/analytics`,
      icon: BarChart3,
    },
    {
      title: "Advertising",
      url: `/manage-fund/${fundId}/advertising`,
      icon: Megaphone,
    },
    {
      title: "Team Access",
      url: `/manage-fund/${fundId}/team`,
      icon: UserPlus,
    },
  ] : [];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "icon"}
      className="border-r"
    >
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
        {/* Top-level navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                  >
                    <Link to={item.url} onClick={handleNavClick}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && !isCollapsed && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Fund-specific navigation */}
        {fundId && fundName && (
          <>
            <Separator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel className="truncate" title={fundName}>
                {isCollapsed ? "Fund" : fundName}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/my-funds" onClick={handleNavClick}>
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to My Companies</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {fundNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                      >
                        <Link to={item.url} onClick={handleNavClick}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        <Separator className="my-2" />

        {/* Account Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/account-settings")}
                >
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

        {/* Bottom actions */}
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
};

export default FundManagerSidebar;
