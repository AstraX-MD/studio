"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ShieldAlert, Trash2, Ban, Link2, Ghost, UserX, AlertTriangle, ShieldCheck } from "lucide-react"

export default function WardenSecurityPage() {
  const protections = [
    { id: 'anti-link', name: 'Anti-Link System', icon: Link2, desc: 'Block and punish users sending unauthorized external links.', status: true, severity: 'High' },
    { id: 'anti-spam', name: 'Flood Protection', icon: AlertTriangle, desc: 'Prevent automated command or message spamming in groups.', status: true, severity: 'Medium' },
    { id: 'anti-delete', name: 'Delete Recovery', icon: Ghost, desc: 'Log and restore deleted messages with sender tracking.', status: false, severity: 'Low' },
    { id: 'anti-bot', name: 'Malicious Bot Filter', icon: Ban, desc: 'Detect and kick suspicious user agents or bot numbers.', status: true, severity: 'High' },
    { id: 'anti-nsfw', name: 'Content Warden', icon: ShieldCheck, desc: 'AI-powered filtering for inappropriate media/text content.', status: true, severity: 'Critical' },
    { id: 'anti-toxic', name: 'Toxicity Filter', icon: UserX, desc: 'Detect and warn for hate speech or harassment using AI.', status: true, severity: 'Medium' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-primary" />
            Warden Security Hub
          </h2>
          <p className="text-muted-foreground">Multi-layer defense and automated moderation suite.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
            Emergency Lockdown
          </Button>
          <Button className="glow-primary">Global Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {protections.map((p) => (
          <Card key={p.id} className="bg-card/50 border-white/5 relative overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <Badge variant={p.status ? "default" : "secondary"} className="text-[10px] font-mono">
                  {p.status ? "ARMED" : "DISABLED"}
                </Badge>
              </div>
              <CardTitle className="mt-4 font-headline text-xl">{p.name}</CardTitle>
              <CardDescription className="text-xs mt-1 leading-relaxed">
                {p.desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs font-mono text-muted-foreground uppercase">Severity Level</span>
                <span className={cn(
                  "text-xs font-bold font-mono",
                  p.severity === 'Critical' ? 'text-red-500' :
                  p.severity === 'High' ? 'text-orange-500' :
                  'text-blue-500'
                )}>{p.severity}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-8 text-[10px] bg-white/5 border-white/10 uppercase font-bold px-4">Logs</Button>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] bg-white/5 border-white/10 uppercase font-bold px-4">Filters</Button>
                </div>
                <Switch defaultChecked={p.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 border-white/5 overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/5">
          <CardTitle className="text-lg font-headline">Punishment Protocol</CardTitle>
          <CardDescription>Define automated actions for security violations.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {[
              { rule: 'Anti-Link Violation', action: 'Kick User + Delete Message', scope: 'Global' },
              { rule: 'Spam Detection', action: '60m Mute', scope: 'Group Only' },
              { rule: 'NSFW Content', action: 'Ban User + Log Report', scope: 'Global' },
              { rule: 'Fake Number Join', action: 'Immediate Kick', scope: 'International Only' },
            ].map((rule, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">{rule.rule}</p>
                  <p className="text-xs text-muted-foreground">Scope: {rule.scope}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono text-[10px] bg-primary/5 text-primary border-primary/20">{rule.action}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
