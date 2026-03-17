"use client";

import React from "react";
import LiveOperationalMap from "@/components/dashboard/live-map";
import VideoIntelligence from "@/components/dashboard/video-intelligence";
import OfficerTracking from "@/components/dashboard/officer-tracking";
import CommandBar from "@/components/dashboard/command-bar";
import DispatchHub from "@/components/dashboard/dispatch-hub";
import { Shield, Settings, Bell, User, LayoutDashboard, Database, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Mini Sidebar Nav */}
      <aside className="w-16 h-full flex flex-col items-center py-6 border-r border-white/5 glass gap-8 z-50">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <Shield size={24} />
        </div>
        
        <nav className="flex flex-col gap-6 text-muted-foreground">
          <button className="p-2 text-white bg-white/10 rounded-xl"><LayoutDashboard size={20} /></button>
          <button className="p-2 hover:text-white transition-colors"><Database size={20} /></button>
          <button className="p-2 hover:text-white transition-colors"><Activity size={20} /></button>
          <button className="p-2 hover:text-white transition-colors"><Bell size={20} /></button>
        </nav>

        <div className="mt-auto flex flex-col gap-6 text-muted-foreground pb-4">
          <button className="p-2 hover:text-white transition-colors"><Settings size={20} /></button>
          <div className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center">
            <User size={18} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-white/5 glass">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-headline font-bold tracking-tight">GUARDIAN COMMAND</h1>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Operational Brain Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground uppercase">System Time</span>
              <span className="text-sm font-mono font-bold tracking-wider">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground uppercase">Jurisdiction</span>
              <span className="text-sm font-bold">CENTRAL SECTOR 4</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Left Column: Safety & Dispatch */}
            <div className="w-80 flex flex-col gap-6 overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <OfficerTracking />
              </div>
              <div className="h-72">
                <DispatchHub />
              </div>
            </div>

            {/* Center Area: Map */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              <div className="flex-1 min-h-0">
                <LiveOperationalMap />
              </div>
              <CommandBar />
            </div>

            {/* Right Column: Video Intel & Stats */}
            <div className="w-80 flex flex-col gap-6 overflow-hidden">
              <div className="flex-1">
                <VideoIntelligence />
              </div>
              <div className="glass p-5 rounded-2xl flex flex-col gap-4">
                <h3 className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground">Predictive Engine</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-muted-foreground">FORECASTED CRIME RISK</p>
                      <p className="text-2xl font-headline font-bold">HIGH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-destructive font-bold">+12% VS LAST WK</p>
                    </div>
                  </div>
                  <div className="h-12 w-full flex items-end gap-1 px-1">
                    {[30, 45, 60, 25, 40, 75, 55, 30, 40, 80, 45, 60].map((h, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex-1 rounded-t-sm transition-all hover:bg-primary",
                          h > 70 ? "bg-destructive/60" : "bg-primary/40"
                        )} 
                        style={{ height: `${h}%` }} 
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    AI recommendation: Increase patrol presence in <span className="text-white font-bold">Sector 7B</span> between <span className="text-white font-bold">22:00 - 02:00</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
