import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-full items-center gap-4 px-6">
              <SidebarTrigger className="hover:bg-muted rounded-md p-2 transition-colors" />
              
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-foreground">CRM Dashboard</h1>
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