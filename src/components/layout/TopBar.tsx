import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Command, 
  Plus, 
  FileDown, 
  LogOut, 
  User, 
  Settings as SettingsIcon,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function TopBar() {
  const { theme, setTheme } = useTheme();

  const notifications = [
    { id: 1, title: "Payment Received", message: "Amana Corp paid $12,400.00", time: "2m ago", icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, unread: true },
    { id: 2, title: "Overdue Invoice", message: "INV-1022 is 3 days overdue", time: "1h ago", icon: <AlertCircle className="h-4 w-4 text-rose-500" />, unread: true },
    { id: 3, title: "New Customer", message: "Star Logistics registered", time: "4h ago", icon: <User className="h-4 w-4 text-primary" />, unread: false },
    { id: 4, title: "Check Maturity", message: "Check #4521 matures tomorrow", time: "1d ago", icon: <Clock className="h-4 w-4 text-amber-500" />, unread: false },
  ];

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Generating financial report...",
        success: "Report exported successfully as PDF!",
        error: "Export failed. Please try again.",
      }
    );
  };

  return (
    <div className="h-16 border-b border-twilight-border bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search invoices, customers, or checks..." 
            className="pl-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl h-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
            <Command className="h-2 w-2" />
            <span>K</span>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="rounded-full border-twilight-border bg-background/50 hover:bg-primary/5 gap-2 px-4 h-9"
          >
            <FileDown className="h-4 w-4" />
            Export Report
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="rounded-full gap-2 px-4 h-9 shadow-lg shadow-primary/20"
              >
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-twilight-card border-twilight-border rounded-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  New Invoice Quick Setup
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Select Customer</Label>
                  <Input id="customer" placeholder="Search customer..." className="rounded-xl border-twilight-border bg-muted/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input id="amount" type="number" placeholder="0.00" className="rounded-xl border-twilight-border bg-muted/20" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="due">Due Date</Label>
                    <Input id="due" type="date" className="rounded-xl border-twilight-border bg-muted/20" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-xl border-twilight-border">Draft</Button>
                <Button className="rounded-xl px-8" onClick={() => toast.success("Invoice created successfully!")}>Generate Invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full transition-all h-10 w-10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-twilight-card backdrop-blur-xl border-twilight-border rounded-2xl p-2 mt-2 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 mb-2">
              <span className="font-bold text-sm">Notifications</span>
              <Badge className="bg-primary/20 text-primary border-none">2 New</Badge>
            </div>
            <DropdownMenuSeparator className="bg-twilight-border mx-2" />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-primary/10 rounded-xl mx-1 transition-colors">
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      {n.icon}
                    </div>
                    <span className="font-bold text-xs flex-1">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-10 leading-relaxed">{n.message}</p>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator className="bg-twilight-border mx-2" />
            <Button variant="ghost" className="w-full text-xs text-primary hover:bg-primary/5 rounded-xl mt-1">View All Notifications</Button>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full transition-all h-10 w-10"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <div className="h-8 w-px bg-twilight-border mx-1" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 hover:bg-primary/10 rounded-full transition-all h-10 w-10">
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-twilight-card backdrop-blur-xl border-twilight-border rounded-2xl p-2 mt-2 shadow-2xl">
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-bold leading-none">Xaaji Xarash</p>
                <p className="text-[10px] text-muted-foreground mt-1">Super Administrator</p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-twilight-border mx-2" />
            <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/10 rounded-xl mx-1 transition-colors">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/10 rounded-xl mx-1 transition-colors">
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Organization Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/10 rounded-xl mx-1 transition-colors">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Subscription Plan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-twilight-border mx-2" />
            <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer text-rose-500 focus:bg-rose-500/10 rounded-xl mx-1 transition-colors">
              <LogOut className="h-4 w-4" />
              <span className="text-xs font-bold">Logout Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
