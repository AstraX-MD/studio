"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { BrainCircuit, Sparkles, ShieldCheck, Cpu, DollarSign, Database, Languages, Wand2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function AISubsystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight">AI Subsystem</h2>
          <p className="text-muted-foreground">Orchestrate intelligent routing across global GenAI providers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white/5 border-white/10">Usage History</Button>
          <Button className="glow-primary">Manage API Keys</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Router */}
        <Card className="lg:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-primary" />
              Intelligent Model Router
            </CardTitle>
            <CardDescription>AstraX automatically routes queries to minimize costs and maximize context quality.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Gemini 2.0 Flash', status: 'Primary', load: 12, cost: 'Low' },
                { name: 'GPT-4o Mini', status: 'Secondary', load: 45, cost: 'Medium' },
                { name: 'Claude 3.5 Sonnet', status: 'Off', load: 0, cost: 'High' },
              ].map((provider) => (
                <div key={provider.name} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{provider.name}</span>
                    <Badge variant={provider.status === 'Primary' ? 'default' : 'outline'} className="text-[10px] uppercase font-mono">
                      {provider.status}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-mono">
                      <span>Daily Quota</span>
                      <span>{provider.load}%</span>
                    </div>
                    <Progress value={provider.load} className="h-1" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>COST RATING</span>
                    <span className={cn(
                      provider.cost === 'Low' ? 'text-green-500' : 'text-yellow-500'
                    )}>{provider.cost}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-headline">Fallback Strategy</h4>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Automatic Provider Failover</p>
                  <p className="text-xs text-muted-foreground">Switch to backup models if primary latency exceeds 2.5s.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Tokens */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-secondary" />
              Token Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6 space-y-2">
              <div className="text-4xl font-bold font-mono">$142.20</div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Remaining Monthly Credit</p>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Daily Limit Warning</span>
                  <span>$5.00</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
              </div>
              
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-[10px] text-yellow-200/80 leading-relaxed">
                  Budget nearing threshold. Consider switching to Flash models for non-priority queries to preserve credits.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Services Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'AI ChatBot', icon: Sparkles, desc: 'Context-aware user interaction.' },
            { name: 'Auto-Moderation', icon: ShieldCheck, desc: 'Real-time semantic filtering.' },
            { name: 'Summarization', icon: Database, desc: 'Group chat digest generator.' },
            { name: 'Language Translator', icon: Languages, desc: 'Instant 100+ language support.' },
          ].map((service) => (
            <Card key={service.name} className="bg-card/50 border-white/5 hover:border-primary/30 transition-colors cursor-pointer group">
              <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-xs text-muted-foreground">{service.desc}</p>
                </div>
                <Switch defaultChecked />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
