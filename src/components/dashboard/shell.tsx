"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, Settings, Bell, User, LayoutDashboard,
  Activity, AlertTriangle, X, Volume2, VolumeX
} from "lucide-react";
import { cn } from "@/lib/utils";
import SoundToggle, { SoundSettings } from "@/components/dashboard/sound-toggle";
import type { ReactNode } from "react";

const criticalAlerts = [
  { id: 1, msg: "SHOOTING — Leribe · 2 suspects fleeing on foot", time: "18:49" },
  { id: 2, msg: "ARMED ROBBERY — Maseru CBD · Armed suspects", time: "18:46" },
  { id: 3, msg: "KIDNAPPING — Thaba-Tseka · AMBER alert issued", time: "18:44" },
];

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "National Command" },
  { href: "/activity", icon: Activity, label: "Operational Activity" },
  { href: "/alerts", icon: Bell, label: "Alerts", badge: true },
];

interface Props {
  children: ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function DashboardShell({ children, pageTitle = "LMPS LESOTHO COMMAND", pageSubtitle = "KINGDOM OF LESOTHO" }: Props) {
  const pathname = usePathname();
  const [systemTime, setSystemTime] = useState<string | null>(null);
  const [alertIndex, setAlertIndex] = useState(0);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({ enabled: true, critical: true, warnings: true, dispatch: true });

  useEffect(() => {
    setSystemTime(new Date().toLocaleTimeString());
    const t = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setAlertIndex(p => (p + 1) % criticalAlerts.length), 5000);
    return () => clearInterval(t);
  }, []);

  const visibleAlerts = criticalAlerts.filter(a => !dismissed.includes(a.id));
  const currentAlert = visibleAlerts[alertIndex % Math.max(1, visibleAlerts.length)];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground font-body">
      {/* Sidebar */}
      <aside className="w-16 h-full flex flex-col items-center py-5 border-r border-white/10 glass gap-6 z-50 flex-shrink-0">
        {/* LMPS Emblem */}
        <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/40 shadow-lg shadow-primary/30 flex-shrink-0">
          <img src="/lmps-emblem.webp" alt="LMPS" className="w-full h-full object-cover"/>
        </div>

        <nav className="flex flex-col gap-5 text-muted-foreground flex-1">
          {navItems.map(({ href, icon: Icon, label, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  "p-2 rounded-xl transition-all relative",
                  active ? "text-white bg-white/15 shadow-inner" : "hover:text-white hover:bg-white/8"
                )}
              >
                <Icon size={19}/>
                {badge && visibleAlerts.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-destructive rounded-full text-[7px] font-bold flex items-center justify-center text-white animate-pulse">
                    {visibleAlerts.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-4 text-muted-foreground pb-4 items-center">
          <SoundToggle onChange={setSoundSettings}/>
          <Link href="/" title="Settings" className="p-2 hover:text-white transition-colors">
            <Settings size={18}/>
          </Link>
          <div className="w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center">
            <User size={16}/>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-white/8 glass flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/lmps-emblem.webp" alt="LMPS" className="w-8 h-8 rounded-lg object-cover ring-1 ring-primary/30 flex-shrink-0"/>
            <div>
              <h1 className="text-base font-headline font-bold tracking-tight leading-tight">{pageTitle}</h1>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-tight">{pageSubtitle}</p>
            </div>
            <div className="h-4 w-px bg-white/10 mx-2"/>
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
              <span className="text-sm font-mono font-bold tracking-wider tabular-nums">{systemTime || "--:--:--"}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Country</span>
              <span className="text-sm font-bold">LESOTHO</span>
            </div>
          </div>
        </header>

        {/* Critical Alert Banner */}
        {visibleAlerts.length > 0 && currentAlert && (
          <div className="bg-destructive/12 border-b border-destructive/25 px-6 py-1.5 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <AlertTriangle size={13} className="text-destructive flex-shrink-0 animate-pulse"/>
              <span className="text-[10px] font-bold text-destructive tracking-widest uppercase flex-shrink-0">CRITICAL</span>
              <span className="text-[10px] font-medium text-white/75 truncate">{currentAlert.msg}</span>
              <span className="text-[9px] text-muted-foreground flex-shrink-0">{currentAlert.time}</span>
            </div>
            <button onClick={() => setDismissed(prev => [...prev, currentAlert.id])} className="text-muted-foreground hover:text-white flex-shrink-0">
              <X size={13}/>
            </button>
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
