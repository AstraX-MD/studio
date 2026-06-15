import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Bell, Search, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background w-full">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-white/5 bg-card/30 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="text-muted-foreground hover:text-white" />
              <div className="relative w-full max-w-md group group-data-[collapsible=icon]:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Quick Search Commands... (⌘K)" 
                  className="pl-10 h-9 bg-white/5 border-white/10 rounded-lg focus-visible:ring-primary w-full"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mr-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-widest">Bot Online</span>
              </div>
              
              <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                <Bell className="w-5 h-5" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Command className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
