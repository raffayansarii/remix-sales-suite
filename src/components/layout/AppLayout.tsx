import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  console.log('🏗️ [APP_LAYOUT] Rendering AppLayout with global search');
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-full items-center gap-4 px-6">
              <SidebarTrigger className="hover:bg-muted rounded-md p-2 transition-colors" />
              
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold text-foreground">CRM Dashboard</h1>
                  
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
                      placeholder="🔍 Global Search... (Ctrl+K)"
                      className="pl-10 pr-4 w-72 bg-background border-2 border-primary/30 focus:border-primary shadow-sm"
                      onFocus={() => console.log('🔍 [GLOBAL_SEARCH] Search focused - ready for backend integration')}
                      onChange={(e) => console.log('🔍 [GLOBAL_SEARCH] Query:', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          console.log('🔍 [GLOBAL_SEARCH] Search executed - implement navigation');
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Welcome back, John Doe
                  </div>
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}