
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Bot, 
  LayoutDashboard, 
  Puzzle, 
  ShieldAlert, 
  Users, 
  BrainCircuit, 
  Terminal, 
  QrCode,
  CloudUpload,
  Activity
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"

const navItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Session Manager",
    url: "/dashboard/sessions",
    icon: QrCode,
  },
  {
    title: "Plugins",
    url: "/dashboard/plugins",
    icon: Puzzle,
  },
  {
    title: "Warden Security",
    url: "/dashboard/warden",
    icon: ShieldAlert,
  },
  {
    title: "RBAC Roles",
    url: "/dashboard/roles",
    icon: Users,
  },
  {
    title: "AI Subsystem",
    url: "/dashboard/ai",
    icon: BrainCircuit,
  },
  {
    title: "Deployment",
    url: "/dashboard/deployment",
    icon: CloudUpload,
  },
  {
    title: "Terminal Logs",
    url: "/dashboard/logs",
    icon: Terminal,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 flex flex-row items-center px-4 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
          <span className="font-headline font-bold text-lg leading-tight">ASTRAX</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Enterprise Node</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden font-headline">MANAGEMENT</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(
                      "transition-all duration-200 h-10",
                      isActive && "bg-primary/10 text-primary border-r-2 border-primary rounded-none"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-4">
          <SidebarGroupLabel className="font-headline">SYSTEM HEALTH</SidebarGroupLabel>
          <SidebarGroupContent className="px-3 py-2 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono uppercase text-muted-foreground">
                <span>RAM Threshold</span>
                <span>75% Max</span>
              </div>
              <Progress value={42} className="h-1 bg-white/5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono uppercase text-muted-foreground">
                <span>Active Sessions</span>
                <span>1 / 100</span>
              </div>
              <Progress value={1} className="h-1 bg-white/5" />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-xs">
            AO
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold truncate">Astra Owner</span>
            <span className="text-[10px] text-primary uppercase font-mono tracking-tighter">Root Administrator</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
