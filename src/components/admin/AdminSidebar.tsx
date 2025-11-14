import { NavLink, useLocation, Link } from "react-router-dom";
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
  Settings
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
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Suggestions", url: "/admin/suggestions", icon: FileEdit },
  { title: "Funds", url: "/admin/funds", icon: Briefcase },
  { title: "Rankings", url: "/admin/rankings", icon: TrendingUp },
  { title: "Company Managers", url: "/admin/company-managers", icon: Building2 },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Email Captures", url: "/admin/emails", icon: Mail },
  { title: "Leads", url: "/admin/leads", icon: Target },
  { title: "Performance", url: "/admin/performance", icon: Activity },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isCollapsed = state === "collapsed";

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
              {navItems.map((item) => (
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