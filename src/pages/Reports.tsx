import { useState } from "react";
import { 
  FileText, 
  FileSpreadsheet,
  Download, 
  Calendar as CalendarIcon, 
  BarChart3, 
  LineChart as LineChartIcon,
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell,
  Legend,
  Pie,
  PieChart
} from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ReportRevenueData {
  month: string;
  revenue: number;
  profit: number;
  expenses: number;
}


const revenueData: ReportRevenueData[] = [];


interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const categoryData: CategoryData[] = [];



export default function Reports() {
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Financial Reports</h1>
          <p className="text-muted-foreground mt-1">Advanced analytics and performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] rounded-xl border-twilight-border bg-twilight-card/50">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-twilight-card border-twilight-border">
              <SelectItem value="1m">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl border-twilight-border bg-background/50 gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-twilight-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Net Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black text-foreground">$0.00</div>

              <div className="text-emerald-500 flex items-center text-xs font-bold">
                <ArrowUpRight className="h-3 w-3" /> +0%

              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Previous period: $0.00</p>

          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gross Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black text-emerald-500">$0.00</div>

              <div className="text-emerald-500 flex items-center text-xs font-bold">
                <ArrowUpRight className="h-3 w-3" /> +0%

              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Margin: 0%</p>

          </CardContent>
        </Card>

        <Card className="glass border-twilight-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black text-rose-500">$0.00</div>

              <div className="text-rose-500 flex items-center text-xs font-bold">
                <ArrowDownRight className="h-3 w-3" /> 0%

              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">All systems clear</p>

          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Comparison of income and operational costs.</CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-10 w-10 opacity-20" />
                <p className="text-sm">No revenue data available.</p>
              </div>
            )}
          </CardContent>

        </Card>

        <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Profit Margin Trend</CardTitle>
              <CardDescription>Monthly net profit performance.</CardDescription>
            </div>
            <LineChartIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                  />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <LineChartIcon className="h-10 w-10 opacity-20" />
                <p className="text-sm">No profit trends yet.</p>
              </div>
            )}
          </CardContent>

        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass border-twilight-border rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-10 w-10 opacity-20" />
                <p className="text-sm">No categorical data.</p>
              </div>
            )}
          </CardContent>

        </Card>

        <Card className="lg:col-span-2 glass border-twilight-border rounded-2xl overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Top Performing Clients</h3>
            <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
          </div>
          <div className="space-y-6">
          <div className="space-y-6 py-12 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground italic">No client transaction data available for this period.</p>
          </div>

          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1 glass border-twilight-border rounded-2xl p-6 hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="font-bold">Quarterly Tax Report</p>
              <p className="text-xs text-muted-foreground">Generated on May 10, 2024</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto rounded-full hover:bg-primary/10">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </Card>
        <Card className="flex-1 glass border-twilight-border rounded-2xl p-6 hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="font-bold">Annual Profit Summary</p>
              <p className="text-xs text-muted-foreground">Available in Excel format</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto rounded-full hover:bg-primary/10">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
