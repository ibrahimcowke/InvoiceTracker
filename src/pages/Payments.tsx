import { useState } from "react";
import type { Payment, Invoice, Customer } from "@/types";


import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  Smartphone, 
  Banknote, 
  History, 
  FileText, 
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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




export default function Payments() {
  const [payments, setPayments] = useLocalStorage<Payment[]>("it_payments", []);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>("it_invoices", []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>("it_customers", []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  const [newPayment, setNewPayment] = useState({
    invoiceId: "",
    amount: "",
    method: "Bank Transfer",
  });

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedPayment) return;
    setPayments(payments.filter(p => p.id !== selectedPayment.id));
    toast.success(`Transaction ${selectedPayment?.id} has been voided.`);
    setIsDeleteDialogOpen(false);
  };

  const saveEdit = () => {
    if (!selectedPayment) return;
    setPayments(payments.map(p => p.id === selectedPayment.id ? selectedPayment : p));
    toast.success(`Transaction ${selectedPayment?.id} records updated.`);
    setIsEditDialogOpen(false);
  };

  const handleAddPayment = () => {
    const inv = invoices.find(i => i.id === newPayment.invoiceId);
    if (!inv) {
      toast.error("Invalid invoice selected.");
      return;
    }

    const payment: Payment = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceId: newPayment.invoiceId,
      customer: inv.customer,
      amount: newPayment.amount || "0.00",
      method: newPayment.method,
      date: new Date().toISOString().split('T')[0],
      status: "Cleared",
    };

    // 1. Save Payment
    setPayments([payment, ...payments]);

    // 2. Update Invoice Status
    const totalPaidForInv = payments
      .filter(p => p.invoiceId === inv.id)
      .reduce((sum, p) => sum + (parseFloat(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0), 0) + (parseFloat(String(payment.amount).replace(/[^0-9.-]+/g, "")) || 0);
    
    if (totalPaidForInv >= (parseFloat(String(inv.amount).replace(/[^0-9.-]+/g, "")) || 0)) {
      setInvoices(invoices.map(i => i.id === inv.id ? { ...i, status: "Paid" } : i));
    }

    // 3. Update Customer Balance
    setCustomers(customers.map(c => {
      if (c.name === inv.customer) {
        return {
          ...c,
          totalSpent: ((parseFloat(String(c.totalSpent || "0").replace(/[^0-9.-]+/g, "")) || 0) + (parseFloat(String(payment.amount).replace(/[^0-9.-]+/g, "")) || 0)).toFixed(2),
          outstanding: Math.max(0, (parseFloat(String(c.outstanding || "0").replace(/[^0-9.-]+/g, "")) || 0) - (parseFloat(String(payment.amount).replace(/[^0-9.-]+/g, "")) || 0)).toFixed(2)
        };
      }
      return c;
    }));

    setIsAddingPayment(false);
    toast.success(`Payment of $${payment.amount} recorded for ${inv.customer}!`);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payment Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor all incoming collections and reconciliations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-twilight-border bg-background/50 gap-2 h-11 px-4">
            <Download className="h-4 w-4" />
            Export History
          </Button>
          
          <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20 h-11 px-6 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Record New Payment</DialogTitle>
                <DialogDescription>Manually record a payment received from a customer.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Invoice #</Label>
                    <Select onValueChange={(val) => setNewPayment({...newPayment, invoiceId: val})}>
                      <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                        <SelectValue placeholder="Select Invoice" />
                      </SelectTrigger>
                      <SelectContent className="bg-twilight-card border-twilight-border">
                        {invoices.filter(i => i.status !== "Paid").map(inv => (
                          <SelectItem key={inv.id} value={inv.id}>{inv.id} - {inv.customer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Amount Paid ($)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className="rounded-xl border-twilight-border bg-muted/20 h-12"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Payment Method</Label>
                  <Select 
                    defaultValue="Bank Transfer"
                    onValueChange={(val) => setNewPayment({...newPayment, method: val})}
                  >
                    <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent className="bg-twilight-card border-twilight-border">
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash / Petty Cash</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money (Somnet/Hormuud)</SelectItem>
                      <SelectItem value="Check">Physical Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Payment Date</Label>
                  <Input type="date" className="rounded-xl border-twilight-border bg-muted/20 h-12" />
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button variant="ghost" className="rounded-xl h-12" onClick={() => setIsAddingPayment(false)}>Cancel</Button>
                <Button className="rounded-xl shadow-lg shadow-primary/20 px-8 h-12 flex-1" onClick={handleAddPayment}>Confirm Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-twilight-border rounded-2xl overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-emerald-500">${payments.reduce((acc, p) => acc + (parseFloat(String(p.amount || "0").replace(/[^0-9.-]+/g, "")) || 0), 0).toLocaleString()}</div>

              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Banknote className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Mobile Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-indigo-500">${payments.filter(p => p.method === 'EVC Plus' || p.method === 'Mobile').reduce((acc, p) => acc + (parseFloat(String(p.amount || "0").replace(/[^0-9.-]+/g, "")) || 0), 0).toLocaleString()}</div>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending Clear</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-amber-500">${payments.filter(p => p.status === 'Processing').reduce((acc, p) => acc + (parseFloat(String(p.amount || "0").replace(/[^0-9.-]+/g, "")) || 0), 0).toLocaleString()}</div>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-foreground">{payments.length}</div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
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
              placeholder="Search by ID, invoice, or method..." 
              className="pl-10 bg-muted/30 border-none rounded-xl h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="rounded-xl border-twilight-border text-xs h-10 px-4 gap-2"><Filter className="h-3 w-3" /> Filters</Button>
            <Button variant="ghost" className="rounded-xl border-twilight-border text-xs h-10 px-4 gap-2"><History className="h-3 w-3" /> History</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow className="border-twilight-border hover:bg-transparent bg-muted/30">
              <TableHead className="py-5 px-6">Payment ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right px-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? payments.map((payment) => (
              <TableRow key={payment.id} className="border-twilight-border hover:bg-primary/5 transition-colors group">
                <TableCell className="font-bold py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-emerald-500" />
                    </div>
                    {payment.id}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-twilight-border font-bold text-primary">{payment.invoiceId}</Badge>
                </TableCell>
                <TableCell className="font-medium">{payment.customer}</TableCell>
                <TableCell className="font-black text-emerald-500">${(parseFloat(String(payment.amount).replace(/[^0-9.-]+/g, "")) || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    {payment.method === "EVC Plus" ? <Smartphone className="h-3 w-3" /> : <Banknote className="h-3 w-3" />}
                    {payment.method}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "rounded-full px-3 py-1 font-medium gap-1.5",
                    payment.status === "Cleared" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {payment.status === "Cleared" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {payment.status}
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
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer" onClick={() => toast.info(`Viewing transaction ${payment.id}`)}>
                        <FileText className="h-4 w-4 text-primary" /> Transaction Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer" onClick={() => handleEdit(payment)}>
                        <Edit className="h-4 w-4 text-amber-500" /> Adjust Transaction
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-twilight-border mx-1" />
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer text-rose-500 focus:bg-rose-500/10" onClick={() => handleDelete(payment)}>
                        <Trash2 className="h-4 w-4" /> Void Payment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-20 text-muted-foreground italic">
                  No payment records found.
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
            <DialogTitle className="text-2xl font-black">Adjust Transaction</DialogTitle>
            <DialogDescription>Correcting record for payment ID: {selectedPayment?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label className="font-bold">Transaction Amount</Label>
              <Input defaultValue={selectedPayment?.amount} type="number" className="rounded-xl border-twilight-border bg-muted/20 h-12" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Payment Status</Label>
              <Select defaultValue={selectedPayment?.status.toLowerCase()}>
                <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-twilight-card border-twilight-border">
                  <SelectItem value="cleared">Cleared</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed / Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-twilight-border h-12">Cancel</Button>
            <Button onClick={saveEdit} className="rounded-xl h-12 px-8 shadow-lg shadow-primary/20 flex-1">Save Correction</Button>
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
            <AlertDialogTitle className="text-2xl font-black">Void this Transaction?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to void transaction <span className="font-bold text-foreground">{selectedPayment?.id}</span>? This will reverse the payment status and notify the accounting department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl border-twilight-border h-12 flex-1">Keep Record</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 rounded-xl h-12 flex-1 font-bold">
              Void Transaction
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
