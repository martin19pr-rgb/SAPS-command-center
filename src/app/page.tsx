"use client";

import React, { useState, useEffect } from "react";
import LiveOperationalMap from "@/components/dashboard/live-map";
import VideoIntelligence from "@/components/dashboard/video-intelligence";
import OfficerTracking from "@/components/dashboard/officer-tracking";
import CommandBar from "@/components/dashboard/command-bar";
import DispatchHub from "@/components/dashboard/dispatch-hub";
import PerformanceMetrics from "@/components/dashboard/performance-metrics";
import AgencyEscalation from "@/components/dashboard/agency-escalation";
import {
  Shield, Settings, Bell, User, LayoutDashboard,
  Database, Activity, Landmark, AlertTriangle, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const criticalAlerts = [
  { id: 1, msg: "SHOOTING — Alexandra · Officer O-891 PANIC ALERT active", time: "18:46" },
  { id: 2, msg: "ARMED ROBBERY — Johannesburg CBD · 2 suspects armed", time: "18:42" },
];

export default function DashboardPage() {
  const [systemTime, setSystemTime] = useState<string | null>(null);
  const [alertIndex, setAlertIndex] = useState(0);
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  useEffect(() => {
    setSystemTime(new Date().toLocaleTimeString());
    const t = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setAlertIndex(p => (p + 1) % criticalAlerts.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const visibleAlerts = criticalAlerts.filter(a => !dismissedAlerts.includes(a.id));

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground font-body">
      {/* Sidebar */}
      <aside className="w-16 h-full flex flex-col items-center py-5 border-r border-white/5 glass gap-7 z-50 flex-shrink-0">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/40">
          <Shield size={22}/>
        </div>
        <nav className="flex flex-col gap-5 text-muted-foreground">
          <button className="p-2 text-white bg-white/10 rounded-xl" title="Provincial Command">
            <LayoutDashboard size={19}/>
          </button>
          <button className="p-2 hover:text-white transition-colors" title="Intelligence Database">
            <Database size={19}/>
          </button>
          <button className="p-2 hover:text-white transition-colors" title="Operational Activity">
            <Activity size={19}/>
          </button>
          <button className="p-2 hover:text-white transition-colors relative" title="Alerts">
            <Bell size={19}/>
            {visibleAlerts.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-destructive rounded-full text-[7px] font-bold flex items-center justify-center text-white animate-pulse">
                {visibleAlerts.length}
              </span>
            )}
          </button>
        </nav>
        <div className="mt-auto flex flex-col gap-5 text-muted-foreground pb-4">
          <button className="p-2 hover:text-white transition-colors" title="Settings"><Settings size={19}/></button>
          <div className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center">
            <User size={17}/>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-white/5 glass flex-shrink-0">
          <div className="flex items-center gap-3">
            <Landmark className="text-primary flex-shrink-0" size={22}/>
            <h1 className="text-lg font-headline font-bold tracking-tight whitespace-nowrap">SAPS PROVINCIAL COMMAND</h1>
            <div className="h-4 w-px bg-white/10 mx-1"/>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase whitespace-nowrap">
                Operational Brain Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">System Time</span>
              <span className="text-sm font-mono font-bold tracking-wider">{systemTime || "--:--:--"}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Jurisdiction</span>
              <span className="text-sm font-bold">GAUTENG PROVINCE</span>
            </div>
          </div>
        </header>

        {/* Critical Alert Banner */}
        {visibleAlerts.length > 0 && (
          <div className="bg-destructive/15 border-b border-destructive/30 px-6 py-2 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <AlertTriangle size={14} className="text-destructive flex-shrink-0 animate-pulse"/>
              <span className="text-[10px] font-bold text-destructive tracking-widest uppercase">CRITICAL ALERT</span>
              <span className="text-[10px] font-medium text-white/80 truncate">
                {visibleAlerts[alertIndex % visibleAlerts.length]?.msg}
              </span>
              <span className="text-[9px] text-muted-foreground flex-shrink-0">
                {visibleAlerts[alertIndex % visibleAlerts.length]?.time}
              </span>
            </div>
            <button
              onClick={() => setDismissedAlerts(prev => [...prev, visibleAlerts[alertIndex % visibleAlerts.length].id])}
              className="text-muted-foreground hover:text-white transition-colors flex-shrink-0"
            >
              <X size={14}/>
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="flex-1 p-5 flex flex-col gap-5 overflow-hidden">
          <PerformanceMetrics/>

          <div className="flex-1 flex gap-5 min-h-0">
            {/* Left column */}
            <div className="w-72 flex flex-col gap-5 overflow-hidden flex-shrink-0">
              <div className="flex-1 overflow-hidden">
                <OfficerTracking/>
              </div>
              <div className="h-68 flex-shrink-0" style={{ height: "270px" }}>
                <DispatchHub/>
              </div>
            </div>

            {/* Center */}
            <div className="flex-1 flex flex-col gap-5 min-w-0">
              <div className="flex-1 min-h-0">
                <LiveOperationalMap/>
              </div>
              <CommandBar/>
            </div>

            {/* Right column */}
            <div className="w-72 flex flex-col gap-5 overflow-hidden flex-shrink-0">
              <div className="flex-1 overflow-hidden min-h-0">
                <VideoIntelligence/>
              </div>
              <div className="flex-shrink-0" style={{ height: "220px" }}>
                <AgencyEscalation/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
