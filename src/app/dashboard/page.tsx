"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Activity, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

const messageData = [
  { day: "Mon", messages: 2400 },
  { day: "Tue", messages: 3200 },
  { day: "Wed", messages: 1800 },
  { day: "Thu", messages: 4500 },
  { day: "Fri", messages: 3900 },
  { day: "Sat", messages: 5200 },
  { day: "Sun", messages: 4800 },
]

const protectionData = [
  { time: "00:00", threats: 12 },
  { time: "04:00", threats: 8 },
  { time: "08:00", threats: 45 },
  { time: "12:00", threats: 32 },
  { time: "16:00", threats: 15 },
  { time: "20:00", threats: 62 },
  { time: "23:59", threats: 24 },
]

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight">System Console</h2>
          <p className="text-muted-foreground">Welcome back, Administrator. Your node is operating within optimal parameters.</p>
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-2 font-mono uppercase text-[10px] tracking-widest bg-white/5">
          <RefreshCw className="w-3 h-3" />
          Refresh Stats
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -mr-12 -mt-12" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-headline">Total Messages</CardTitle>
            <MessageSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">142,593</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12.5% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-headline">Active Sessions</CardTitle>
            <Activity className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">824</div>
            <div className="flex items-center text-xs text-red-500 mt-1">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              -2.1% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-headline">Threats Blocked</CardTitle>
            <ShieldCheck className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">3,822</div>
            <div className="flex items-center text-xs text-green-500 mt-1 font-mono uppercase">Warden Active</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-headline">Avg. Latency</CardTitle>
            <Zap className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">142ms</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              Global Average
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="font-headline">Traffic Analysis</CardTitle>
            <CardDescription>Daily message volume across all connected sessions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#525252" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#525252" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(151, 71, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#0E0B13', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                />
                <Bar 
                  dataKey="messages" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="font-headline">Warden Activity</CardTitle>
            <CardDescription>Threats mitigated by Warden Security in last 24h.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={protectionData}>
                <defs>
                  <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#525252" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#525252" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0E0B13', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="hsl(var(--secondary))" 
                  fillOpacity={1} 
                  fill="url(#colorThreat)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="font-headline">Live Event Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 font-mono text-xs">
              {[
                { type: "SUCCESS", msg: "SESSION-B42: Authentication successful", time: "2s ago" },
                { type: "INFO", msg: "WARDEN: Anti-link protection triggered in GROUP-93", time: "5s ago" },
                { type: "WARN", msg: "API-ROUTER: Switching to Gemini-Pro fallback (Cost limit)", time: "12s ago" },
                { type: "SUCCESS", msg: "PLUGIN: Economy Module v2.1.0 loaded", time: "1m ago" },
                { type: "INFO", msg: "USER-9941: Role changed to [SUDO]", time: "2m ago" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4 border-b border-white/5 pb-2 last:border-0">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold w-16 text-center",
                    log.type === "SUCCESS" ? "bg-green-500/10 text-green-500" : 
                    log.type === "INFO" ? "bg-blue-500/10 text-blue-500" :
                    "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {log.type}
                  </span>
                  <span className="flex-1 text-muted-foreground">{log.msg}</span>
                  <span className="text-white/20 whitespace-nowrap">{log.time}</span>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 p-0 text-primary h-auto text-xs font-headline">View Full Stream ↗</Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="font-headline">Quick Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Public Mode", active: true },
              { label: "Anti-Spam", active: true },
              { label: "Economy Hub", active: false },
              { label: "AI Translation", active: true },
              { label: "Maintenance", active: false },
            ].map((control) => (
              <div key={control.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm font-medium">{control.label}</span>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  control.active ? "bg-green-500 shadow-[0_0_8px_hsl(var(--chart-2))]" : "bg-white/10"
                )} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
