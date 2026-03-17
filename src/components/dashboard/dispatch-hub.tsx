"use client";

import React, { useState, useEffect } from "react";
import { Zap, Clock, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Loader2, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DispatchState = "pending" | "confirming" | "deployed";

interface QueuedIncident {
  id: string;
  type: string;
  priority: "HIGH" | "MEDIUM";
  location: string;
}

const queue: QueuedIncident[] = [
  { id: "#4412", type: "Armed Robbery", priority: "HIGH", location: "Bree St, JHB" },
  { id: "#4413", type: "Vehicle Theft", priority: "MEDIUM", location: "Sandton City" },
];

const dispatchSteps = [
  "SOS received",
  "AI threat analysis",
  "Officer assigned",
  "Mission dispatched",
];

export default function DispatchHub() {
  const [state, setState] = useState<DispatchState>("pending");
  const [step, setStep] = useState(0);
  const [eta, setEta] = useState(183);

  useEffect(() => {
    if (state !== "deployed") return;
    const t = setInterval(() => setEta(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [state]);

  const handleConfirm = () => {
    setState("confirming");
    let s = 0;
    const t = setInterval(() => {
      s++;
      setStep(s);
      if (s >= dispatchSteps.length - 1) {
        clearInterval(t);
        setState("deployed");
      }
    }, 600);
  };

  const etaMin = Math.floor(eta / 60);
  const etaSec = String(eta % 60).padStart(2, "0");

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Zap size={16}/> AI Dispatch
        </h3>
        <span className={cn(
          "text-[10px] px-2 py-0.5 rounded-full font-bold border",
          state === "deployed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-primary/20 text-primary border-primary/30"
        )}>
          {state === "deployed" ? "DEPLOYED" : "AI AUTONOMOUS"}
        </span>
      </div>

      {/* Primary assignment card */}
      <div className={cn(
        "glass p-3.5 rounded-xl border relative overflow-hidden",
        state === "deployed" ? "border-emerald-500/40 bg-emerald-500/8" :
        state === "confirming" ? "border-primary/40 bg-primary/5" :
        "border-emerald-500/25 bg-emerald-500/5"
      )}>
        <div className="absolute -right-5 -top-5 opacity-5">
          <ShieldCheck size={90}/>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center border shadow-lg",
            state === "deployed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          )}>
            {state === "confirming" ? <Loader2 size={18} className="animate-spin"/> : <CheckCircle2 size={18}/>}
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">AI Recommended Unit</p>
            <p className="text-sm font-bold">O-247 — Sarah Miller</p>
            <p className="text-[9px] text-muted-foreground">1.4 km · Enroute capability</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-emerald-400"/>
            <div>
              <span className="text-[9px] text-muted-foreground font-bold block">ETA</span>
              <span className="text-xs font-bold">
                {state === "deployed" ? `${etaMin}m ${etaSec}s` : "~3.1 MIN"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-emerald-400"/>
            <div>
              <span className="text-[9px] text-muted-foreground font-bold block">DISTANCE</span>
              <span className="text-xs font-bold">1.4 KM</span>
            </div>
          </div>
        </div>

        {/* Dispatch step tracker */}
        {state !== "pending" && (
          <div className="mb-3 space-y-1">
            {dispatchSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0",
                  i < step ? "bg-emerald-500" :
                  i === step ? "bg-primary animate-pulse" :
                  "bg-white/10"
                )}>
                  {i < step && <CheckCircle2 size={9} className="text-white"/>}
                  {i === step && state === "confirming" && <Loader2 size={8} className="text-white animate-spin"/>}
                </div>
                <span className={cn(
                  "text-[9px] font-bold",
                  i < step ? "text-emerald-400" :
                  i === step ? "text-white" : "text-muted-foreground"
                )}>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-[9px] font-bold">
            <span className="text-muted-foreground">SUITABILITY SCORE</span>
            <span className="text-emerald-400">96%</span>
          </div>
          <Progress value={96} className="h-0.5 bg-white/10"/>
        </div>

        <div className="flex gap-2">
          {state === "pending" && (
            <>
              <Button size="sm" onClick={handleConfirm} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] h-8 font-bold">
                CONFIRM MISSION
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-[10px] h-8 glass font-bold border-white/10">
                OVERRIDE
              </Button>
            </>
          )}
          {state === "confirming" && (
            <div className="flex-1 flex items-center justify-center gap-2 text-[10px] font-bold text-primary">
              <Loader2 size={13} className="animate-spin"/> DISPATCHING…
            </div>
          )}
          {state === "deployed" && (
            <div className="flex-1 flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-400">
              <CheckCircle2 size={13}/> OFFICER DEPLOYED · TRACKING LIVE
            </div>
          )}
        </div>
      </div>

      {/* Queue */}
      <div className="space-y-1.5">
        {queue.map(inc => (
          <div key={inc.id} className="glass p-2.5 rounded-lg border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-center gap-3 group">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center border flex-shrink-0",
              inc.priority === "HIGH" ? "bg-destructive/15 text-destructive border-destructive/30" : "bg-orange-500/15 text-orange-400 border-orange-500/30"
            )}>
              <AlertTriangle size={12}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-muted-foreground font-bold uppercase">{inc.id} · {inc.priority}</p>
              <p className="text-[10px] font-bold truncate">{inc.type} — {inc.location}</p>
            </div>
            <ChevronRight size={13} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"/>
          </div>
        ))}
      </div>
    </div>
  );
}
