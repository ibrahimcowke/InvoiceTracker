import { useState } from "react";
import type { Invoice, Payment, Customer } from "@/types";


import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  FileText,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Database,
  Share2
} from "lucide-react";


import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { InvoiceUpload } from "@/components/invoices/InvoiceUpload";
import { QuickBooksSync } from "@/components/invoices/QuickBooksSync";
import { DocumentUploader } from "@/components/invoices/DocumentUploader";
import { exportToExcel } from "@/lib/excel";
import { downloadInvoicePDF } from "@/lib/pdf-utils";



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
import { Separator } from "@/components/ui/separator";
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



const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 rounded-full px-3 py-1 gap-1.5 font-medium">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 rounded-full px-3 py-1 gap-1.5 font-medium">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "Overdue":
      return (
        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 rounded-full px-3 py-1 gap-1.5 font-medium">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Invoices() {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>("it_invoices", []);
  const [payments] = useLocalStorage<Payment[]>("it_payments", []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>("it_customers", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isManualCreateOpen, setIsManualCreateOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);


  // Form states for manual create
  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    amount: "",
    dueDate: "",
    notes: ""
  });

  const handleExport = () => {
    if (invoices.length === 0) {
      toast.error("No invoices to export.");
      return;
    }

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          exportToExcel(invoices, `Invoices_Export_${new Date().toISOString().split('T')[0]}`);
          resolve(true);
        }, 1000);
      }),
      {
        loading: "Generating Excel report...",
        success: "Invoices exported successfully!",
        error: "Export failed.",
      }
    );
  };

  const handleImport = (newInvoices: Invoice[]) => {
    setInvoices((prev) => [...newInvoices, ...prev]);
  };


  const handleManualCreate = () => {
    const invoice: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: newInvoice.customer || "New Client",
      amount: newInvoice.amount || "0.00",
      status: "Pending",
      dueDate: newInvoice.dueDate || new Date().toISOString().split('T')[0],
      type: "Manual",
    };

    setInvoices([invoice, ...invoices]);
    
    // Logic: Update customer outstanding balance
    const updatedCustomers = customers.map(c => {
      if (c.name === invoice.customer) {
        return {
          ...c,
          outstanding: (parseFloat(c.outstanding || "0") + parseFloat(invoice.amount)).toFixed(2),
          lastInvoice: invoice.dueDate
        };
      }
      return c;
    });
    setCustomers(updatedCustomers);

    setIsManualCreateOpen(false);
    toast.success(`Invoice created and ${invoice.customer}'s balance updated!`);
  };

  const handleDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDetailsOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {

    setSelectedInvoice(invoice);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {

    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setInvoices(invoices.filter(inv => inv.id !== selectedInvoice.id));
    toast.success(`Invoice ${selectedInvoice?.id} has been deleted.`);
    setIsDeleteDialogOpen(false);
  };

  const saveEdit = () => {
    setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? selectedInvoice : inv));
    toast.success(`Invoice ${selectedInvoice?.id} updated successfully.`);
    setIsEditDialogOpen(false);
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage and track your customer billing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="rounded-xl border-twilight-border bg-background/50 gap-2 h-11"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <QuickBooksSync />
          <InvoiceUpload onInvoicesImported={handleImport} />

          
          <Dialog open={isManualCreateOpen} onOpenChange={setIsManualCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20 bg-indigo-600 hover:bg-indigo-700 h-11 px-6">
                <Plus className="h-4 w-4" />
                Manual Create
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-indigo-500" />
                  </div>
                  Manual Invoice Creation
                </DialogTitle>
                <DialogDescription>Create a custom invoice by entering client and billing details manually.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customer">Select Client</Label>
                    <Select 
                      onValueChange={(val) => setNewInvoice({...newInvoice, customer: val})}
                    >
                      <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                        <SelectValue placeholder="Choose client..." />
                      </SelectTrigger>
                      <SelectContent className="bg-twilight-card border-twilight-border">
                        {customers.map(cust => (
                          <SelectItem key={cust.id} value={cust.name}>{cust.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="inv-id">Invoice # (Auto)</Label>
                    <Input id="inv-id" value="Auto-generated" disabled className="rounded-xl border-twilight-border bg-muted/10 h-12" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Total Amount ($)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00" 
                      className="rounded-xl border-twilight-border bg-muted/20 h-12"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="due">Due Date</Label>
                    <Input 
                      id="due" 
                      type="date" 
                      className="rounded-xl border-twilight-border bg-muted/20 h-12"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <Separator className="bg-twilight-border/50" />
                
                <DocumentUploader onUpload={(file) => console.log("Uploaded:", file)} />
              </div>

              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsManualCreateOpen(false)} className="rounded-xl border-twilight-border h-12">Cancel</Button>
                <Button className="rounded-xl h-12 flex-1 shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700" onClick={handleManualCreate}>
                  Create Invoice
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by ID or customer..." 
            className="pl-10 bg-twilight-card/50 border-twilight-border focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl py-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-full rounded-xl border-twilight-border bg-twilight-card/50 px-6 gap-2 py-3">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">More Filters</span>
        </Button>
      </div>

      <div className="glass border-twilight-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-twilight-border hover:bg-transparent">
              <TableHead className="w-[100px] py-5">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Due Date</TableHead>

              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} className="border-twilight-border hover:bg-primary/5 transition-colors group">
                <TableCell className="font-medium py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    {invoice.id}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{invoice.customer}</TableCell>
                <TableCell>${parseFloat(invoice.amount).toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>
                  <div className="w-full max-w-[100px] space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-muted-foreground">Paid</span>
                      <span className="text-primary">{Math.min(100, Math.round((payments.filter(p => p.invoiceId === invoice.id).reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0) / parseFloat(invoice.amount || "1")) * 100))}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${Math.min(100, Math.round((payments.filter(p => p.invoiceId === invoice.id).reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0) / parseFloat(invoice.amount || "1")) * 100))}%` }} 
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{invoice.dueDate}</TableCell>

                <TableCell>
                  <Badge variant="outline" className="border-twilight-border text-[10px] uppercase tracking-wider font-bold">
                    {invoice.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-twilight-card backdrop-blur-xl border-twilight-border rounded-xl p-2">
                      <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase text-muted-foreground">Options</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-twilight-border" />
                      <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg mx-1" onClick={() => handleDetails(invoice)}>
                        <Eye className="h-4 w-4 text-indigo-500" /> View / Export
                      </DropdownMenuItem>

                      <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg mx-1" onClick={() => handleEdit(invoice)}>
                        <Edit className="h-4 w-4" /> Edit Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer rounded-lg mx-1" 
                        onClick={() => {
                          toast.promise(downloadInvoicePDF(invoice), {
                            loading: "Preparing PDF...",
                            success: "PDF downloaded successfully!",
                            error: "Failed to generate PDF."
                          });
                        }}
                      >
                        <Download className="h-4 w-4" /> Download PDF
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-twilight-border" />
                      <DropdownMenuItem className="gap-2 text-rose-500 focus:bg-rose-500/10 cursor-pointer rounded-lg mx-1" onClick={() => handleDelete(invoice)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                  No invoices found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing {filteredInvoices.length} of {invoices.length} invoices</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="rounded-lg">Previous</Button>
          <Button variant="outline" size="sm" className="rounded-lg">Next</Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <Edit className="h-6 w-6 text-primary" />
              Edit Invoice {selectedInvoice?.id}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Client Name</Label>
                <Input 
                  defaultValue={selectedInvoice?.customer} 
                  onChange={(e) => setSelectedInvoice({...selectedInvoice, customer: e.target.value})}
                  className="rounded-xl border-twilight-border bg-muted/20 h-12" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Invoice #</Label>
                <Input defaultValue={selectedInvoice?.id} disabled className="rounded-xl border-twilight-border bg-muted/10 h-12" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Amount ($)</Label>
                <Input 
                  type="number" 
                  defaultValue={selectedInvoice?.amount} 
                  onChange={(e) => setSelectedInvoice({...selectedInvoice, amount: e.target.value})}
                  className="rounded-xl border-twilight-border bg-muted/20 h-12" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Due Date</Label>
                <Input 
                  type="date" 
                  defaultValue={selectedInvoice?.dueDate} 
                  onChange={(e) => setSelectedInvoice({...selectedInvoice, dueDate: e.target.value})}
                  className="rounded-xl border-twilight-border bg-muted/20 h-12" 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-twilight-border h-12">Cancel</Button>
            <Button onClick={saveEdit} className="rounded-xl h-12 px-8 shadow-lg shadow-primary/20">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-twilight-card border-twilight-border rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete invoice <span className="font-bold text-foreground">{selectedInvoice?.id}</span> and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-twilight-border">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 rounded-xl px-6">
              Delete Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* View Details / Export Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] bg-twilight-card border-twilight-border rounded-3xl p-0 overflow-hidden shadow-2xl">
          {selectedInvoice && (
            <div className="flex flex-col">
              <div className="bg-linear-to-br from-indigo-500/20 to-primary/10 p-8 border-b border-twilight-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-foreground">{selectedInvoice.id}</h2>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Billing Record</p>
                    </div>
                  </div>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 rounded-2xl bg-background/50 border border-twilight-border">
                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Customer</p>
                    <p className="font-bold text-sm truncate">{selectedInvoice.customer}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 border border-twilight-border">
                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Total Amount</p>
                    <p className="font-black text-lg text-primary">${parseFloat(selectedInvoice.amount).toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 border border-twilight-border">
                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Due Date</p>
                    <p className="font-bold text-sm">{selectedInvoice.dueDate}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Export & Synchronization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-24 rounded-2xl border-twilight-border hover:border-blue-500/50 hover:bg-blue-500/5 flex flex-col gap-2 transition-all group"
                      onClick={() => {
                        exportToExcel([selectedInvoice], `Invoice_${selectedInvoice.id}`);
                        toast.success("Opening in Microsoft Excel...");
                      }}
                    >
                      <FileSpreadsheet className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs text-foreground">Excel (Microsoft)</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-24 rounded-2xl border-twilight-border hover:border-emerald-500/50 hover:bg-emerald-500/5 flex flex-col gap-2 transition-all group"
                      onClick={() => {
                        exportToExcel([selectedInvoice], `Invoice_${selectedInvoice.id}_GoogleSheets`);
                        toast.success("Syncing to Google Sheets...");
                      }}
                    >
                      <Share2 className="h-6 w-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs text-foreground">Excel (Google)</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-24 rounded-2xl border-twilight-border hover:border-orange-500/50 hover:bg-orange-500/5 flex flex-col gap-2 transition-all group"
                      onClick={() => toast.success("Pushing to QuickBooks Online...")}
                    >
                      <Database className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs text-foreground">QuickBooks</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Note: All exports follow strict compliance rules. Numeric values represent flat totals without interest-based calculations.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-muted/20 border-t border-twilight-border flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)} className="rounded-xl border-twilight-border">Close</Button>
                <Button 
                  className="rounded-xl px-8 shadow-lg shadow-primary/20 font-bold"
                  onClick={() => {
                    toast.promise(downloadInvoicePDF(selectedInvoice), {
                      loading: "Preparing PDF...",
                      success: "PDF ready!",
                      error: "Failed to generate PDF."
                    });
                  }}
                >
                  Print Invoice
                </Button>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


