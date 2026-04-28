import { useState } from "react";
import type { Delivery } from "@/types";


import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Truck, 
  Plus, 
  Search, 
  MapPin, 
  Package, 
  User, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  ArrowRight, 
  Filter, 
  ShieldCheck, 
  LocateFixed,
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
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DocumentUploader } from "@/components/invoices/DocumentUploader";
import type { Invoice } from "@/types";

const initialDeliveries: Delivery[] = [];


export default function Delivery() {
  const [deliveries, setDeliveries] = useLocalStorage<Delivery[]>("it_deliveries", initialDeliveries);
  const [invoices] = useLocalStorage<Invoice[]>("it_invoices", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newDispatch, setNewDispatch] = useState({
    invoiceId: "",
    customer: "",
    driver: "",
    destination: "",
    items: 1
  });

  const handleEdit = (delivery: Delivery) => {

    setSelectedDelivery(delivery);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (delivery: Delivery) => {

    setSelectedDelivery(delivery);
    setIsDeleteDialogOpen(true);
  };

  const handleDetails = (delivery: Delivery) => {

    setSelectedDelivery(delivery);
    setIsDetailsOpen(true);
  };

  const confirmDelete = () => {
    setDeliveries(deliveries.filter(d => d.id !== selectedDelivery.id));
    toast.success(`Dispatch record ${selectedDelivery?.id} cancelled and archived.`);
    setIsDeleteDialogOpen(false);
  };

  const saveEdit = () => {
    setDeliveries(deliveries.map(d => d.id === selectedDelivery.id ? selectedDelivery : d));
    toast.success(`Logistics update for ${selectedDelivery?.id} saved.`);
    setIsEditDialogOpen(false);
  };

  const handleAddDelivery = () => {
    setIsAddDialogOpen(true);
  };

  const confirmAdd = () => {
    const delivery: Delivery = {
      id: `DEL-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceId: newDispatch.invoiceId || "INV-0000",
      customer: newDispatch.customer || "New Customer",
      status: "Pending",
      driver: newDispatch.driver || "TBD",
      date: new Date().toISOString().split('T')[0],
      destination: newDispatch.destination || "TBD",
      items: newDispatch.items,
    };

    setDeliveries([delivery, ...deliveries]);
    setIsAddDialogOpen(false);
    toast.success("New dispatch record created!");
  };

  const handlePODUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (selectedDelivery) {
        const updated = { ...selectedDelivery, proofImage: base64String, status: "Delivered" as const };
        setSelectedDelivery(updated);
        setDeliveries(deliveries.map(d => d.id === selectedDelivery.id ? updated : d));
        toast.success("Proof of Delivery uploaded and status updated to Delivered!");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Logistics & Delivery</h1>
          <p className="text-muted-foreground mt-1">Real-time tracking of goods and proof of delivery.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-twilight-border bg-background/50 gap-2 h-11 px-4">
            <LocateFixed className="h-4 w-4" />
            Track Drivers
          </Button>
          <Button 
            className="rounded-xl gap-2 shadow-lg shadow-primary/20 h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            onClick={handleAddDelivery}
          >
            <Plus className="h-4 w-4" />
            Dispatch New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-twilight-border rounded-2xl overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-primary">0</div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending Dispatch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-amber-500">0</div>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-emerald-500">0</div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
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
              placeholder="Search by ID, invoice, or driver..." 
              className="pl-10 bg-muted/30 border-none rounded-xl h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="rounded-xl border-twilight-border text-xs h-10 px-4 gap-2"><Filter className="h-3 w-3" /> Filters</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow className="border-twilight-border hover:bg-transparent bg-muted/30">
              <TableHead className="py-5 px-6">Delivery ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right px-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.length > 0 ? deliveries.map((del) => (
              <TableRow key={del.id} className="border-twilight-border hover:bg-primary/5 transition-colors group">
                <TableCell className="font-bold py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    {del.id}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-twilight-border text-primary font-bold">{del.invoiceId}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-rose-500" />
                    <span className="text-sm truncate max-w-[150px]">{del.destination}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-3 w-3 text-muted-foreground" />
                    {del.driver}
                  </div>
                </TableCell>
                <TableCell className="font-bold">{del.items} units</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "rounded-full px-3 py-1 font-medium gap-1.5",
                    del.status === "Delivered" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    del.status === "In Transit" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    del.status === "Pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {del.status === "Delivered" && <CheckCircle2 className="h-3 w-3" />}
                    {del.status === "In Transit" && <Navigation className="h-3 w-3 animate-pulse" />}
                    {del.status === "Pending" && <Clock className="h-3 w-3" />}
                    {del.status}
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
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer" onClick={() => handleDetails(del)}>
                        <ArrowRight className="h-4 w-4 text-primary" /> Track Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer" onClick={() => handleEdit(del)}>
                        <Edit className="h-4 w-4 text-amber-500" /> Re-assign Driver
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-twilight-border mx-1" />
                      <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer text-rose-500 focus:bg-rose-500/10" onClick={() => handleDelete(del)}>
                        <Trash2 className="h-4 w-4" /> Cancel Dispatch
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground italic">
                  No active dispatches found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </div>

      {/* Dispatch New Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Dispatch Logistics</DialogTitle>
            <DialogDescription>Assign an invoice for delivery and set hub destination.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label className="font-bold">Select Invoice</Label>
              <Select 
                onValueChange={(val) => {
                  const inv = invoices.find(i => i.id === val);
                  setNewDispatch({
                    ...newDispatch, 
                    invoiceId: val,
                    customer: inv?.customer || ""
                  });
                }}
              >
                <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                  <SelectValue placeholder="Choose invoice..." />
                </SelectTrigger>
                <SelectContent className="bg-twilight-card border-twilight-border">
                  {invoices.map(inv => (
                    <SelectItem key={inv.id} value={inv.id}>{inv.id} - {inv.customer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Driver</Label>
                <Select onValueChange={(val) => setNewDispatch({...newDispatch, driver: val})}>
                  <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                    <SelectValue placeholder="Select driver..." />
                  </SelectTrigger>
                  <SelectContent className="bg-twilight-card border-twilight-border">
                    <SelectItem value="Ahmed Omar">Ahmed Omar</SelectItem>
                    <SelectItem value="Liban Ali">Liban Ali</SelectItem>
                    <SelectItem value="Mohamed Gedi">Mohamed Gedi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Items count</Label>
                <Input 
                  type="number" 
                  value={newDispatch.items} 
                  onChange={(e) => setNewDispatch({...newDispatch, items: parseInt(e.target.value)})} 
                  className="rounded-xl border-twilight-border bg-muted/20 h-12" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Destination Hub</Label>
              <Input 
                placeholder="e.g. Bakaara Market, Mogadishu" 
                className="rounded-xl border-twilight-border bg-muted/20 h-12"
                value={newDispatch.destination}
                onChange={(e) => setNewDispatch({...newDispatch, destination: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl border-twilight-border h-12">Cancel</Button>
            <Button onClick={confirmAdd} className="rounded-xl h-12 px-8 shadow-lg shadow-primary/20 bg-primary text-primary-foreground font-bold flex-1">Create Dispatch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Track Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
          {selectedDelivery && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl font-black">
                  <Truck className="h-6 w-6 text-primary" /> Logistics Hub - {selectedDelivery.id}
                </DialogTitle>
                <DialogDescription>Tracking timeline for {selectedDelivery.customer}.</DialogDescription>
              </DialogHeader>
              
              <div className="relative space-y-8 pl-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-twilight-border">
                <div className="relative">
                  <div className="absolute left-[-2.35rem] h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-background shadow-lg">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black">Order Dispatched</p>
                    <p className="text-xs text-muted-foreground">{selectedDelivery.date} - 09:30 AM</p>
                  </div>
                </div>
                <div className="relative">
                  <div className={cn(
                    "absolute left-[-2.35rem] h-6 w-6 rounded-full flex items-center justify-center border-4 border-background shadow-lg",
                    selectedDelivery.status === "Pending" ? "bg-muted" : "bg-emerald-500"
                  )}>
                    {selectedDelivery.status === "Pending" ? <div className="h-2 w-2 rounded-full bg-muted-foreground" /> : <Navigation className="h-3 w-3 text-white" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black">Scanning at Hub</p>
                    <p className="text-xs text-muted-foreground">Carrier: {selectedDelivery.driver}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className={cn(
                    "absolute left-[-2.35rem] h-6 w-6 rounded-full flex items-center justify-center border-4 border-background shadow-lg",
                    selectedDelivery.status === "Delivered" ? "bg-emerald-500" : "bg-primary animate-pulse"
                  )}>
                    {selectedDelivery.status === "Delivered" ? <CheckCircle2 className="h-3 w-3 text-white" /> : <Navigation className="h-3 w-3 text-white" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black">Arrived at {selectedDelivery.destination}</p>
                    <p className="text-xs text-muted-foreground">Final logistics clearance.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border border-twilight-border bg-muted/10 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> Proof of Delivery
                </h4>
                {selectedDelivery.proofImage ? (
                  <div className="relative group overflow-hidden rounded-xl border border-twilight-border">
                    <img src={selectedDelivery.proofImage} alt="Proof" className="w-full aspect-video object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" onClick={() => window.open(selectedDelivery.proofImage)} className="rounded-lg">View Full</Button>
                    </div>
                  </div>
                ) : (
                  <DocumentUploader onUpload={handlePODUpload} />
                )}
              </div>
              
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="rounded-xl border-twilight-border h-12 flex-1">Close</Button>
                <Button className="rounded-xl shadow-lg shadow-primary/20 h-12 flex-1 font-bold">Print Waybill</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit (Re-assign) Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-twilight-card border-twilight-border rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Re-assign Logistics</DialogTitle>
            <DialogDescription>Change driver or destination for record {selectedDelivery?.id}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label className="font-bold">Assign Driver</Label>
              <Select defaultValue={selectedDelivery?.driver}>
                <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-twilight-card border-twilight-border">
                  <SelectItem value="Ahmed Omar">Ahmed Omar</SelectItem>
                  <SelectItem value="Liban Ali">Liban Ali</SelectItem>
                  <SelectItem value="Mohamed Gedi">Mohamed Gedi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Destination Hub</Label>
              <Input defaultValue={selectedDelivery?.destination} className="rounded-xl border-twilight-border bg-muted/20 h-12" />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-twilight-border h-12">Cancel</Button>
            <Button onClick={saveEdit} className="rounded-xl h-12 px-8 shadow-lg shadow-amber-500/20 bg-amber-500 hover:bg-amber-600 text-black font-bold flex-1">Update Dispatch</Button>
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
            <AlertDialogTitle className="text-2xl font-black">Cancel Dispatch?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to cancel the dispatch record for <span className="font-bold text-foreground">{selectedDelivery?.id}</span>? This will alert the driver and the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl border-twilight-border h-12 flex-1">Keep Active</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 rounded-xl h-12 flex-1 font-bold text-white shadow-lg shadow-rose-500/20">
              Cancel Dispatch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
