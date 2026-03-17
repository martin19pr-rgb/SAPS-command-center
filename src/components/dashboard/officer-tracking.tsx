"use client";

import React, { useState, useEffect } from "react";
import { User, Activity, Navigation, Heart, AlertCircle, Wifi, WifiOff, PhoneOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Officer {
  id: string;
  name: string;
  status: "Enroute" | "At Scene" | "Standby";
  hr: number;
  movement: string;
  panic: boolean;
  signalLost: boolean;
  battery: number;
}

const initialOfficers: Officer[] = [
  { id: "O-247", name: "Sarah Miller", status: "Enroute", hr: 112, movement: "Running", panic: false, signalLost: false, battery: 84 },
  { id: "O-108", name: "David Chen", status: "At Scene", hr: 88, movement: "Static", panic: false, signalLost: false, battery: 61 },
  { id: "O-552", name: "Mark Wilson", status: "Standby", hr: 72, movement: "Walking", panic: false, signalLost: false, battery: 95 },
  { id: "O-891", name: "James Dlamini", status: "At Scene", hr: 149, movement: "None", panic: true, signalLost: false, battery: 22 },
  { id: "O-334", name: "Lerato Mokoena", status: "Enroute", hr: 95, movement: "Driving", panic: false, signalLost: true, battery: 47 },
];

export default function OfficerTracking() {
  const [officers, setOfficers] = useState(initialOfficers);

  useEffect(() => {
    const t = setInterval(() => {
      setOfficers(prev => prev.map(off => ({
        ...off,
        hr: off.panic
          ? Math.max(130, Math.min(180, off.hr + Math.floor(Math.random() * 7) - 2))
          : Math.max(60, Math.min(120, off.hr + Math.floor(Math.random() * 5) - 2)),
      })));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const alertCount = officers.filter(o => o.panic || o.signalLost).length;

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <User size={16}/> Officer Safety
        </h3>
        {alertCount > 0 ? (
          <span className="text-[10px] text-destructive font-bold flex items-center gap-1 animate-pulse">
            <AlertCircle size={11}/> {alertCount} ALERT{alertCount > 1 ? "S" : ""}
          </span>
        ) : (
          <span className="text-[10px] text-emerald-400 font-bold">ALL NOMINAL</span>
        )}
      </div>

      <ScrollArea className="flex-1 pr-3">
        <div className="space-y-2.5">
          {officers.map(off => (
            <div
              key={off.id}
              className={cn(
                "p-3 rounded-xl border transition-all glass",
                off.panic ? "border-destructive/60 bg-destructive/8 shadow-lg shadow-destructive/15" :
                off.signalLost ? "border-orange-500/50 bg-orange-500/5" :
                "border-white/5 hover:bg-white/5"
              )}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold",
                    off.panic ? "bg-destructive/20 text-destructive border-destructive/30" :
                    off.signalLost ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                    "bg-primary/20 text-primary border-primary/20"
                  )}>
                    <User size={15}/>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold leading-tight">{off.name}</p>
                    <p className="text-[9px] text-muted-foreground leading-tight">{off.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {off.signalLost ? (
                    <WifiOff size={12} className="text-orange-400 animate-pulse"/>
                  ) : (
                    <Wifi size={12} className="text-emerald-400 opacity-60"/>
                  )}
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                    off.status === "Enroute" ? "bg-blue-500/15 text-blue-400" :
                    off.status === "At Scene" ? "bg-orange-500/15 text-orange-400" :
                    "bg-white/5 text-muted-foreground"
                  )}>
                    {off.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-1.5">
                  <Heart size={12} className={cn(off.hr > 130 ? "text-destructive animate-pulse" : off.hr > 100 ? "text-orange-400" : "text-muted-foreground")}/>
                  <div>
                    <span className="text-[8px] text-muted-foreground block leading-none">BPM</span>
                    <span className={cn("text-[11px] font-bold leading-none", off.hr > 130 ? "text-destructive" : off.hr > 100 ? "text-orange-400" : "")}>
                      {off.hr}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity size={12} className="text-muted-foreground"/>
                  <div>
                    <span className="text-[8px] text-muted-foreground block leading-none">STATUS</span>
                    <span className="text-[10px] font-bold leading-none uppercase">{off.movement}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    "w-2.5 h-4 rounded-sm border flex flex-col justify-end overflow-hidden",
                    off.battery < 25 ? "border-destructive" : "border-white/20"
                  )}>
                    <div
                      className={cn("w-full transition-all", off.battery < 25 ? "bg-destructive" : "bg-emerald-500")}
                      style={{ height: `${off.battery}%` }}
                    />
                  </div>
                  <div>
                    <span className="text-[8px] text-muted-foreground block leading-none">BAT</span>
                    <span className={cn("text-[10px] font-bold leading-none", off.battery < 25 ? "text-destructive" : "")}>{off.battery}%</span>
                  </div>
                </div>
              </div>

              {off.panic && (
                <div className="mt-2.5 p-2 bg-destructive/20 border border-destructive/40 rounded-lg flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-destructive"/>
                    <span className="text-[9px] font-bold text-destructive tracking-wider">PANIC ALERT — DISPATCH NOW</span>
                  </div>
                  <button className="text-[9px] bg-destructive text-white px-2 py-0.5 rounded font-bold hover:bg-destructive/80 transition-colors">
                    RESPOND
                  </button>
                </div>
              )}
              {off.signalLost && !off.panic && (
                <div className="mt-2.5 p-2 bg-orange-500/15 border border-orange-500/40 rounded-lg flex items-center gap-1.5">
                  <PhoneOff size={12} className="text-orange-400"/>
                  <span className="text-[9px] font-bold text-orange-400 tracking-wider">SIGNAL LOST — LAST KNOWN LOCATION</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
