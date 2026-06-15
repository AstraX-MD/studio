
"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QrCode, Smartphone, Copy, Check, RefreshCw, AlertCircle, Bot } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SessionManagerPage() {
  const [copied, setCopied] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('ASTRAX~MTIzNDU2Nzg5MA==')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRequestPairing = () => {
    setIsLoading(true)
    setTimeout(() => {
      setPairingCode('ABCD-1234')
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-3">
            <QrCode className="w-8 h-8 text-primary" />
            Session Manager
          </h2>
          <p className="text-muted-foreground">Initialize new AstraX node instances via Multi-Device pairing.</p>
        </div>
        <Badge variant="outline" className="h-6 font-mono text-[10px] uppercase border-green-500/20 text-green-500 bg-green-500/10">
          Server: Global-Cloud-Node-01
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Control */}
        <Card className="lg:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="font-headline">Pairing Interface</CardTitle>
            <CardDescription>Select your preferred authentication method to generate a Session ID.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="qr" className="space-y-6">
              <TabsList className="bg-white/5 w-full grid grid-cols-2 h-12 p-1">
                <TabsTrigger value="qr" className="data-[state=active]:bg-primary data-[state=active]:text-white">QR Code Scanner</TabsTrigger>
                <TabsTrigger value="pair" className="data-[state=active]:bg-primary data-[state=active]:text-white">Pairing Code</TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-64 h-64 bg-white p-4 rounded-2xl relative">
                    {/* Simulated QR Code */}
                    <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center border-4 border-dashed border-slate-300">
                      <QrCode className="w-32 h-32 text-slate-400" />
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Scan this QR code with WhatsApp</p>
                  <p className="text-xs text-muted-foreground italic">Linked Devices &gt; Link a Device</p>
                </div>
                <Button variant="outline" className="bg-white/5 border-white/10 gap-2 h-10">
                  <RefreshCw className="w-4 h-4" />
                  Refresh QR
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
                      <Button onClick={handleRequestPairing} disabled={isLoading || !phoneNumber} className="glow-primary">
                        {isLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : "Request Code"}
                      </Button>
                    </div>
                  </div>

                  {pairingCode && (
                    <div className="pt-4 space-y-3">
                      <p className="text-sm font-medium">Enter this code on your phone:</p>
                      <div className="flex justify-center">
                        <div className="bg-primary/20 border border-primary/40 px-8 py-4 rounded-2xl text-4xl font-mono font-bold tracking-[0.5em] text-primary">
                          {pairingCode}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                  <p className="text-xs text-yellow-200/80 leading-relaxed">
                    Session pairing code is valid for 60 seconds. Ensure you follow the @ASTRAX channel after connection for critical updates.
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
                Latest Session
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="p-4 rounded-2xl bg-[#050406] border border-white/10 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">SESSION_ID</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
                <p className="text-xs font-mono break-all text-primary/80 leading-relaxed">
                  ASTRAX~MTIzNDU2Nzg5MA==...
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Stabilization Status</span>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Stable</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Auto-Follow Channel</span>
                  <Badge variant="outline" className="border-white/10">ASTRAX</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">RAM Overhead</span>
                  <span className="font-mono">12.4 MB</span>
                </div>
              </div>

              <Button variant="destructive" className="w-full h-10 bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white">
                Terminate Active Session
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto glow-primary">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline font-semibold">Deploy AstraX</h3>
                <p className="text-xs text-muted-foreground">Fork repo and paste your Session ID to start the bot engine.</p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">View Guide</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
