import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Users,
  UserCog,
  Settings,
  Building2,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import brandLogo from "@/assets/brand-logo.png";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  description: string;
}

interface MenuGroup {
  title: string;
  icon: any;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard,
        description: "Main dashboard",
      },
    ],
  },
  {
    title: "CRM",
    icon: Building2,
    items: [
      {
        title: "Contacts",
        url: "/contacts",
        icon: Users,
        description: "Customer database",
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
    ],
  },
  {
    title: "Admin",
    icon: Settings,
    items: [
      {
        title: "Users",
        url: "/users",
        icon: UserCog,
        description: "Team management",
      },
      {
        title: "Settings",
        url: "/admin",
        icon: Settings,
        description: "System administration",
      },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const isGroupActive = (items: MenuItem[]) => {
    return items.some((item) => isActive(item.url));
  };

  const renderMenuItem = (group: MenuGroup) => {
    const isSingleItem = group.items.length === 1;
    
    if (isSingleItem) {
      // Single item: Direct navigation with tooltip
      const item = group.items[0];
      return (
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
              <group.icon className="w-5 h-5" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-[#333] border-white/20 text-white">
            {group.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    // Multiple items: Interactive popover menu
    return (
      <Popover
        open={openPopover === group.title}
        onOpenChange={(open) => setOpenPopover(open ? group.title : null)}
      >
        <PopoverTrigger asChild>
          <button
            className={`
              flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200
              ${
                isGroupActive(group.items)
                  ? "bg-primary text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
            `}
            onMouseEnter={() => setOpenPopover(group.title)}
            onMouseLeave={() => setOpenPopover(null)}
          >
            <group.icon className="w-5 h-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          className="w-64 p-0 bg-[#333] border-white/20 z-[100] ml-2"
          onMouseEnter={() => setOpenPopover(group.title)}
          onMouseLeave={() => setOpenPopover(null)}
        >
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                    ${
                      isActive(item.url)
                        ? "bg-primary text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }
                  `}
                  onClick={() => setOpenPopover(null)}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
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
            {menuGroups.map((group) => (
              <SidebarMenuItem key={group.title}>
                {renderMenuItem(group)}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </TooltipProvider>
      </SidebarContent>
    </Sidebar>
  );
}
