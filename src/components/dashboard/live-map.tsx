"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Navigation, Radio, Target, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

const incidents = [
  { id: 1, x: 45, y: 30, severity: "critical", label: "ARMED ROBBERY", district: "Maseru CBD", time: "18:42" },
  { id: 2, x: 62, y: 55, severity: "medium", label: "HIJACKING", district: "Leribe", time: "18:39" },
  { id: 3, x: 25, y: 68, severity: "low", label: "CIVIL UNREST", district: "Mohale's Hoek", time: "18:31" },
  { id: 4, x: 78, y: 22, severity: "medium", label: "ASSAULT", district: "Butha-Buthe", time: "18:44" },
  { id: 5, x: 14, y: 42, severity: "critical", label: "SHOOTING", district: "Thaba-Tseka", time: "18:46" },
];

const officers = [
  { id: "O-247", x: 42, y: 32, status: "Enroute", heading: 45 },
  { id: "O-108", x: 60, y: 52, status: "At Scene", heading: 120 },
  { id: "O-552", x: 20, y: 15, status: "Standby", heading: 0 },
  { id: "O-891", x: 75, y: 65, status: "Standby", heading: 200 },
  { id: "O-334", x: 50, y: 80, status: "Enroute", heading: 300 },
];

const riskZones = [
  { x: 44, y: 28, label: "HIGH ROBBERY RISK\n18:00–21:00", level: "critical", r: 80 },
  { x: 14, y: 42, label: "GANG ACTIVITY\nHOTSPOT", level: "high", r: 60 },
  { x: 62, y: 50, label: "HIJACKING ZONE", level: "medium", r: 50 },
];

type Tab = "standard" | "risk" | "patrol";

