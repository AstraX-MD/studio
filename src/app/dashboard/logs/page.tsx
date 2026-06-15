
"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Terminal, Trash2, Download, Play, Pause, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function LogsPage() {
  const [logs, setLogs] = useState<{ id: string, timestamp: string, level: string, source: string, message: string }[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [filter, setFilter] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isPaused) return

    const initialLogs = [
      { id: '1', timestamp: new Date().toISOString(), level: 'INFO', source: 'CORE', message: 'AstraX Enterprise Boot Sequence Started' },
      { id: '2', timestamp: new Date().toISOString(), level: 'INFO', source: 'RAM', message: 'RAM Safety: 75% threshold configured' },
      { id: '3', timestamp: new Date().toISOString(), level: 'INFO', source: 'THUMBNAIL', message: 'Loaded channel.jpg successfully' },
      { id: '4', timestamp: new Date().toISOString(), level: 'INFO', source: 'SERVER', message: 'AstraX Server operational on port 10000' },
    ]
    setLogs(initialLogs)

    const interval = setInterval(() => {
      const levels = ['INFO', 'DEBUG', 'WARN', 'ERROR', 'SUCCESS']
      const sources = ['RAM', 'SESSION', 'THUMBNAIL', 'SERVER', 'WASOCKET', 'BAILEYS']
      const messages = [
        'Current Usage: 42.15%',
        'New client connected: user_172839...',
        'Preparing pairing code for 254123...',
        'Waiting 10s for WhatsApp to stabilize...',
        'Welcome message sent with old style context',
        'Session ID generated: ASTRAX~MTIz...',
        'Auto-followed channel: ASTRAX',
        'Cleaning orphaned sessions...',
      ]

      setLogs(prev => [
        ...prev.slice(-100),
        {
          id: Math.random().toString(),
          timestamp: new Date().toISOString(),
          level: levels[Math.floor(Math.random() * levels.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          message: messages[Math.floor(Math.random() * messages.length)]
        }
      ])
    }, 2000)

    return () => clearInterval(interval)
  }, [isPaused])

  useEffect(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, isPaused])

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) || 
    log.source.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-3">
            <Terminal className="w-8 h-8 text-primary" />
            Terminal Output
          </h2>
          <p className="text-muted-foreground">Real-time system telemetry matching core session generator events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLogs([])}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="bg-[#050406] border-white/10 flex-1 flex flex-col overflow-hidden shadow-2xl">
        <CardHeader className="py-3 px-4 border-b border-white/5 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input 
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Search logs..." 
                className="pl-9 h-8 bg-white/5 border-white/10 text-xs font-mono focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isPaused ? "bg-yellow-500" : "bg-green-500")} />
            {isPaused ? 'Telemetry Paused' : 'Live Stream'}
          </div>
        </CardHeader>
        <CardContent 
          ref={scrollRef}
          className="p-4 font-code text-xs overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
        >
          <div className="space-y-1">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-4 group transition-colors hover:bg-white/5 py-0.5 rounded px-1">
                <span className="text-white/20 shrink-0 select-none">[{log.timestamp.split('T')[1].split(':')[0]}]</span>
                <span className={cn(
                  "font-bold shrink-0 w-16 select-none",
                  log.level === 'ERROR' ? 'text-red-500' :
                  log.level === 'WARN' ? 'text-yellow-500' :
                  log.level === 'SUCCESS' ? 'text-green-500' :
                  log.level === 'DEBUG' ? 'text-blue-500' : 'text-white/60'
                )}>
                  {log.level.padEnd(7)}
                </span>
                <span className="text-primary/60 shrink-0 w-20 select-none uppercase font-bold tracking-tighter">[{log.source}]</span>
                <span className="text-white/80 break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
