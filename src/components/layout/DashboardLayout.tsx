import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <TopBar />
        
        {/* Mobile Header Toggle */}
        <div className="lg:hidden flex items-center px-6 py-4 border-b border-twilight-border bg-background/50 backdrop-blur-xl sticky top-0 z-20">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-4">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-twilight-card border-r-twilight-border">
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="text-xl font-bold tracking-tight">
            Invoice<span className="text-primary">Tracker</span>
          </span>
        </div>

        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">
          {children}
        </main>
        
        <footer className="p-6 text-center text-xs text-muted-foreground border-t border-twilight-border bg-background/30">
          &copy; {new Date().getFullYear()} Invoice Tracker System. Built with Twilight Luxury Theme.
        </footer>
      </div>
    </div>
  );
}