export default function LiveOperationalMap() {
  const [activeTab, setActiveTab] = useState<Tab>("standard");
  const [syncTime, setSyncTime] = useState<string | null>(null);
  const [scanY, setScanY] = useState(0);
  const [selected, setSelected] = useState<typeof incidents[0] | null>(null);

  useEffect(() => {
    setSyncTime(new Date().toLocaleTimeString());
    const t = setInterval(() => setSyncTime(new Date().toLocaleTimeString()), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setScanY(p => (p + 0.8) % 100), 30);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-full glass rounded-xl overflow-hidden border-white/5 shadow-2xl">
      {/* Grid */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1000 800">
          <defs>
            <pattern id="sg" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0L0 0 0 20" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.1"/>
            </pattern>
            <pattern id="lg" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#sg)"/>
              <path d="M100 0L0 0 0 100" fill="none" stroke="white" strokeWidth="0.6" strokeOpacity="0.15"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lg)"/>
          <path d="M0 300 Q200 280 400 300 T1000 320" stroke="white" strokeWidth="5" strokeOpacity="0.07" fill="none"/>
          <path d="M310 0 L330 800" stroke="white" strokeWidth="5" strokeOpacity="0.07" fill="none"/>
          <path d="M680 0 L700 800" stroke="white" strokeWidth="5" strokeOpacity="0.07" fill="none"/>
          <path d="M0 500 Q500 480 1000 510" stroke="white" strokeWidth="5" strokeOpacity="0.07" fill="none"/>
        </svg>
      </div>

      {/* Radar scan line */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `linear-gradient(to bottom, transparent ${scanY - 3}%, rgba(59,130,246,0.04) ${scanY - 1}%, rgba(99,179,237,0.08) ${scanY}%, rgba(59,130,246,0.03) ${scanY + 1}%, transparent ${scanY + 2}%)`
        }}
      />

      {/* Risk zone blobs */}
      {activeTab === "risk" && riskZones.map((z, i) => (
        <div
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[2]"
          style={{ left: `${z.x}%`, top: `${z.y}%` }}
        >
          <div
            className={cn(
              "rounded-full blur-3xl animate-pulse",
              z.level === "critical" ? "bg-destructive/30" :
              z.level === "high" ? "bg-orange-500/25" : "bg-yellow-500/20"
            )}
            style={{ width: z.r * 2, height: z.r * 2 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              "text-[8px] font-bold text-center leading-tight px-2 py-1 rounded bg-black/70 border whitespace-pre-line",
              z.level === "critical" ? "text-destructive border-destructive/40" :
              z.level === "high" ? "text-orange-400 border-orange-500/40" : "text-yellow-400 border-yellow-500/40"
            )}>
              {z.label}
            </span>
          </div>
        </div>
      ))}

      {/* Patrol routes */}
      {activeTab === "patrol" && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M20 15 L42 32 L60 52" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="2 1.5" fill="none" opacity="0.9"/>
          <path d="M50 80 L62 55 L78 22" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 1.5" fill="none" opacity="0.9"/>
          <path d="M14 42 L45 30" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2 1.5" fill="none" opacity="0.9"/>
          <circle cx="20" cy="15" r="0.8" fill="hsl(var(--primary))"/>
          <circle cx="42" cy="32" r="0.8" fill="hsl(var(--primary))"/>
          <circle cx="60" cy="52" r="0.8" fill="hsl(var(--primary))"/>
        </svg>
      )}

      {/* Incident markers */}
      {incidents.map(inc => (
        <div
          key={inc.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-125"
          style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
          onClick={() => setSelected(selected?.id === inc.id ? null : inc)}
        >
          <div className="flex flex-col items-center">
            <div className={cn(
              "p-1.5 rounded-full glass border relative shadow-lg",
              inc.severity === "critical" ? "border-destructive text-destructive bg-destructive/15" :
              inc.severity === "medium" ? "border-orange-500 text-orange-500 bg-orange-500/15" :
              "border-blue-400 text-blue-400 bg-blue-400/15"
            )}>
              <ShieldAlert size={15}/>
              <div className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-20",
                inc.severity === "critical" ? "bg-destructive" :
                inc.severity === "medium" ? "bg-orange-500" : "bg-blue-400"
              )}/>
            </div>
            <span className="mt-1 text-[7px] font-bold bg-black/80 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-tighter whitespace-nowrap">
              {inc.label}
            </span>
          </div>
          {selected?.id === inc.id && (
            <div className="absolute left-7 top-0 w-44 glass border border-white/20 rounded-lg p-2.5 z-20 shadow-2xl">
              <p className="text-[10px] font-bold text-white">{inc.label}</p>
              <p className="text-[9px] text-muted-foreground">{inc.district}</p>
              <p className="text-[9px] text-muted-foreground">Reported: {inc.time}</p>
              <div className={cn(
                "text-[9px] font-bold mt-1.5 uppercase tracking-widest",
                inc.severity === "critical" ? "text-destructive" :
                inc.severity === "medium" ? "text-orange-400" : "text-blue-400"
              )}>{inc.severity} PRIORITY</div>
            </div>
          )}
        </div>
      ))}

      {/* Officer markers */}
      {officers.map(off => (
        <div
          key={off.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group/off"
          style={{ left: `${off.x}%`, top: `${off.y}%` }}
        >
          <div
            className={cn(
              "p-1.5 rounded-full border shadow-lg",
              off.status === "Enroute" ? "bg-blue-600 text-white border-blue-400 shadow-blue-500/30" :
              off.status === "At Scene" ? "bg-orange-600 text-white border-orange-400 shadow-orange-500/30" :
              "bg-primary text-white border-white/20 shadow-primary/30"
            )}
            style={{ transform: `rotate(${off.heading}deg)` }}
          >
            <Navigation size={11} className={cn(off.status === "Enroute" && "animate-pulse")}/>
          </div>
          <span className="absolute left-6 top-0 text-[8px] font-bold bg-black/80 text-white px-1.5 py-0.5 rounded border border-white/20 opacity-0 group-hover/off:opacity-100 transition-opacity whitespace-nowrap z-20">
            {off.id} · {off.status}
          </span>
        </div>
      ))}

      {/* HUD corners */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/50 pointer-events-none"/>
      <div className="absolute top-3 right-14 w-5 h-5 border-t-2 border-r-2 border-primary/50 pointer-events-none"/>
      <div className="absolute bottom-14 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/50 pointer-events-none"/>
      <div className="absolute bottom-14 right-14 w-5 h-5 border-b-2 border-r-2 border-primary/50 pointer-events-none"/>

      {/* View controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        {(["standard", "risk", "patrol"] as Tab[]).map((id, idx) => {
          const Icon = idx === 0 ? Target : idx === 1 ? Radio : Navigation;
          const labels = ["Standard", "Risk Zones", "Patrols"];
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={labels[idx]}
              className={cn(
                "p-2 rounded-lg glass transition-all hover:bg-white/10",
                activeTab === id && "bg-primary text-white border-primary shadow-lg shadow-primary/40"
              )}
            >
              <Icon size={15}/>
            </button>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="absolute bottom-4 left-4 right-4 p-2.5 glass rounded-lg flex items-center justify-between text-xs z-20 border-white/10">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"/>
            <span className="font-bold tracking-tight text-[10px]">{incidents.filter(i => i.severity === "critical").length} CRITICAL</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-400">
            <div className="w-2 h-2 rounded-full bg-orange-500"/>
            <span className="font-bold tracking-tight text-[10px]">{incidents.filter(i => i.severity === "medium").length} MEDIUM</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary"/>
            <span className="font-bold tracking-tight text-[10px]">{officers.length} UNITS</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[10px] tracking-widest">
          <Wifi size={11} className="text-emerald-400 animate-pulse"/>
          LIVE · {syncTime || "--:--:--"}
        </div>
      </div>
    </div>
  );
}
