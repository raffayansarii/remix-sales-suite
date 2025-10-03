"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
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
  const [theme, setTheme] = useState<"light" | "dark">(
    typeof window !== "undefined" &&
      window.localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light"
  );
  const { data } = useGetCurrentUserQuery(null);
  const userDataRaw = localStorage.getItem("user");
  const userData: IUser = userDataRaw ? JSON.parse(userDataRaw) : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <SidebarProvider defaultOpen={false}>
        <div
          className={`min-h-screen flex w-full bg-background${
            theme === "dark" ? " dark" : ""
          }`}
        >
          <AppSidebar />

          <div className="flex-1 flex flex-col">
            <header className="h-16 border-b bg-[#333] sticky top-0 z-40">
              <div className="flex h-full items-center gap-4 px-6">
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
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 z-10" />
                      <Input
                        placeholder="Global Search... (Ctrl+K)"
                        className="pl-10 pr-4 w-72 bg-white/10 border-2 border-white/20 focus:border-white/40 shadow-sm text-white placeholder:text-white/60"
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
                      className="p-2 rounded hover:bg-white/10 border border-white/20 text-white"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? (
                        <Sun className="w-5 h-5" />
                      ) : (
                        <Moon className="w-5 h-5" />
                      )}
                    </button>

                    {/* TODO: Replace with real tenant switcher connected to backend */}
                    {/* <TenantSwitcher /> */}

                    <div className="text-sm text-white/90">
                      Welcome back,{" "}
                      {userData?.user_metadata?.last_name?.split(" ")[0] ||
                        data?.user_metadata?.last_name?.split(" ")[0] ||
                        "-"}
                    </div>
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {userData?.user_metadata?.last_name
                          ?.charAt(0)
                          .toUpperCase() ||
                          data?.user_metadata?.last_name
                            ?.charAt(0)
                            .toUpperCase() ||
                          "U"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main className="overflow-hidden h-full flex-1">
              <div className="w-[calc(100vw-64px)] h-[calc(100vh-64px)] overflow-auto ">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeContext.Provider>
  );
}
