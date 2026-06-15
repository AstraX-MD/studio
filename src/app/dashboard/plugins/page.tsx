"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Puzzle, Search, Download, Settings, Trash2, ExternalLink, Zap, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const plugins = [
  { id: '1', name: 'Economy Pro', author: 'AstraCore', status: 'Installed', version: '1.2.5', type: 'Core', desc: 'Complete banking, gambling and XP system with cloud database support.', aliases: ['eco', 'money', 'bal'] },
  { id: '2', name: 'AI Image Forge', author: 'AstraLabs', status: 'Active', version: '1.2.1', type: 'Extension', desc: 'Integrated DALL-E 3 and Stable Diffusion generator for user commands.', aliases: ['imagine', 'dalle', 'sdxl'] },
  { id: '3', name: 'YouTube Hydra', author: 'HydraDL', status: 'Update', version: '4.0.0', type: 'Downloader', desc: 'High-speed audio and video retrieval with custom quality selection.', aliases: ['play', 'ytv', 'song'] },
  { id: '4', name: 'Warden Guard', author: 'AstraCore', status: 'Active', version: '5.2.0', type: 'Security', desc: 'Advanced moderation suite including anti-link and automated raid protection.', aliases: ['warden', 'antilink', 'block'] },
  { id: '5', name: 'Meme Weaver', author: 'GeniX', status: 'Not Installed', version: '0.8.0', type: 'Media', desc: 'On-the-fly meme generation and image editing suite for groups.', aliases: ['meme', 'edit', 'triggered'] },
  { id: '6', name: 'Auto-Responder', author: 'AstraCore', status: 'Active', version: '1.0.5', type: 'Automation', desc: 'Custom triggers and automated replies for group management.', aliases: ['autoreply', 'bot', 'chatbot'] },
  { id: '7', name: 'Cloud Sync', author: 'AstraLabs', status: 'Installed', version: '2.0.1', type: 'Core', desc: 'Synchronize session data across multiple hosting nodes instantly.', aliases: ['sync', 'cloud', 'session'] }
]

export default function PluginsPage() {
  const [searchQuery, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredPlugins = plugins.filter(plugin => {
    const query = searchQuery.toLowerCase().trim();
    
    // Type Filter
    const matchesTab = activeTab === 'all' || plugin.type.toLowerCase() === activeTab.toLowerCase();
    if (!matchesTab) return false;

    // Search Query Filter
    if (!query) return true;

    const matchesName = plugin.name.toLowerCase().includes(query);
    const matchesDesc = plugin.desc.toLowerCase().includes(query);
    const matchesAliases = plugin.aliases?.some(a => a.toLowerCase().includes(query));
      
    return matchesName || matchesDesc || matchesAliases;
  })

  const handleSearch = () => {
    console.log('Search triggered for:', searchQuery);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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

      <div className="flex flex-col md:flex-row items-center gap-4 bg-card/30 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 w-full flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, desc, or aliases (e.g. 'eco')..." 
              className="pl-10 h-11 bg-white/5 border-white/10 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="secondary" className="h-11 px-6 font-headline" onClick={handleSearch}>Search</Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-white/5 h-11 p-1">
            <TabsTrigger value="all" className="px-6 h-9">All</TabsTrigger>
            <TabsTrigger value="core" className="px-6 h-9">Core</TabsTrigger>
            <TabsTrigger value="security" className="px-6 h-9">Security</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlugins.length > 0 ? filteredPlugins.map((plugin) => (
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
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
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
        )) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-headline">No Plugins Found</h3>
              <p className="text-muted-foreground text-sm">We couldn't find any modules matching "{searchQuery}"</p>
            </div>
            <Button variant="outline" onClick={() => setSearchTerm('')} className="bg-white/5">Clear Search</Button>
          </div>
        )}

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