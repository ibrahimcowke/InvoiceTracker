import { useState } from "react";
import { 
  Cloud, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Lock
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function QuickBooksSync() {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "syncing" | "connected">("disconnected");
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleConnect = () => {
    setStatus("connecting");
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Authenticating with QuickBooks Online...",
        success: () => {
          setStatus("connected");
          setLastSync(new Date().toLocaleString());
          return "Connected to QuickBooks!";
        },
        error: "Connection failed.",
      }
    );
  };

  const handleSync = () => {
    setStatus("syncing");
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 3000)),
      {
        loading: "Fetching invoices from QuickBooks...",
        success: () => {
          setStatus("connected");
          setLastSync(new Date().toLocaleString());
          return "12 new invoices imported from QuickBooks.";
        },
        error: "Sync failed.",
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl gap-2 border-primary/30 hover:bg-primary/5 transition-colors h-11">
          <Cloud className="h-4 w-4 text-primary" />
          QuickBooks Sync
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-twilight-card border-twilight-border rounded-3xl p-0 overflow-hidden shadow-2xl">
        <div className="bg-linear-to-br from-[#2ca01c]/20 to-emerald-500/10 p-8 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center shadow-xl mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/QuickBooks_Logo.svg/1200px-QuickBooks_Logo.svg.png" alt="QB" className="h-12 object-contain" />
          </div>
          <DialogTitle className="text-2xl font-black text-foreground">QuickBooks Online</DialogTitle>
          <DialogDescription className="mt-2 text-muted-foreground max-w-xs">
            Sync your invoices, customers, and payments automatically with our secure QuickBooks integration.
          </DialogDescription>
        </div>

        <div className="p-8 space-y-6">
          <div className={cn(
            "p-4 rounded-2xl border flex items-center justify-between transition-all",
            (status === "connected" || status === "syncing") ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/20 border-twilight-border"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-3 w-3 rounded-full animate-pulse",
                (status === "connected" || status === "syncing") ? "bg-emerald-500" : "bg-muted-foreground"
              )} />
              <div>
                <p className="text-sm font-bold capitalize">{status}</p>
                {lastSync && <p className="text-[10px] text-muted-foreground">Last sync: {lastSync}</p>}
              </div>
            </div>
            {(status === "connected" || status === "syncing") ? (
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">Active</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground border-twilight-border">Inactive</Badge>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest px-1">Integration Features</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Auto-fetch new invoices",
                "Two-way payment syncing",
                "Customer profile matching",
                "Tax calculation alignment"
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {feat}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
            <Lock className="h-4 w-4 text-indigo-500" />
            <p className="text-[10px] font-bold text-indigo-500">AES-256 Encrypted Connection</p>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 gap-3">
          {(status === "connected" || status === "syncing") ? (
            <div className="w-full flex gap-3">
              <Button variant="outline" className="rounded-xl flex-1 border-twilight-border h-12" onClick={() => setStatus("disconnected")} disabled={status === "syncing"}>
                Disconnect
              </Button>
              <Button className="rounded-xl flex-1 bg-[#2ca01c] hover:bg-[#258a18] text-white font-bold h-12 gap-2 shadow-lg shadow-emerald-500/20" onClick={handleSync} disabled={status === "syncing"}>
                <RefreshCw className={cn("h-4 w-4", status === "syncing" && "animate-spin")} />
                {status === "syncing" ? "Syncing..." : "Sync Now"}
              </Button>
            </div>
          ) : (
            <Button className="w-full rounded-xl bg-primary h-12 font-black gap-2 shadow-xl shadow-primary/20" onClick={handleConnect} disabled={status === "connecting"}>
              {status === "connecting" ? "Redirecting to Intuit..." : "Connect QuickBooks Online"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
        <div className="p-4 bg-muted/10 border-t border-twilight-border flex items-center justify-center">
          <Button variant="link" className="text-[10px] text-muted-foreground gap-1 h-auto py-0">
            Learn about QB Security <ExternalLink className="h-2 w-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
