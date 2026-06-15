"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QrCode, Smartphone, Copy, Check, RefreshCw, AlertCircle, Bot, Link2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { io } from "socket.io-client"
import { useToast } from "@/hooks/use-toast"

export default function SessionManagerPage() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('disconnected')

  useEffect(() => {
    const socket = io()

    socket.on('auth.qr', (qr: string) => {
      setQrCode(qr)
      setStatus('waiting')
    })

    socket.on('auth.status', (data: { status: string }) => {
      setStatus(data.status)
      if (data.status === 'connected') {
        toast({ title: "Session Active", description: "WhatsApp connected successfully." })
        setQrCode(null)
        setPairingCode('')
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [toast])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: "Copied!", description: "Content added to clipboard." })
  }

  const handleRequestPairing = async () => {
    if (!phoneNumber) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      })
      const data = await res.json()
      if (data.code) {
        setPairingCode(data.code)
        toast({ title: "Code Generated", description: "Enter this code on your WhatsApp mobile app." })
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to request pairing code." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-3">
            <QrCode className="w-8 h-8 text-primary" />
            Session Manager
          </h2>
          <p className="text-muted-foreground">Authenticate your AstraX node via QR or Pairing Code.</p>
        </div>
        <Badge variant="outline" className={`h-6 font-mono text-[10px] uppercase border-${status === 'connected' ? 'green' : 'red'}-500/20 text-${status === 'connected' ? 'green' : 'red'}-500 bg-${status === 'connected' ? 'green' : 'red'}-500/10`}>
          Node Status: {status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Control */}
        <Card className="lg:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="font-headline">Pairing Interface</CardTitle>
            <CardDescription>Select authentication method to generate a Session ID.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pair" className="space-y-6">
              <TabsList className="bg-white/5 w-full grid grid-cols-2 h-12 p-1">
                <TabsTrigger value="pair" className="data-[state=active]:bg-primary data-[state=active]:text-white">Pairing Code</TabsTrigger>
                <TabsTrigger value="qr" className="data-[state=active]:bg-primary data-[state=active]:text-white">QR Code Scanner</TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-64 h-64 bg-white p-4 rounded-2xl relative flex items-center justify-center">
                    {qrCode ? (
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCode)}`} alt="QR Code" className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 rounded-lg flex flex-col items-center justify-center border-4 border-dashed border-slate-300 text-slate-400">
                        <QrCode className="w-16 h-16 mb-2" />
                        <span className="text-[10px] font-mono">WAITING FOR CORE...</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Scan this QR code with WhatsApp</p>
                  <p className="text-xs text-muted-foreground italic">Linked Devices &gt; Link a Device</p>
                </div>
                <Button variant="outline" className="bg-white/5 border-white/10 gap-2 h-10" onClick={() => window.location.reload()}>
                  <RefreshCw className="w-4 h-4" />
                  Restart Pairing
                </Button>
              </TabsContent>

              <TabsContent value="pair" className="space-y-6">
                <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">Phone Number (with country code)</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g. 254123456789" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                      <Button onClick={handleRequestPairing} disabled={isLoading || !phoneNumber} className="glow-primary px-8">
                        {isLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : "Get Code"}
                      </Button>
                    </div>
                  </div>

                  {pairingCode && (
                    <div className="pt-4 space-y-3 animate-in fade-in zoom-in duration-300">
                      <p className="text-sm font-medium">Enter this code on your phone:</p>
                      <div className="flex justify-center group cursor-pointer" onClick={() => handleCopy(pairingCode)}>
                        <div className="bg-primary/20 border border-primary/40 px-8 py-4 rounded-2xl text-4xl font-mono font-bold tracking-[0.2em] text-primary group-hover:scale-105 transition-transform">
                          {pairingCode}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Link2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <p className="text-xs text-blue-200/80 leading-relaxed">
                    Pairing codes are valid for 60 seconds. Once linked, AstraX will automatically generate your persistent Session ID.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Active Session Info */}
        <div className="space-y-6">
          <Card className="bg-card/50 border-white/5 overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Session Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="p-4 rounded-2xl bg-[#050406] border border-white/10 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">PERSISTENT_ID</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy('ASTRAX~MTIzNDU2Nzg5MA==')}>
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
                <p className="text-xs font-mono break-all text-primary/80 leading-relaxed">
                  {status === 'connected' ? 'ASTRAX~' + btoa(phoneNumber || 'active-node').substring(0, 16) : 'OFFLINE_NODE'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Auth Strategy</span>
                  <Badge variant="outline" className="border-white/10 uppercase font-mono">Multi-Device</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Hosting Node</span>
                  <span className="font-mono text-primary">PORTABLE-DOCKER</span>
                </div>
              </div>

              <Button variant="destructive" className="w-full h-10 bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white" onClick={() => window.location.reload()}>
                Purge All Sessions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto glow-primary">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline font-semibold">Portable Hosting</h3>
                <p className="text-xs text-muted-foreground">AstraX Enterprise is now compatible with all VPS/PaaS providers.</p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => window.open('https://github.com/astrax-enterprise/core')}>GitHub Repo</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}