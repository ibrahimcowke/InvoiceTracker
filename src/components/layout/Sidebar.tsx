import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Wallet, 
  Truck, 
  Users, 
  BarChart3, 
  Settings,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Wallet, label: "Checks", href: "/checks" },
  { icon: Truck, label: "Delivery", href: "/delivery" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn("pb-12 h-full flex flex-col bg-twilight-card/50 backdrop-blur-xl border-r border-twilight-border", className)}>
      <div className="px-6 py-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Invoice<span className="text-primary">Tracker</span>
          </span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 rounded-xl",
                location.pathname === item.href && "bg-primary/15 text-primary border-r-2 border-primary font-semibold"
              )}
              onClick={onClose}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
      
      <div className="px-6 py-4 mt-auto">
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <p className="text-sm font-medium text-foreground">Need help?</p>
          <p className="text-xs text-muted-foreground mt-1">Check our documentation or contact support.</p>
          <Button variant="link" className="px-0 text-primary h-auto mt-2 text-xs">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
}
