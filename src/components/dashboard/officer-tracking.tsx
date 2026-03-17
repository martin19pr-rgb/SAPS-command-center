
"use client";

import React from "react";
import { User, Activity, Navigation, Heart, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const officers = [
  { id: "O-247", name: "Sarah Miller", status: "Enroute", hr: 112, movement: "Running", panic: false },
  { id: "O-108", name: "David Chen", status: "At Scene", hr: 88, movement: "Static", panic: false },
  { id: "O-552", name: "Mark Wilson", status: "Standby", hr: 72, movement: "Walking", panic: false },
  { id: "O-891", name: "James Bond", status: "At Scene", hr: 145, movement: "None", panic: true },
];

export default function OfficerTracking() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <User size={16} /> Officer Safety
        </h3>
        <span className="text-[10px] text-emerald-400 font-bold">ALL ACTIVE</span>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-3">
          {officers.map((off) => (
            <div 
              key={off.id}
              className={cn(
                "p-3 rounded-xl border transition-all glass group",
                off.panic ? "border-destructive/50 bg-destructive/5 shadow-lg shadow-destructive/10" : "hover:bg-white/5"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{off.name}</p>
                    <p className="text-[10px] text-muted-foreground">{off.id}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                  off.status === "Enroute" ? "bg-blue-500/10 text-blue-400" :
                  off.status === "At Scene" ? "bg-orange-500/10 text-orange-400" : "bg-white/5 text-muted-foreground"
                )}>
                  {off.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Heart size={14} className={cn(off.hr > 120 ? "text-destructive animate-pulse" : "text-muted-foreground")} />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground leading-none">HEART RATE</span>
                    <span className="text-xs font-bold leading-none mt-1">{off.hr} BPM</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground leading-none">MOVEMENT</span>
                    <span className="text-xs font-bold leading-none mt-1 uppercase">{off.movement}</span>
                  </div>
                </div>
              </div>

              {off.panic && (
                <div className="mt-3 p-2 bg-destructive/20 border border-destructive/30 rounded-lg flex items-center gap-2 animate-pulse">
                  <AlertCircle size={14} className="text-destructive" />
                  <span className="text-[10px] font-bold text-destructive">PANIC ALERT ACTIVATED</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
