"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Shield, Crown, UserCheck, UserMinus, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const roles = [
  { name: 'Root Owner', users: 1, color: 'text-red-500', bg: 'bg-red-500/10', perms: 'All Access' },
  { name: 'Sudo Admin', users: 4, color: 'text-purple-500', bg: 'bg-purple-500/10', perms: 'Most Access' },
  { name: 'Moderator', users: 12, color: 'text-blue-500', bg: 'bg-blue-500/10', perms: 'Group Control' },
  { name: 'Premium User', users: 84, color: 'text-yellow-500', bg: 'bg-yellow-500/10', perms: 'No Rate Limits' },
  { name: 'Blacklisted', users: 124, color: 'text-white/20', bg: 'bg-white/5', perms: 'Blocked' },
]

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            RBAC Access Control
          </h2>
          <p className="text-muted-foreground">Manage roles, permissions, and hierarchical user authorization.</p>
        </div>
        <Button className="glow-primary">
          <Plus className="mr-2 w-4 h-4" />
          Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {roles.map((role) => (
          <Card key={role.name} className="bg-card/50 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-lg font-headline", role.color)}>{role.name}</CardTitle>
              <CardDescription className="font-mono text-[10px] uppercase">{role.perms}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono">{role.users}</div>
              <p className="text-[10px] text-muted-foreground mt-1">Active Accounts</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 border-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="font-headline">Authorization Logs</CardTitle>
            <CardDescription>Recent permission changes and administrative actions.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-xs h-8">Audit Trail</Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-xs h-8">User List</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-white/5 border-b border-white/5">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="font-headline text-xs text-muted-foreground">USER IDENTITY</TableHead>
                <TableHead className="font-headline text-xs text-muted-foreground">TARGET ROLE</TableHead>
                <TableHead className="font-headline text-xs text-muted-foreground">ACTION</TableHead>
                <TableHead className="font-headline text-xs text-muted-foreground">EXECUTOR</TableHead>
                <TableHead className="font-headline text-xs text-muted-foreground text-right">TIMESTAMP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { user: '+1 555-010-9982', role: 'Sudo Admin', action: 'PROMOTED', executor: 'AstraRoot', time: '12m ago' },
                { user: '+44 20-7946-0123', role: 'Premium', action: 'SUBSCRIPTION', executor: 'System', time: '45m ago' },
                { user: '+91 98765-43210', role: 'Blacklisted', action: 'BANNED', executor: 'Warden', time: '2h ago' },
                { user: '+61 412-345-678', role: 'Moderator', action: 'REMOVED', executor: 'AstraRoot', time: '5h ago' },
              ].map((row, i) => (
                <TableRow key={i} className="border-white/5 hover:bg-white/5">
                  <TableCell className="font-mono text-xs">{row.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase border-white/10">{row.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-[10px] font-bold font-mono",
                      row.action === 'BANNED' ? 'text-red-500' :
                      row.action === 'PROMOTED' ? 'text-green-500' :
                      'text-muted-foreground'
                    )}>{row.action}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">@{row.executor}</TableCell>
                  <TableCell className="text-right text-[10px] font-mono text-muted-foreground">{row.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
