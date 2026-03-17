
"use client";

import React, { useState } from "react";
import { Zap, Clock, MapPin, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function DispatchHub() {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="flex flex-col h-full gap-4">
       <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Zap size={16} /> SAPS AI Dispatch
        </h3>
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/30">AI AUTONOMOUS</span>
      </div>

      <div className="space-y-4">
        <div className="glass p-4 rounded-xl border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck size={100} />
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-lg">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Recommended Unit</p>
              <p className="text-sm font-bold">O-247 Sarah Miller</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold">ETA</span>
                <span className="text-xs font-bold">3.1 MIN</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold">DISTANCE</span>
                <span className="text-xs font-bold">1.4 KM</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between text-[10px] font-bold">
              <span className="text-muted-foreground">SUITABILITY SCORE</span>
              <span className="text-emerald-400">96%</span>
            </div>
            <Progress value={96} className="h-1 bg-white/10" />
          </div>

          <div className="mt-4 flex gap-2">
            <Button 
              size="sm" 
              onClick={() => setIsConfirming(true)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-9 font-bold tracking-wide"
            >
              {isConfirming ? "DEPLOYED" : "CONFIRM MISSION"}
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-[11px] h-9 glass font-bold border-white/10">OVERRIDE</Button>
          </div>
        </div>

        <div className="glass p-3 rounded-xl border-dashed border-white/10 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground border border-white/10">
              <AlertTriangle size={14} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold">QUEUED INCIDENT</p>
              <p className="text-xs font-bold uppercase tracking-tighter">Armed Robbery #4412</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
