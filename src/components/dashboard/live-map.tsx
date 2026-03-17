
"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, User, MapPin, Navigation, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const incidents = [
  { id: 1, type: "High Risk", x: 45, y: 30, severity: "critical" },
  { id: 2, type: "Theft", x: 60, y: 55, severity: "medium" },
  { id: 3, type: "Public Disturbance", x: 25, y: 70, severity: "low" },
];

const officers = [
  { id: "O-247", x: 42, y: 32, status: "Enroute" },
  { id: "O-108", x: 58, y: 52, status: "At Scene" },
  { id: "O-552", x: 20, y: 15, status: "Standby" },
];

export default function LiveOperationalMap() {
  const [activeTab, setActiveTab] = useState<"standard" | "risk" | "patrol">("standard");

  return (
    <div className="relative w-full h-full glass rounded-xl overflow-hidden group">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 opacity-40">
        <svg width="100%" height="100%" viewBox="0 0 1000 800" className="fill-none stroke-white/5">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Simulated Streets */}
          <path d="M 0 200 Q 250 180 500 200 T 1000 220" stroke="white" strokeWidth="4" strokeOpacity="0.1" />
          <path d="M 300 0 V 800" stroke="white" strokeWidth="4" strokeOpacity="0.1" />
          <path d="M 700 0 V 800" stroke="white" strokeWidth="4" strokeOpacity="0.1" />
          <path d="M 0 500 H 1000" stroke="white" strokeWidth="4" strokeOpacity="0.1" />
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
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110"
          style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
        >
          <div className={cn(
            "p-1.5 rounded-full glass border relative",
            inc.severity === "critical" ? "border-destructive text-destructive" : 
            inc.severity === "medium" ? "border-orange-500 text-orange-500" : "border-blue-400 text-blue-400"
          )}>
            <ShieldAlert size={16} />
            <div className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-20",
              inc.severity === "critical" ? "bg-destructive" : 
              inc.severity === "medium" ? "bg-orange-500" : "bg-blue-400"
            )} />
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
            <div className="p-1 rounded-full bg-primary text-white border border-white/20 shadow-lg shadow-primary/20">
              <Navigation size={12} className={cn(off.status === "Enroute" && "animate-pulse")} />
            </div>
            <span className="mt-1 text-[10px] font-medium bg-black/60 px-1 rounded backdrop-blur-sm border border-white/10 group-hover/off:opacity-100 opacity-0 transition-opacity">
              {off.id}
            </span>
          </div>
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab("standard")}
          className={cn("p-2 rounded-lg glass transition-all hover:bg-white/10", activeTab === "standard" && "bg-primary/20 border-primary/50")}
          title="Standard View"
        >
          <MapPin size={18} />
        </button>
        <button 
          onClick={() => setActiveTab("risk")}
          className={cn("p-2 rounded-lg glass transition-all hover:bg-white/10", activeTab === "risk" && "bg-primary/20 border-primary/50")}
          title="AI Risk Zones"
        >
          <Radio size={18} />
        </button>
        <button 
          onClick={() => setActiveTab("patrol")}
          className={cn("p-2 rounded-lg glass transition-all hover:bg-white/10", activeTab === "patrol" && "bg-primary/20 border-primary/50")}
          title="Optimal Patrols"
        >
          <Navigation size={18} />
        </button>
      </div>

      {/* Map Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 p-3 glass rounded-lg flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span>3 Active Incidents</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>12 Officers on Duty</span>
          </div>
        </div>
        <div className="text-muted-foreground">
          LAST SYNC: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
