import { useState } from "react";
import { 
  Building2, 
  CreditCard, 
  Bell, 
  Globe, 
  Save,
  Palette,
  LayoutDashboard,
  FileText,
  Smartphone,
  Users,
  Key,
  Upload,
  Trash2,
  Plus,
  Cloud,
  ShieldCheck,
  Mail,
  Percent,
  History,
  Lock,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  const navItems = [
    { id: "general", label: "General", icon: LayoutDashboard },
    { id: "organization", label: "Company Profile", icon: Building2 },
    { id: "invoices", label: "Invoice Rules", icon: FileText },
    { id: "taxes", label: "Taxes & Fees", icon: Percent },
    { id: "payments", label: "Payment Gateways", icon: CreditCard },
    { id: "notifications", label: "Email & Alerts", icon: Bell },
    { id: "team", label: "Team Access", icon: Users },
    { id: "integrations", label: "Integrations", icon: Cloud },
    { id: "security", label: "Security & API", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your organization's global preferences and workflows.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-twilight-border h-12 px-6 gap-2">
            <History className="h-4 w-4" /> Audit Logs
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-xl gap-2 shadow-lg shadow-primary/20 h-12 px-8">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 space-y-2">
          <div className="bg-twilight-card/30 border border-twilight-border rounded-2xl p-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                  {item.label}
                </div>
                {activeTab === item.id && <ChevronRight className="h-3 w-3" />}
              </button>
            ))}
          </div>

          <Card className="glass border-twilight-border rounded-2xl p-4 bg-primary/5 border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">System Status</p>
            </div>
            <p className="text-xs text-muted-foreground">All systems operational. Last backup 2h ago.</p>
          </Card>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
            {/* GENERAL SETTINGS */}
            <TabsContent value="general" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Region & Formatting</CardTitle>
                  <CardDescription>Adjust localization and primary display units.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English (US)</SelectItem>
                          <SelectItem value="so">Somali (Af Soomaali)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Default Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="rounded-xl border-twilight-border bg-muted/20 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
                          <SelectItem value="sos">SOS - Somali Shilling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Palette className="h-5 w-5 text-indigo-500" /> Interface Theme</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border-2 border-primary rounded-2xl p-4 flex flex-col items-center gap-4 bg-twilight-bg/50">
                    <div className="h-20 w-full bg-twilight-bg rounded-lg border border-twilight-border" />
                    <span className="font-bold text-sm">Twilight Dark</span>
                  </div>
                  <div className="border-2 border-twilight-border rounded-2xl p-4 flex flex-col items-center gap-4 opacity-50 cursor-not-allowed">
                    <div className="h-20 w-full bg-white rounded-lg border border-slate-200" />
                    <span className="font-bold text-sm">Crystal Light</span>
                  </div>
                  <div className="border-2 border-twilight-border rounded-2xl p-4 flex flex-col items-center gap-4 opacity-50 cursor-not-allowed">
                    <div className="h-20 w-full bg-slate-900 rounded-lg border border-slate-700" />
                    <span className="font-bold text-sm">Onyx Black</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ORGANIZATION PROFILE */}
            <TabsContent value="organization" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Company Profile</CardTitle>
                  <CardDescription>Public information used on your invoices and reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 space-y-4">
                      <Label>Brand Identity</Label>
                      <div className="h-40 w-full rounded-2xl border-2 border-dashed border-twilight-border bg-muted/10 flex flex-col items-center justify-center gap-3">
                        <Upload className="h-6 w-6 text-primary" />
                        <p className="text-[10px] text-muted-foreground text-center px-4">Upload Logo<br/>(PNG/JPG, 2MB max)</p>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Legal Business Name</Label>
                        <Input defaultValue="Xarash Trading Co." className="rounded-xl border-twilight-border bg-muted/20 h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>Registration Number</Label>
                        <Input defaultValue="REG-SOM-482910" className="rounded-xl border-twilight-border bg-muted/20 h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>VAT / Tax ID</Label>
                        <Input defaultValue="VAT-992-102" className="rounded-xl border-twilight-border bg-muted/20 h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>Support Email</Label>
                        <Input defaultValue="support@xarash.so" className="rounded-xl border-twilight-border bg-muted/20 h-12" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Business Address</Label>
                    <Textarea defaultValue="KM4 Street, Hodan District, Mogadishu, Somalia" className="rounded-xl border-twilight-border bg-muted/20 min-h-[80px]" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* INVOICE RULES */}
            <TabsContent value="invoices" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Sequencing & Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Auto-Increment Start</Label>
                      <Input type="number" defaultValue="1000" className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>ID Prefix</Label>
                      <Input defaultValue="INV-" className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Grace Period (Days)</Label>
                      <Input type="number" defaultValue="14" className="rounded-xl h-11" />
                    </div>
                  </div>
                  <Separator className="bg-twilight-border" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Electronic Signatures</Label>
                        <p className="text-xs text-muted-foreground">Require customer signature on delivery.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Partial Payments</Label>
                        <p className="text-xs text-muted-foreground">Allow customers to pay invoices in installments.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAXES & FEES */}
            <TabsContent value="taxes" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2"><Percent className="h-5 w-5 text-emerald-500" /> Tax Configuration</CardTitle>
                    <CardDescription>Manage global and regional tax settings.</CardDescription>

                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg gap-2">
                    <Plus className="h-4 w-4" /> Add Configuration

                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Standard VAT", rate: "15%", type: "Sales Tax", active: true },
                    { name: "Service Tax", rate: "5%", type: "Services", active: true },
                    { name: "Import Duty", rate: "10%", type: "Logistics", active: false },
                  ].map((tax) => (
                    <div key={tax.name} className="flex items-center justify-between p-4 rounded-xl border border-twilight-border bg-muted/5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-500">
                          %
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tax.name}</p>
                          <p className="text-[10px] text-muted-foreground">{tax.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-lg">{tax.rate}</span>

                        <Switch defaultChecked={tax.active} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Late fees removed due to religious compliance requirements */}

            </TabsContent>

            {/* PAYMENTS */}
            <TabsContent value="payments" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Smartphone className="h-5 w-5 text-emerald-500" /> Mobile Money</CardTitle>
                  <CardDescription>Setup your primary payment numbers.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>EVC Plus (Hormuud)</Label>
                    <Input defaultValue="615550001" className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sahal (Golis)</Label>
                    <Input placeholder="Not set" className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>eDahab (Somtel)</Label>
                    <Input defaultValue="625550001" className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Premier Wallet</Label>
                    <Input defaultValue="8829100" className="rounded-xl h-12" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Card Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-12 border-2 border-dashed border-twilight-border rounded-3xl flex flex-col items-center gap-4">
                    <Lock className="h-10 w-10 text-muted-foreground/30" />
                    <div className="text-center">
                      <p className="font-bold text-lg">Stripe Integration</p>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">Connect your Stripe account to accept international credit card payments securely.</p>
                    </div>
                    <Button className="rounded-xl bg-[#635bff] hover:bg-[#5a52e0] text-white px-8 font-bold">Connect Stripe</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NOTIFICATIONS */}
            <TabsContent value="notifications" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Mail className="h-5 w-5 text-indigo-500" /> Email Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-twilight-border hover:border-primary/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-bold text-sm">New Invoice Generated</p>
                          <p className="text-[10px] text-muted-foreground">Sent to customer when invoice is created.</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-twilight-border hover:border-primary/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-4">
                        <AlertCircle className="h-5 w-5 text-rose-500" />
                        <div>
                          <p className="font-bold text-sm">Overdue Reminder</p>
                          <p className="text-[10px] text-muted-foreground">Sent 3 days after due date.</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-twilight-border hover:border-primary/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="font-bold text-sm">Payment Receipt</p>
                          <p className="text-[10px] text-muted-foreground">Sent when payment is cleared.</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* INTEGRATIONS */}
            <TabsContent value="integrations" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2"><Cloud className="h-5 w-5 text-[#2ca01c]" /> Accounting Sync</CardTitle>
                    <CardDescription>Connect your financial ecosystem.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6 p-6 rounded-2xl border border-twilight-border bg-muted/5">
                    <div className="h-16 w-16 rounded-xl bg-white flex items-center justify-center p-2 shadow-lg">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/QuickBooks_Logo.svg/1200px-QuickBooks_Logo.svg.png" alt="QB" className="object-contain" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-lg">Intuit QuickBooks</p>
                      <p className="text-sm text-muted-foreground">Sync invoices and payments automatically.</p>
                    </div>
                    <Button className="rounded-xl bg-[#2ca01c] hover:bg-[#258a18] text-white px-6 font-bold">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SECURITY & API */}
            <TabsContent value="security" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Key className="h-5 w-5 text-amber-500" /> API Keys</CardTitle>
                  <CardDescription>Authentication credentials for developer access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl border border-twilight-border bg-muted/5 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-bold">Production Secret Key</p>
                        <p className="text-[10px] text-muted-foreground font-mono">tk_live_4829****************3291</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg">Rotate Key</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-twilight-border rounded-2xl overflow-hidden border-rose-500/20 bg-rose-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-rose-500"><Trash2 className="h-5 w-5" /> Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-rose-500/20">
                  <div>
                    <p className="font-bold text-sm">Reset Workspace</p>
                    <p className="text-xs text-muted-foreground">Permanently delete all data and configurations.</p>
                  </div>
                  <Button variant="destructive" size="sm" className="rounded-lg px-6">Factory Reset</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
