
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Rocket, Server, Terminal, Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function DeploymentPage() {
  const { toast } = useToast()
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
    toast({ title: "Command Copied", description: "Ready to paste in your terminal." })
  }

  const gitCommands = `git init
git add .
git commit -m "Deploy AstraX Enterprise v2.4"
git branch -M main
git remote add origin https://github.com/YOUR_USER/astrax.git
git push -u origin main`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-3">
            <Rocket className="w-8 h-8 text-primary" />
            Deployment Hub
          </h2>
          <p className="text-muted-foreground">Push your code to GitHub and deploy to global cloud infrastructure.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GitHub Integration */}
        <Card className="lg:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5 text-white" />
              Push to GitHub
            </CardTitle>
            <CardDescription>Follow these steps to upload your current workspace code to a remote repository.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#050406] border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Terminal Commands</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(gitCommands, 'git')}>
                  {copied === 'git' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="text-xs font-mono text-primary/80 overflow-x-auto p-2 bg-white/5 rounded-lg leading-relaxed">
                {gitCommands}
              </pre>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Important Notes:</h4>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>Ensure you have created a repository on GitHub first.</li>
                <li>Never share your <code>.env</code> file or <code>sessions/</code> folder publicly.</li>
                <li>The <code>.gitignore</code> file is already configured to protect your credentials.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cloud Platforms */}
        <div className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Server className="w-5 h-5 text-secondary" />
                Render / Railway
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm font-medium">Node.js Version</span>
                <Badge variant="outline" className="font-mono">v20+</Badge>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Both Render and Railway can deploy direct from GitHub. Once pushed, link your repository and add these variables:
                </p>
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-mono text-yellow-200/80">
                  DATABASE_TYPE=json<br />
                  PORT=9002<br />
                  SESSION_NAME=AstraX-Main
                </div>
              </div>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                Deployment Guide <ExternalLink className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center glow-primary">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline font-semibold">V2.4 Cloud Scaling</h3>
                <p className="text-xs text-muted-foreground">AstraX Enterprise is optimized for cluster deployments.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
