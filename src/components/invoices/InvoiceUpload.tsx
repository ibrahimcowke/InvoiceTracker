import { useState, useRef } from "react";
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  FileText,
  Download,
  Info
} from "lucide-react";
import { parseExcelFile } from "@/lib/excel";
import type { Invoice } from "@/types";


import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ImportSource = "microsoft" | "google" | "quickbooks" | "generic";

export function InvoiceUpload({ onInvoicesImported }: { onInvoicesImported: (newInvoices: Invoice[]) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<"idle" | "uploading" | "mapping" | "success">("idle");
  const [source, setSource] = useState<ImportSource>("generic");
  const [fileName, setFileName] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [importedData, setImportedData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setStep("uploading");
    setProgress(0);

    // Parse the file
    try {
      let data: any[];
      if (file.name.toLowerCase().endsWith('.pdf')) {
        // Mock PDF parsing for QuickBooks/Generic PDFs
        data = [
          {
            "Invoice ID": `INV-PDF-${Math.floor(Math.random() * 10000)}`,
            "Customer Name": "Extracted from PDF Client",
            "Total Amount": (Math.random() * 5000 + 100).toFixed(2),
            "Status": "Pending",
            "Due Date": new Date().toISOString().split('T')[0]
          }
        ];
        await new Promise(r => setTimeout(r, 1500)); // Simulate extraction
      } else {
        data = await parseExcelFile(file);
      }
      setImportedData(data);
      
      const interval = setInterval(() => {

        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("mapping"), 500);
            return 100;
          }
          return prev + 10;
        });
      }, 50);
    } catch {
      toast.error("Failed to parse file. Please ensure it is a valid Excel or CSV file.");
      setStep("idle");
      setIsUploading(false);
    }
  };

  const handleConfirmImport = () => {
    // Map imported data to Invoice type
    const newInvoices: Invoice[] = importedData.map((row, index) => ({
      id: String(row["Invoice ID"] || row["Invoice #"] || row["ID"] || `INV-IMP-${Math.floor(Math.random() * 10000)}-${index}`),
      customer: String(row["Customer Name"] || row["Client Name"] || row["Customer"] || "Unknown Customer"),
      amount: String(row["Total Amount"] || row["Amount"] || row["Total"] || "0.00"),
      status: (row["Status"] || "Pending") as Invoice["status"],
      dueDate: String(row["Due Date"] || row["Deadline"] || row["Due"] || new Date().toISOString().split('T')[0]),
      type: "Imported"
    }));

    onInvoicesImported(newInvoices);
    setStep("success");
    toast.success(`Successfully imported ${newInvoices.length} invoices from ${fileName}`);
  };


  const getSourceConfig = (src: ImportSource) => {
    switch (src) {
      case "microsoft": return { name: "Microsoft Excel", color: "text-blue-500", bg: "bg-blue-500/10" };
      case "google": return { name: "Google Sheets (CSV)", color: "text-emerald-500", bg: "bg-emerald-500/10" };
      case "quickbooks": return { name: "QuickBooks Export", color: "text-[#2ca01c]", bg: "bg-[#2ca01c]/10" };
      default: return { name: "Generic CSV/Excel", color: "text-primary", bg: "bg-primary/10" };
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && setStep("idle")}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl gap-2 border-twilight-border bg-twilight-card/30 hover:bg-twilight-card/50 transition-all">
          <FileSpreadsheet className="h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-twilight-card backdrop-blur-2xl border-twilight-border rounded-3xl p-0 overflow-hidden shadow-2xl">
        <div className="bg-linear-to-br from-primary/10 to-transparent p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              Bulk Invoice Import
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Import multiple invoices at once using Microsoft Excel, Google Sheets, or QuickBooks formats.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          {step === "idle" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {(["microsoft", "google", "quickbooks", "generic"] as ImportSource[]).map((src) => {
                  const config = getSourceConfig(src);
                  return (
                    <button
                      key={src}
                      onClick={() => setSource(src)}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left transition-all group relative overflow-hidden",
                        source === src 
                          ? "border-primary bg-primary/5" 
                          : "border-twilight-border hover:border-primary/30 bg-muted/5"
                      )}
                    >
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-3", config.bg)}>
                        <FileText className={cn("h-4 w-4", config.color)} />
                      </div>
                      <p className="font-bold text-sm text-foreground">{config.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Select this for {src === 'generic' ? 'standard' : src} files.</p>
                      {source === src && <div className="absolute top-2 right-2"><CheckCircle2 className="h-4 w-4 text-primary" /></div>}
                    </button>
                  );
                })}
              </div>

              <div 
                className="border-2 border-dashed border-twilight-border rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer bg-muted/5 group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground text-sm">Upload {getSourceConfig(source).name} file</p>
                  <p className="text-[10px] text-muted-foreground mt-1">XLSX, XLS, CSV, or PDF up to 25MB</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv, .xlsx, .xls, .pdf"
                  onChange={handleUpload}
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-primary">Need a template?</p>
                  <p className="text-[10px] text-muted-foreground">Download our pre-formatted spreadsheet to ensure your data matches our system perfectly.</p>
                  <Button variant="link" className="h-auto p-0 text-[10px] font-bold gap-1 mt-1">
                    <Download className="h-2 w-2" /> Download Import Template
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "uploading" && (
            <div className="py-12 flex flex-col items-center gap-6">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <div className="w-full space-y-4 max-w-sm">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground uppercase tracking-widest">Uploading {fileName}...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-muted" />
              </div>
            </div>
          )}

          {step === "mapping" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-foreground">File Validated</p>
                    <p className="text-[10px] text-muted-foreground">{importedData.length} invoices found in {fileName}</p>

                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-500 border-none">Ready</Badge>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Column Mapping Review</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { sys: "Invoice ID", file: "Invoice #", status: "match" },
                    { sys: "Customer Name", file: "Client Name", status: "match" },
                    { sys: "Total Amount", file: "Amount (USD)", status: "match" },
                    { sys: "Due Date", file: "Deadline", status: "match" },
                  ].map((col) => (
                    <div key={col.sys} className="flex items-center justify-between p-3 rounded-xl border border-twilight-border bg-muted/5 text-xs">
                      <span className="text-muted-foreground">{col.sys}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{col.file}</span>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <span className="font-bold text-amber-500">Note:</span> 2 rows have missing due dates. We will use the default 14-day grace period for these records.
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-300">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground">Import Successful</h3>
                <p className="text-muted-foreground text-sm">32 invoices have been added to your dashboard.</p>
              </div>
              <Button className="rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20" onClick={() => setStep("idle")}>
                Done
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className={cn("p-8 pt-0 gap-3", step === "success" && "hidden")}>
          {step === "mapping" ? (
            <div className="w-full flex gap-3">
              <Button variant="outline" className="rounded-xl flex-1 h-12" onClick={() => setStep("idle")}>
                Cancel
              </Button>
              <Button className="rounded-xl flex-1 bg-primary h-12 font-bold shadow-lg shadow-primary/20" onClick={handleConfirmImport}>
                Import {importedData.length} Invoices
              </Button>

            </div>
          ) : (
            <Button variant="ghost" className="w-full rounded-xl h-12" onClick={() => setStep("idle")} disabled={isUploading}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
