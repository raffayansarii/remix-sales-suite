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
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import brandLogo from "@/assets/brand-logo.png";

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

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="w-16 border-r-0 bg-[#333] z-50" collapsible="none">
      <SidebarContent className="bg-[#333]">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <img src={brandLogo} alt="Brand Logo" className="w-10 h-10" />
        </div>

        {/* Navigation Menu */}
        <TooltipProvider delayDuration={0}>
          <SidebarMenu className="px-2 py-4 space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.url}
                      className={`
                        flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200
                        ${
                          isActive(item.url)
                            ? "bg-primary text-white shadow-lg"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-popover border z-[100]">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </TooltipProvider>
      </SidebarContent>
    </Sidebar>
  );
}
