
"use client";

import React from "react";
import { Zap, Clock, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function DispatchHub() {
  return (
    <div className="flex flex-col h-full gap-4">
       <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Zap size={16} /> Dispatch Engine
        </h3>
        <span className="text-[10px] bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">AI ACTIVE</span>
      </div>

      <div className="space-y-4">
        <div className="glass p-4 rounded-xl border-emerald-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Recommended Dispatch</p>
              <p className="text-sm font-bold">O-247 Sarah Miller</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground">ETA</span>
                <span className="text-xs font-bold">4.2 MIN</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground">DISTANCE</span>
                <span className="text-xs font-bold">1.8 KM</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between text-[10px] font-medium">
              <span className="text-muted-foreground">WORKLOAD COMPATIBILITY</span>
              <span>94%</span>
            </div>
            <Progress value={94} className="h-1 bg-white/10" />
          </div>

          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-[11px] h-8">CONFIRM DISPATCH</Button>
            <Button size="sm" variant="outline" className="flex-1 text-[11px] h-8 glass">OVERRIDE</Button>
          </div>
        </div>

        <div className="glass p-3 rounded-xl border-dashed border-white/10 opacity-60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground border border-white/10">
              <AlertTriangle size={14} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">QUEUED INCIDENT</p>
              <p className="text-xs font-bold">Traffic Violation #8821</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
