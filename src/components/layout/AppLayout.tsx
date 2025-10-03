"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { Search, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/api/auth/authApi";
import { IUser } from "@/api/auth/authTypes";

interface AppLayoutProps {
  children?: ReactNode;
}

const ThemeContext = createContext({
  theme: "light",
  setTheme: (theme: "light" | "dark") => {},
});

function useTheme() {
  return useContext(ThemeContext);
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );
  const {data} = useGetCurrentUserQuery(null)
  const userDataRaw = localStorage.getItem('user')
  const userData:IUser = userDataRaw ? JSON.parse(userDataRaw) : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  console.log({local:userData?.user_metadata?.full_name ,api:data?.user_metadata?.full_name })
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <SidebarProvider>
        <div className={`min-h-screen flex w-full bg-background${theme === 'dark' ? ' dark' : ''}`}>
          <AppSidebar isSidebarCollapsed={setIsSidebarCollapsed} />

          <div className="flex-1 flex flex-col">
            <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex h-full items-center gap-4 px-6">
                <SidebarTrigger className="hover:bg-muted rounded-md p-2 transition-colors" />

                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* TODO: Global Search Integration - Backend Integration Needed:
                        - Elasticsearch/Algolia/Backend search endpoint: GET /api/search?q={query}
                        - Autocomplete suggestions: POST /api/search/suggestions
                        - Libraries to consider: @elastic/search-ui, react-instantsearch, Fuse.js
                        - Search across: opportunities, contacts, companies, tasks, notes
                        - Features: keyboard shortcuts, search history, filters
                    */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                      <Input
                        placeholder="Global Search... (Ctrl+K)"
                        className="pl-10 pr-4 w-72 bg-background border-2 border-primary/30 focus:border-primary shadow-sm"
                        onFocus={() =>
                          console.log(
                            "[GLOBAL_SEARCH] Search focused - ready for backend integration"
                          )
                        }
                        onChange={(e) =>
                          console.log("[GLOBAL_SEARCH] Query:", e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            console.log(
                              "[GLOBAL_SEARCH] Search executed - implement navigation"
                            );
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Theme Toggle Button */}
                    <button
                      aria-label="Toggle theme"
                      className="p-2 rounded hover:bg-muted border"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* TODO: Replace with real tenant switcher connected to backend */}
                    {/* <TenantSwitcher /> */}

                    <div className="text-sm text-muted-foreground">
                      Welcome back, {userData?.user_metadata?.first_name || data?.user_metadata?.first_name || "-"}
                    </div>
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {userData?.user_metadata?.first_name?.charAt(0).toUpperCase() || data?.user_metadata?.first_name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main
              className={`overflow-hidden h-full transition-all ${
                !isSidebarCollapsed ? "w-[calc(100vw-255px)]" : "w-full"
              }`}
            >
              <div className="h-full w-full overflow-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeContext.Provider>
  );
}
