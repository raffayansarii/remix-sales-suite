import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Users,
  UserCog,
  Settings,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect } from "react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    title: "Opportunity Pipelines",
    url: "/pipelines",
    icon: Target,
    description: "Manage sales pipeline",
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
    description: "Track activities",
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Users,
    description: "Customer database",
  },
  {
    title: "Users",
    url: "/users",
    icon: UserCog,
    description: "Team management",
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Settings,
    description: "System administration",
  },
];

export function AppSidebar({
  isSidebarCollapsed,
}: {
  isSidebarCollapsed?: (state: boolean) => void;
}) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };
  useEffect(() => {
    if (!isSidebarCollapsed) return;
    isSidebarCollapsed(isCollapsed);
  }, [isCollapsed]);

  return (
    <Sidebar
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 border-r bg-background z-50`}
    >
      <SidebarContent className="bg-background">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold text-foreground">CRM Pro</h2>
                <p className="text-xs text-muted-foreground">
                  Pipeline Management
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel
            className={`${
              isCollapsed ? "sr-only" : ""
            } text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2`}
          >
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }
                      ${isCollapsed ? "justify-center" : "justify-start"}
                    `}
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 w-full"
                    >
                      <item.icon
                        className={`${
                          isCollapsed ? "w-5 h-5" : "w-4 h-4"
                        } flex-shrink-0`}
                      />
                      {!isCollapsed && (
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {item.title}
                          </div>
                          <div className="text-xs opacity-75">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
