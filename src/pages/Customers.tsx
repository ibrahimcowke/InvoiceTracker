import { useState } from "react";
import type { Customer } from "@/types";


import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Plus, 
  Search, 
  Mail, 
  MapPin, 
  BarChart3, 
  TrendingUp, 
  ExternalLink,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialCustomers: Customer[] = [];


export default function Customers() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>("it_customers", initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [newCust, setNewCust] = useState({
    name: "",
    email: "",
    phone: "",
    location: ""
  });

  const handleRegister = () => {
    const cust: Customer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newCust.name || "New Client",
      email: newCust.email || "client@example.com",
      phone: newCust.phone || "TBD",
      totalSpent: "0.00",
      outstanding: "0.00",
      riskScore: "Low",
      status: "Active",
      location: newCust.location || "Mogadishu, Somalia",
      lastInvoice: "Never",
    };

    setCustomers([cust, ...customers]);
    setIsRegisterOpen(false);
    toast.success(`${cust.name} registered successfully!`);
  };

  const handleEdit = (customer: Customer) => {

    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (customer: Customer) => {

    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDetails = (customer: Customer) => {

    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedCustomer) return;
    setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
    toast.success(`${selectedCustomer?.name} has been removed from the registry.`);
    setIsDeleteDialogOpen(false);
  };

  const saveEdit = () => {
    if (!selectedCustomer) return;
    setCustomers(customers.map(c => c.id === selectedCustomer.id ? selectedCustomer : c));
    toast.success(`Profile for ${selectedCustomer?.name} updated.`);
    setIsEditDialogOpen(false);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customer Base</h1>
          <p className="text-muted-foreground mt-1">Detailed management of clients and credit relationships.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-twilight-border bg-background/50 gap-2 h-11">
            <BarChart3 className="h-4 w-4" />
            Segment Analysis
          </Button>
          
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20 h-11 px-6 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4" />
                Register Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Register Client</DialogTitle>
                <DialogDescription>Add a new company or individual to the registry.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid gap-2">
                  <Label className="font-bold">Company Name</Label>
                  <Input 
                    placeholder="e.g. SomTrans Ltd" 
                    className="rounded-xl border-twilight-border bg-muted/20 h-12"
                    value={newCust.name}
                    onChange={(e) => setNewCust({...newCust, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="font-bold">Email</Label>
                    <Input 
                      placeholder="contact@email.com" 
                      className="rounded-xl border-twilight-border bg-muted/20 h-12"
                      value={newCust.email}
                      onChange={(e) => setNewCust({...newCust, email: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Phone</Label>
                    <Input 
                      placeholder="+252..." 
                      className="rounded-xl border-twilight-border bg-muted/20 h-12"
                      value={newCust.phone}
                      onChange={(e) => setNewCust({...newCust, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsRegisterOpen(false)} className="rounded-xl h-12">Cancel</Button>
                <Button className="rounded-xl h-12 flex-1 shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 font-bold" onClick={handleRegister}>
                  Register Client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-twilight-border rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{customers.length}</div>
            <p className="text-[10px] text-emerald-500 font-bold mt-2">Active records</p>
          </CardContent>
        </Card>
        {/* ... other cards ... */}
      </div>

      <div className="glass border-twilight-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-twilight-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by name, email, or ID..." 
              className="pl-10 bg-muted/30 border-none rounded-xl h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="rounded-xl border-twilight-border text-xs h-10 px-4">Sort by Spent</Button>
            <Button variant="ghost" className="rounded-xl border-twilight-border text-xs h-10 px-4">Credit Limit</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow className="border-twilight-border hover:bg-transparent bg-muted/30">
              <TableHead className="py-5 px-6">Customer</TableHead>
              <TableHead>Contact & Location</TableHead>
              <TableHead>Financials</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right px-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((cust) => (
              <TableRow key={cust.id} className="border-twilight-border hover:bg-primary/5 transition-colors group">
                <TableCell className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${cust.name}`} />
                      <AvatarFallback>{cust.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{cust.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{cust.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" /> {cust.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-rose-500" /> {cust.location}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-xs font-bold">Spent: ${parseFloat(cust.totalSpent).toLocaleString()}</p>
                    <p className="text-xs text-rose-500 font-bold">Owes: ${parseFloat(cust.outstanding).toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest",
                    cust.riskScore === "Low" && "border-emerald-500/50 text-emerald-500 bg-emerald-500/5",
                    cust.riskScore === "Medium" && "border-amber-500/50 text-amber-500 bg-amber-500/5",
                    cust.riskScore === "High" && "border-rose-500/50 text-rose-500 bg-rose-500/5"
                  )}>
                    {cust.riskScore}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "rounded-full px-3 py-1 font-medium",
                    cust.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  )}>
                    {cust.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-twilight-card border-twilight-border rounded-xl p-2 shadow-2xl">
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer" onClick={() => handleDetails(cust)}>
                        <ExternalLink className="h-4 w-4 text-primary" /> View Full Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer" onClick={() => handleEdit(cust)}>
                        <Edit className="h-4 w-4 text-amber-500" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-twilight-border mx-1" />
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer text-rose-500 focus:bg-rose-500/10" onClick={() => handleDelete(cust)}>
                        <Trash2 className="h-4 w-4" /> Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                  No customers found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[750px] bg-twilight-card border-twilight-border rounded-3xl p-0 overflow-hidden shadow-2xl">
          {selectedCustomer && (
            <div className="flex flex-col h-full">
              <div className="bg-linear-to-r from-primary/20 to-indigo-500/10 p-8 flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedCustomer.name}`} />
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-foreground">{selectedCustomer.name}</h2>
                  <div className="flex items-center gap-3">
                    <Badge className="rounded-full bg-emerald-500/20 text-emerald-500 border-none">{selectedCustomer.status}</Badge>
                    <span className="text-sm text-muted-foreground font-mono">{selectedCustomer.id}</span>
                  </div>
                </div>
              </div>
              <Tabs defaultValue="overview" className="flex-1">
                <TabsList className="w-full justify-start rounded-none bg-muted/30 border-b border-twilight-border px-8 h-14">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">Overview</TabsTrigger>
                  <TabsTrigger value="history">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-8 space-y-8 animate-in fade-in-50 duration-500">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Lifetime Value</p>
                      <p className="text-3xl font-black text-primary">${parseFloat(selectedCustomer.totalSpent).toLocaleString()}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                      <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Current Balance</p>
                      <p className="text-3xl font-black text-rose-500">${parseFloat(selectedCustomer.outstanding).toLocaleString()}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="p-8 text-center text-muted-foreground">
                   No recent history available for this record.
                </TabsContent>
              </Tabs>
              <div className="p-4 bg-muted/20 border-t border-twilight-border flex justify-end">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="rounded-xl border-twilight-border">Close Profile</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <Edit className="h-6 w-6 text-amber-500" />
              Update Customer Profile
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label className="font-bold">Company/Client Name</Label>
              <Input 
                defaultValue={selectedCustomer?.name} 
                onChange={(e) => setSelectedCustomer({...selectedCustomer, name: e.target.value} as Customer)}
                className="rounded-xl border-twilight-border bg-muted/20 h-12" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold">Email Address</Label>
                <Input 
                  defaultValue={selectedCustomer?.email} 
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, email: e.target.value} as Customer)}
                  className="rounded-xl border-twilight-border bg-muted/20 h-12" 
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold">Phone Number</Label>
                <Input 
                  defaultValue={selectedCustomer?.phone} 
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, phone: e.target.value} as Customer)}
                  className="rounded-xl border-twilight-border bg-muted/20 h-12" 
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button onClick={saveEdit} className="rounded-xl h-12 flex-1 shadow-lg shadow-amber-500/20 bg-amber-500 hover:bg-amber-600 text-black font-bold">Update Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-twilight-card border-twilight-border rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-rose-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-black">Terminate Relationship?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-foreground">{selectedCustomer?.name}</span>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl border-twilight-border h-12 flex-1">Abort</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 rounded-xl h-12 flex-1 font-bold text-white shadow-lg shadow-rose-500/20">
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
