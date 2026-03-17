
"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, User, MapPin, Navigation, Radio, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const incidents = [
  { id: 1, type: "High Risk", x: 45, y: 30, severity: "critical", label: "ARMED ROBBERY" },
  { id: 2, type: "Theft", x: 60, y: 55, severity: "medium", label: "VEHICLE HIJACKING" },
  { id: 3, type: "Public Disturbance", x: 25, y: 70, severity: "low", label: "CIVIL PROTEST" },
];

const officers = [
  { id: "O-247", x: 42, y: 32, status: "Enroute", heading: 45 },
  { id: "O-108", x: 58, y: 52, status: "At Scene", heading: 120 },
  { id: "O-552", x: 20, y: 15, status: "Standby", heading: 0 },
];

export default function LiveOperationalMap() {
  const [activeTab, setActiveTab] = useState<"standard" | "risk" | "patrol">("standard");
  const [syncTime, setSyncTime] = useState<string | null>(null);

  useEffect(() => {
    setSyncTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setSyncTime(new Date().toLocaleTimeString());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full glass rounded-xl overflow-hidden group border-white/5 shadow-2xl">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 opacity-40">
        <svg width="100%" height="100%" viewBox="0 0 1000 800" className="fill-none stroke-white/5">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Simulated Streets */}
          <path d="M 0 200 Q 250 180 500 200 T 1000 220" stroke="white" strokeWidth="3" strokeOpacity="0.1" />
          <path d="M 300 0 V 800" stroke="white" strokeWidth="3" strokeOpacity="0.1" />
          <path d="M 700 0 V 800" stroke="white" strokeWidth="3" strokeOpacity="0.1" />
          <path d="M 0 500 H 1000" stroke="white" strokeWidth="3" strokeOpacity="0.1" />
        </svg>
      </div>

      {/* High Risk Zones Overlay */}
      {activeTab === "risk" && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[25%] left-[40%] w-48 h-48 bg-destructive/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-[60%] left-[15%] w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Patrol Routes Overlay */}
      {activeTab === "patrol" && (
        <svg className="absolute inset-0 pointer-events-none w-full h-full" viewBox="0 0 100 100">
          <path 
            d="M 20 15 L 42 32 L 60 55" 
            stroke="hsl(var(--primary))" 
            strokeWidth="0.5" 
            strokeDasharray="1 1" 
            fill="none"
            className="animate-[dash_20s_linear_infinite]"
          />
        </svg>
      )}

      {/* Incident Markers */}
      {incidents.map((inc) => (
        <div 
          key={inc.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 z-10"
          style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
        >
          <div className="flex flex-col items-center">
             <div className={cn(
                "p-2 rounded-full glass border relative shadow-lg",
                inc.severity === "critical" ? "border-destructive text-destructive bg-destructive/10" : 
                inc.severity === "medium" ? "border-orange-500 text-orange-500 bg-orange-500/10" : "border-blue-400 text-blue-400 bg-blue-400/10"
              )}>
                <ShieldAlert size={18} />
                <div className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-30",
                  inc.severity === "critical" ? "bg-destructive" : 
                  inc.severity === "medium" ? "bg-orange-500" : "bg-blue-400"
                )} />
              </div>
              <span className="mt-2 text-[8px] font-bold bg-black/80 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-tighter">
                {inc.label}
              </span>
          </div>
        </div>
      ))}

      {/* Officer Markers */}
      {officers.map((off) => (
        <div 
          key={off.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/off"
          style={{ left: `${off.x}%`, top: `${off.y}%` }}
        >
          <div className="flex flex-col items-center">
            <div 
              className="p-1.5 rounded-full bg-primary text-white border border-white/20 shadow-lg shadow-primary/30 transition-transform"
              style={{ transform: `rotate(${off.heading}deg)` }}
            >
              <Navigation size={14} className={cn(off.status === "Enroute" && "animate-pulse")} />
            </div>
            <span className="mt-1 text-[9px] font-bold bg-primary/90 text-white px-1.5 rounded backdrop-blur-sm border border-white/20 opacity-0 group-hover/off:opacity-100 transition-opacity">
              {off.id}
            </span>
          </div>
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button 
          onClick={() => setActiveTab("standard")}
          className={cn("p-2 rounded-lg glass transition-all hover:bg-white/10", activeTab === "standard" && "bg-primary text-white border-primary shadow-lg shadow-primary/30")}
          title="Standard View"
        >
          <Target size={18} />
        </button>
        <button 
          onClick={() => setActiveTab("risk")}
          className={cn("p-2 rounded-lg glass transition-all hover:bg-white/10", activeTab === "risk" && "bg-primary text-white border-primary shadow-lg shadow-primary/30")}
          title="Predictive Risk Zones"
        >
          <Radio size={18} />
        </button>
        <button 
          onClick={() => setActiveTab("patrol")}
          className={cn("p-2 rounded-lg glass transition-all hover:bg-white/10", activeTab === "patrol" && "bg-primary text-white border-primary shadow-lg shadow-primary/30")}
          title="Optimized Patrols"
        >
          <Navigation size={18} />
        </button>
      </div>

      {/* Map Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 p-3 glass rounded-lg flex items-center justify-between text-xs font-medium z-20 border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
            <span className="font-bold tracking-tight">3 UNRESOLVED INCIDENTS</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="font-bold tracking-tight">12 ACTIVE UNITS</span>
          </div>
        </div>
        <div className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
          PROVINCIAL SYNC: {syncTime || "--:--:--"}
        </div>
      </div>
    </div>
  );
}
