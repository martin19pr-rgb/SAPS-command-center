
"use client";

import React, { useState, useEffect } from "react";
import LiveOperationalMap from "@/components/dashboard/live-map";
import VideoIntelligence from "@/components/dashboard/video-intelligence";
import OfficerTracking from "@/components/dashboard/officer-tracking";
import CommandBar from "@/components/dashboard/command-bar";
import DispatchHub from "@/components/dashboard/dispatch-hub";
import PerformanceMetrics from "@/components/dashboard/performance-metrics";
import AgencyEscalation from "@/components/dashboard/agency-escalation";
import { Shield, Settings, Bell, User, LayoutDashboard, Database, Activity, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [systemTime, setSystemTime] = useState<string | null>(null);

  useEffect(() => {
    setSystemTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground font-body">
      {/* Mini Sidebar Nav */}
      <aside className="w-16 h-full flex flex-col items-center py-6 border-r border-white/5 glass gap-8 z-50">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <Shield size={24} />
        </div>
        
        <nav className="flex flex-col gap-6 text-muted-foreground">
          <button className="p-2 text-white bg-white/10 rounded-xl" title="Provincial Command"><LayoutDashboard size={20} /></button>
          <button className="p-2 hover:text-white transition-colors" title="Intelligence Database"><Database size={20} /></button>
          <button className="p-2 hover:text-white transition-colors" title="Operational Activity"><Activity size={20} /></button>
          <button className="p-2 hover:text-white transition-colors" title="Alerts"><Bell size={20} /></button>
        </nav>

        <div className="mt-auto flex flex-col gap-6 text-muted-foreground pb-4">
          <button className="p-2 hover:text-white transition-colors" title="Settings"><Settings size={20} /></button>
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
            <Landmark className="text-primary" size={24} />
            <h1 className="text-xl font-headline font-bold tracking-tight">SAPS PROVINCIAL COMMAND</h1>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Operational Brain Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground uppercase">System Time</span>
              <span className="text-sm font-mono font-bold tracking-wider">
                {systemTime || "--:--:--"}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground uppercase">Jurisdiction</span>
              <span className="text-sm font-bold">GAUTENG PROVINCE</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          {/* Top KPI Bar */}
          <PerformanceMetrics />

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

            {/* Right Column: Video Intel & Escalation */}
            <div className="w-80 flex flex-col gap-6 overflow-hidden">
              <div className="flex-1">
                <VideoIntelligence />
              </div>
              <div className="h-72">
                <AgencyEscalation />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
