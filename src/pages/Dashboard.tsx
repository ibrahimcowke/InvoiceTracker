import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Bell
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { RevenueData, ClientData, Invoice, Payment } from "@/types";




export default function Dashboard() {
  const [invoices] = useLocalStorage<Invoice[]>("it_invoices", []);
  const [payments] = useLocalStorage<Payment[]>("it_payments", []);

  // Calculate KPIs
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'Paid').length;
  const pendingInvoices = invoices.filter(i => i.status === 'Pending').length;
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length;

  const kpis = [
    { 
      title: "Total Invoices", 
      value: totalInvoices.toString(), 
      change: "+0%", 
      trend: "up", 
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      title: "Paid Invoices", 
      value: paidInvoices.toString(), 
      change: "+0%", 
      trend: "up", 
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    { 
      title: "Pending Invoices", 
      value: pendingInvoices.toString(), 
      change: "-0%", 
      trend: "down", 
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    { 
      title: "Overdue Invoices", 
      value: overdueInvoices.toString(), 
      change: "+0%", 
      trend: "up", 
      icon: AlertCircle,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10"
    },
  ];

  // Calculate Financials
  const totalBilled = invoices.reduce((acc, inv) => acc + parseFloat(inv.amount || "0"), 0);
  const totalCollected = payments.reduce((acc, pay) => acc + parseFloat(pay.amount || "0"), 0);
  const outstanding = totalBilled - totalCollected;

  const financials = [
    { title: "Total Billed", value: `$${totalBilled.toLocaleString()}`, icon: DollarSign },
    { title: "Total Collected", value: `$${totalCollected.toLocaleString()}`, icon: CheckCircle2 },
    { title: "Outstanding", value: `$${outstanding.toLocaleString()}`, icon: AlertCircle },
    { title: "Collection Rate", value: totalBilled > 0 ? `${Math.round((totalCollected / totalBilled) * 100)}%` : "0%", icon: TrendingUp },
  ];

  // Generate Revenue Data (Mocked for now but based on real totals)
  const dynamicRevenueData: RevenueData[] = [
    { name: 'Last Month', amount: totalBilled * 0.8, collected: totalCollected * 0.7 },
    { name: 'This Month', amount: totalBilled, collected: totalCollected },
  ];

  // Generate Client Data
  const dynamicClientData: ClientData[] = Array.from(
    invoices.reduce((acc, inv) => {
      acc.set(inv.customer, (acc.get(inv.customer) || 0) + parseFloat(inv.amount || "0"));
      return acc;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 4);

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#94a3b8"];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Executive Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. View your financial health at a glance.</p>
        </div>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass border-twilight-border overflow-hidden group hover:border-primary/50 transition-all duration-500 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className={cn("p-2 rounded-lg transition-colors", kpi.bgColor)}>
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center mt-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-rose-500 mr-1" />
                )}
                <span className={cn("text-xs font-medium", kpi.trend === "up" ? "text-emerald-500" : "text-rose-500")}>
                  {kpi.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financials.map((item) => (
          <Card key={item.title} className="bg-primary/5 border-primary/10 rounded-2xl hover:bg-primary/10 transition-colors cursor-default">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{item.title}</p>
                <p className="text-xl font-bold tracking-tight">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass border-twilight-border rounded-2xl overflow-hidden shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trends</CardTitle>
            <CardDescription>Monthly billed vs collected amounts</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {dynamicRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicRevenueData}>

                  <defs>
                    <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                    itemStyle={{ fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorBilled)" strokeWidth={2} />
                  <Area type="monotone" dataKey="collected" stroke="#10b981" fillOpacity={1} fill="url(#colorCollected)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-10 w-10 opacity-20" />
                <p className="text-sm">No data to display yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl overflow-hidden shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Client Distribution</CardTitle>
            <CardDescription>Revenue by top clients</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center justify-center">
            {dynamicClientData.length > 0 ? (
              <>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dynamicClientData}

                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dynamicClientData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  {dynamicClientData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-xs text-muted-foreground truncate">{entry.name}</span>
                    </div>
                  ))}

                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-10 w-10 opacity-20" />
                <p className="text-sm">No distribution data.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Aging */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass border-twilight-border rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Outstanding Aging</CardTitle>
              <CardDescription>Unpaid balances by days overdue</CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Current (0-30 days)", value: `$${outstanding.toLocaleString()}`, percent: 100, color: "bg-blue-500" },
                { label: "31-60 days", value: "$0", percent: 0, color: "bg-amber-500" },
                { label: "61-90 days", value: "$0", percent: 0, color: "bg-orange-500" },
                { label: "90+ days", value: "$0", percent: 0, color: "bg-rose-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl overflow-hidden shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Smart Notifications</CardTitle>
            <CardDescription>AI-driven alerts for your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-12 flex flex-col items-center justify-center text-center">
            <Bell className="h-10 w-10 text-muted-foreground/20 mb-2" />
            <p className="text-sm text-muted-foreground">No active alerts. Your dashboard is clear!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
