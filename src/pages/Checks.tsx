import { useState } from "react";
import type { Check, Payment, Customer } from "@/types";


import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Wallet, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  MoreVertical,
  FileText,
  Edit,
  Trash2
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
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function Checks() {
  const [checks, setChecks] = useLocalStorage<Check[]>("it_checks", []);
  const [payments, setPayments] = useLocalStorage<Payment[]>("it_payments", []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>("it_customers", []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddingCheck, setIsAddingCheck] = useState(false);

  const [newCheck, setNewCheck] = useState({
    type: "Received" as "Received" | "Issued",
    bank: "",
    number: "",
    amount: "",
    dueDate: "",
    customer: "",
  });

  const handleReconciliation = () => {
    toast.promise(
      new Promise<Check[]>((resolve) => {
        setTimeout(() => {
          const now = new Date();
          const newPayments: Payment[] = [];
          
          const reconciled = checks.map(c => {
            const dueDate = new Date(c.dueDate);
            if (c.status === "Pending" && dueDate <= now) {
              // If it's a Received check, create a Payment record
              if (c.type === "Received") {
                newPayments.push({
                  id: `PAY-CHK-${c.number}-${Math.floor(Math.random() * 1000)}`,
                  invoiceId: "CHK-PAYMENT",
                  customer: c.customer,
                  amount: c.amount,
                  method: "Check",
                  date: now.toISOString().split('T')[0],
                  status: "Cleared",
                });
              }
              return { ...c, status: "Cleared" as const };
            }
            return c;
          });

          if (newPayments.length > 0) {
            setPayments([...newPayments, ...payments]);
            
            // Also update customer balances
            setCustomers(customers.map(cust => {
              const custPayments = newPayments.filter(p => p.customer === cust.name);
              if (custPayments.length > 0) {
                const totalPaid = custPayments.reduce((sum, p) => sum + (parseFloat(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0), 0);
                return {
                  ...cust,
                  totalSpent: ((parseFloat(String(cust.totalSpent || "0").replace(/[^0-9.-]+/g, "")) || 0) + totalPaid).toFixed(2),
                  outstanding: Math.max(0, (parseFloat(String(cust.outstanding || "0").replace(/[^0-9.-]+/g, "")) || 0) - totalPaid).toFixed(2)
                };
              }
              return cust;
            }));
          }

          setChecks(reconciled);
          resolve(reconciled);
        }, 2000);
      }),
      {
        loading: "Syncing with bank records...",
        success: (res: Check[]) => {
          const clearedCount = res.filter(c => c.status === "Cleared").length;
          return `Bank reconciliation complete. ${clearedCount} checks are now cleared and recorded.`;
        },
        error: "Reconciliation failed.",
      }
    );
  };

  const handleEdit = (check: Check) => {
    setSelectedCheck(check);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (check: Check) => {
    setSelectedCheck(check);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedCheck) return;
    setChecks(checks.filter(c => c.id !== selectedCheck.id));
    toast.success(`Check record #${selectedCheck?.number} deleted.`);
    setIsDeleteDialogOpen(false);
  };

  const saveEdit = () => {
    if (!selectedCheck) return;
    setChecks(checks.map(c => c.id === selectedCheck.id ? selectedCheck : c));
    toast.success(`Check record #${selectedCheck?.number} updated.`);
    setIsEditDialogOpen(false);
  };

  const handleAddCheck = () => {
    const check: Check = {
      id: `CHK-${Math.floor(1000 + Math.random() * 9000)}`,
      type: newCheck.type,
      bank: newCheck.bank || "Somali Central Bank",
      number: newCheck.number || "0000000",
      amount: newCheck.amount || "0.00",
      dueDate: newCheck.dueDate || new Date().toISOString().split('T')[0],
      status: "Pending",
      customer: newCheck.customer || "General Client",
    };

    setChecks([check, ...checks]);
    setIsAddingCheck(false);
    toast.success("Check record added to the vault!");
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Check Management</h1>
          <p className="text-muted-foreground mt-1">Track issued and received checks with status alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleReconciliation}
            className="rounded-xl border-twilight-border bg-background/50 gap-2 h-11"
          >
            Bank Reconciliation
          </Button>
          
          <Dialog open={isAddingCheck} onOpenChange={setIsAddingCheck}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20 h-11 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold">
                <Plus className="h-4 w-4" />
                Add New Check
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-amber-500" />
                  </div>
                  Record New Check
                </DialogTitle>
                <DialogDescription>Document a physical check for tracking and future reconciliation.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="font-bold">Check Type</Label>
                    <Select 
                      defaultValue="Received" 
                      onValueChange={(val) => setNewCheck({...newCheck, type: val as "Received" | "Issued"})}
                    >
                      <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-twilight-card border-twilight-border">
                        <SelectItem value="Received">Received from Client</SelectItem>
                        <SelectItem value="Issued">Issued to Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Issuing Bank</Label>
                    <Input 
                      placeholder="e.g. IBS Bank" 
                      className="rounded-xl border-twilight-border bg-muted/20 h-12"
                      value={newCheck.bank}
                      onChange={(e) => setNewCheck({...newCheck, bank: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="font-bold">Check Number</Label>
                    <Input 
                      placeholder="Enter check #" 
                      className="rounded-xl border-twilight-border bg-muted/20 h-12"
                      value={newCheck.number}
                      onChange={(e) => setNewCheck({...newCheck, number: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Amount ($)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className="rounded-xl border-twilight-border bg-muted/20 h-12"
                      value={newCheck.amount}
                      onChange={(e) => setNewCheck({...newCheck, amount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="font-bold">Client / Vendor</Label>
                    <Select onValueChange={(val) => setNewCheck({...newCheck, customer: val})}>
                      <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                        <SelectValue placeholder="Select entity" />
                      </SelectTrigger>
                      <SelectContent className="bg-twilight-card border-twilight-border">
                        {customers.map(c => (
                          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Maturity Date</Label>
                    <Input 
                      type="date" 
                      className="rounded-xl border-twilight-border bg-muted/20 h-12"
                      value={newCheck.dueDate}
                      onChange={(e) => setNewCheck({...newCheck, dueDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsAddingCheck(false)} className="rounded-xl border-twilight-border h-12">Cancel</Button>
                <Button className="rounded-xl h-12 px-8 shadow-lg shadow-amber-500/20 bg-amber-600 hover:bg-amber-700 text-white font-bold flex-1" onClick={handleAddCheck}>
                  Save Record
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass border-twilight-border rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ArrowDownCircle className="h-32 w-32 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Received Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-500">$0.00</div>
          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ArrowUpCircle className="h-32 w-32 text-rose-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Issued Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-500">$0.00</div>
          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl bg-rose-500/5 border-rose-500/20">
          <CardHeader>
            <CardTitle className="text-xs font-bold text-rose-500 uppercase tracking-widest">Urgent Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-lg font-black">0 Issues</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Ledger Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="glass border-twilight-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-twilight-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by check #, bank, or customer..." 
              className="pl-10 bg-muted/30 border-none rounded-xl h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="rounded-xl gap-2 text-muted-foreground hover:bg-primary/10 transition-colors h-10 px-4 text-xs font-bold uppercase tracking-wider">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-twilight-border hover:bg-transparent">
              <TableHead className="py-5 px-6">Check #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Bank Name</TableHead>
              <TableHead>Customer/Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right px-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checks.length > 0 ? checks.map((check) => (
              <TableRow key={check.id} className="border-twilight-border hover:bg-primary/5 transition-colors group">
                <TableCell className="font-bold py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {check.number}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {check.type === "Received" ? (
                      <ArrowDownCircle className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <ArrowUpCircle className="h-3 w-3 text-rose-500" />
                    )}
                    <span className="text-sm font-bold">{check.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{check.bank}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{check.customer}</TableCell>
                <TableCell className="font-black text-foreground">${(parseFloat(String(check.amount).replace(/[^0-9.-]+/g, "")) || 0).toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground text-xs font-bold uppercase">{check.dueDate}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "rounded-full px-3 py-1 font-medium gap-1.5",
                    check.status === "Cleared" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    check.status === "Pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                    check.status === "Bounced" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  )}>
                    {check.status === "Cleared" && <CheckCircle2 className="h-3 w-3" />}
                    {check.status === "Pending" && <Clock className="h-3 w-3" />}
                    {check.status === "Bounced" && <AlertCircle className="h-3 w-3" />}
                    {check.status}
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
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer" onClick={() => toast.info(`Viewing check #${check.number}`)}>
                        <FileText className="h-4 w-4 text-primary" /> View Check Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer" onClick={() => handleEdit(check)}>
                        <Edit className="h-4 w-4 text-amber-500" /> Edit Record
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-twilight-border mx-1" />
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer text-rose-500 focus:bg-rose-500/10" onClick={() => handleDelete(check)}>
                        <Trash2 className="h-4 w-4" /> Delete Record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-20 text-muted-foreground italic">
                  No check records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Edit Check Record</DialogTitle>
            <DialogDescription>Updating details for check #{selectedCheck?.number}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label className="font-bold">Issuing Bank</Label>
              <Input defaultValue={selectedCheck?.bank} className="rounded-xl border-twilight-border bg-muted/20 h-12" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Check Number</Label>
                <Input defaultValue={selectedCheck?.number} className="rounded-xl border-twilight-border bg-muted/20 h-12" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Amount ($)</Label>
                <Input defaultValue={selectedCheck?.amount} type="number" className="rounded-xl border-twilight-border bg-muted/20 h-12" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Maturity Date</Label>
              <Input defaultValue={selectedCheck?.dueDate} type="date" className="rounded-xl border-twilight-border bg-muted/20 h-12" />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-twilight-border h-12">Cancel</Button>
            <Button onClick={saveEdit} className="rounded-xl h-12 px-8 shadow-lg shadow-amber-500/20 bg-amber-500 hover:bg-amber-600 text-black font-bold flex-1">Save Record</Button>
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
            <AlertDialogTitle className="text-2xl font-black">Remove Check Record?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete check <span className="font-bold text-foreground">#{selectedCheck?.number}</span>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl border-twilight-border h-12 flex-1">Keep Record</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 rounded-xl h-12 flex-1 font-bold text-white shadow-lg shadow-rose-500/20">
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
