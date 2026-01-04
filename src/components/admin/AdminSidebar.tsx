import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileEdit, 
  Briefcase, 
  TrendingUp, 
  Building2, 
  Users, 
  Mail, 
  Target, 
  Activity,
  Settings,
  Home,
  LogOut,
  Edit,
  Building,
  PieChart,
  FileCheck,
  MessageSquare
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const adminNavItems: NavItem[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Fund Submissions", url: "/admin/fund-submissions", icon: FileCheck },
  { title: "Suggestions", url: "/admin/suggestions", icon: FileEdit },
  { title: "Funds", url: "/admin/funds", icon: Briefcase },
  { title: "Rankings", url: "/admin/rankings", icon: TrendingUp },
  { title: "Company Managers", url: "/admin/company-managers", icon: Building2 },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Email Captures", url: "/admin/emails", icon: Mail },
  { title: "Contact Messages", url: "/admin/contact-submissions", icon: MessageSquare },
  { title: "Leads", url: "/admin/leads", icon: Target },
  { title: "Performance", url: "/admin/performance", icon: Activity },
  { title: "Quiz Analytics", url: "/admin/quiz-analytics", icon: PieChart },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const superAdminNavItems: NavItem[] = [
  { title: "Edit Funds", url: "/admin/edit-funds", icon: Edit },
  { title: "Edit Company Profiles", url: "/admin/edit-profiles", icon: Building },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isCollapsed = state === "collapsed";

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

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <>
      <SidebarHeader className="border-b border-border">
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
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/admin"}
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-muted text-primary font-medium" 
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span>{item.title}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Super Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 px-4">
            SUPER ADMIN
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {superAdminNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-muted text-primary font-medium" 
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
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
    </>
  );

  if (isMobile) {
    return (
      <Sidebar collapsible="offcanvas" className="border-r border-border">
        {sidebarContent}
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      {sidebarContent}
    </Sidebar>
  );
}