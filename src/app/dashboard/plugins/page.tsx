"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Puzzle, Search, Download, Settings, Trash2, ExternalLink, Zap, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const plugins = [
  { id: '1', name: 'Economy Pro', author: 'AstraCore', status: 'Installed', version: '2.4.0', type: 'Core', desc: 'Complete banking, gambling and XP system with cloud database support.' },
  { id: '2', name: 'AI Image Forge', author: 'AstraLabs', status: 'Active', version: '1.2.1', type: 'Extension', desc: 'Integrated DALL-E 3 and Stable Diffusion generator for user commands.' },
  { id: '3', name: 'YouTube Hydra', author: 'HydraDL', status: 'Update', version: '4.0.0', type: 'Downloader', desc: 'High-speed audio and video retrieval with custom quality selection.' },
  { id: '4', name: 'Warden Guard', author: 'AstraCore', status: 'Active', version: '5.2.0', type: 'Security', desc: 'Advanced moderation suite including anti-link and automated raid protection.' },
  { id: '5', name: 'Meme Weaver', author: 'GeniX', status: 'Not Installed', version: '0.8.0', type: 'Media', desc: 'On-the-fly meme generation and image editing suite for groups.' },
]

export default function PluginsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight">Plugin Marketplace</h2>
          <p className="text-muted-foreground">Extend AstraX functionality with hot-swappable enterprise modules.</p>
        </div>
        <Button className="h-10 glow-primary">
          <Puzzle className="mr-2 w-4 h-4" />
          Import Custom Plugin
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card/30 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search 5,000+ plugins, commands, and events..." className="pl-10 h-11 bg-white/5 border-white/10" />
        </div>
        <Tabs defaultValue="all" className="w-auto">
          <TabsList className="bg-white/5 h-11 p-1">
            <TabsTrigger value="all" className="px-6 h-9">All</TabsTrigger>
            <TabsTrigger value="core" className="px-6 h-9">Core</TabsTrigger>
            <TabsTrigger value="community" className="px-6 h-9">Community</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plugin) => (
          <Card key={plugin.id} className="bg-card/50 border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
            {plugin.status === 'Active' && <div className="absolute top-0 left-0 w-full h-1 bg-primary/40" />}
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  {plugin.type === 'Security' ? <Shield className="w-6 h-6 text-primary" /> : <Puzzle className="w-6 h-6 text-primary" />}
                </div>
                <Badge variant={
                  plugin.status === 'Active' ? 'default' : 
                  plugin.status === 'Update' ? 'secondary' : 
                  'outline'
                } className="font-mono text-[10px]">
                  {plugin.status}
                </Badge>
              </div>
              <CardTitle className="mt-4 font-headline text-xl">{plugin.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                by {plugin.author} 
                <span className="text-white/10">•</span>
                v{plugin.version}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {plugin.desc}
              </p>
              
              <div className="flex items-center gap-2">
                {plugin.status === 'Not Installed' ? (
                  <Button className="flex-1 glow-primary h-9">
                    <Download className="mr-2 w-4 h-4" />
                    Install
                  </Button>
                ) : plugin.status === 'Update' ? (
                  <Button variant="secondary" className="flex-1 glow-secondary h-9">
                    <Zap className="mr-2 w-4 h-4" />
                    Update Plugin
                  </Button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1 h-9 bg-white/5 border-white/10">
                      <Settings className="mr-2 w-4 h-4" />
                      Configure
                    </Button>
                    <Button variant="destructive" size="icon" className="h-9 w-9 bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed border-white/10 bg-transparent flex items-center justify-center p-8 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Puzzle className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-headline font-semibold">Develop Plugin</h3>
              <p className="text-xs text-muted-foreground">View SDK & Boilerplate templates</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
