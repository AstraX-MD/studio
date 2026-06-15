import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, Shield, Zap, LayoutDashboard, Terminal } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden tech-grid flex flex-col items-center justify-center p-6">
      {/* Hero Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center glow-primary animate-pulse-glow">
            <Bot className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none">
          ASTRAX <span className="text-primary">ENTERPRISE</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Scalable. Modular. Intelligent. The ultimate enterprise-grade framework for high-scale WhatsApp automation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="glass-panel p-6 rounded-2xl text-left space-y-4 hover:border-primary/50 transition-colors group">
            <Zap className="w-8 h-8 text-primary group-hover:animate-bounce" />
            <h3 className="text-xl font-semibold">Modular Core</h3>
            <p className="text-sm text-muted-foreground">Plugin-based architecture supporting 5,000+ commands with hot-reloading.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl text-left space-y-4 hover:border-secondary/50 transition-colors group">
            <Shield className="w-8 h-8 text-secondary group-hover:rotate-12 transition-transform" />
            <h3 className="text-xl font-semibold">Content Warden</h3>
            <p className="text-sm text-muted-foreground">Multi-layer security with anti-spam, anti-link, and automated punishments.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl text-left space-y-4 hover:border-white/20 transition-colors group">
            <Terminal className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold">AI Routing</h3>
            <p className="text-sm text-muted-foreground">Smart query routing across OpenAI, Gemini, and DeepSeek models.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold glow-primary rounded-xl">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 w-5 h-5" />
              Launch Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold bg-white/5 border-white/10 rounded-xl hover:bg-white/10">
            View Documentation
          </Button>
        </div>
      </div>

      <div className="mt-20 flex items-center gap-8 text-white/20">
        <span className="text-sm font-code">V2.4.0-STABLE</span>
        <span className="text-sm font-code">POSTGRESQL-ACTIVE</span>
        <span className="text-sm font-code">SESSION: CLOUD-7X-A2</span>
      </div>
    </div>
  );
}
