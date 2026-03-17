"use client";

import React, { useState } from "react";
import { TrafficCone, Zap, CheckCircle2, Loader2, RotateCcw, Lock, Unlock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrafficNode, TrafficState } from "@/lib/pursuit-store";

interface Props {
  nodes: TrafficNode[];
  pursuitActive: boolean;
  onSetState: (id: string, state: TrafficState) => void;
  onGreenCorridor: () => void;
  onResetAll: () => void;
}

const stateConfig: Record<TrafficState, { label: string; dot: string; bg: string; border: string }> = {
  normal:         { label: "NORMAL",     dot: "bg-gray-400",     bg: "bg-white/5",         border: "border-white/10" },
  green_corridor: { label: "CORRIDOR",   dot: "bg-emerald-400",  bg: "bg-emerald-500/10",  border: "border-emerald-500/30" },
  held_red:       { label: "HELD RED",   dot: "bg-destructive animate-pulse", bg: "bg-destructive/10", border: "border-destructive/30" },
  blocked:        { label: "BLOCKED",    dot: "bg-red-900",      bg: "bg-red-950/30",      border: "border-red-900/50" },
};

type PendingAction = { id: string; action: TrafficState } | null;

export default function TrafficControl({ nodes, pursuitActive, onSetState, onGreenCorridor, onResetAll }: Props) {
  const [pending, setPending] = useState<PendingAction>(null);

  const executeAction = (id: string, state: TrafficState) => {
    setPending({ id, action: state });
    setTimeout(() => {
      onSetState(id, state);
      setPending(null);
    }, 900);
  };

  const corridorCount = nodes.filter(n => n.state === "green_corridor").length;
  const blockedCount  = nodes.filter(n => n.state === "blocked").length;
  const redCount      = nodes.filter(n => n.state === "held_red").length;

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <TrafficCone size={15}/> Traffic Control
        </h3>
        {pursuitActive && (
          <span className="text-[9px] font-bold text-orange-400 flex items-center gap-1 animate-pulse">
            <Zap size={10}/> PURSUIT ACTIVE
          </span>
        )}
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "GREEN", value: corridorCount, cls: "text-emerald-400 border-emerald-500/20 bg-emerald-500/8" },
          { label: "RED",   value: redCount,      cls: "text-destructive border-destructive/20 bg-destructive/8" },
          { label: "BLOCK", value: blockedCount,  cls: "text-red-900 border-red-900/20 bg-red-950/15" },
        ].map(({ label, value, cls }) => (
          <div key={label} className={cn("glass text-center rounded-lg p-2 border", cls)}>
            <p className="text-base font-bold font-headline">{value}</p>
            <p className="text-[8px] font-bold uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick commands */}
      <div className="flex gap-2">
        <button
          onClick={onGreenCorridor}
          className="flex-1 text-[9px] font-bold bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg py-2 transition-colors flex items-center justify-center gap-1"
        >
          <Unlock size={11}/> GREEN CORRIDOR
        </button>
        <button
          onClick={onResetAll}
          className="flex-1 text-[9px] font-bold glass border border-white/10 hover:bg-white/8 text-muted-foreground rounded-lg py-2 transition-colors flex items-center justify-center gap-1"
        >
          <RotateCcw size={10}/> RESTORE ALL
        </button>
      </div>

      {/* Intersection list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {nodes.map(node => {
          const cfg = stateConfig[node.state];
          const isPending = pending?.id === node.id;
          return (
            <div key={node.id} className={cn("glass rounded-xl border p-2.5 transition-all", cfg.bg, cfg.border)}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)}/>
                    <span className="text-[9px] font-bold text-muted-foreground">{node.id}</span>
                    <span className={cn("text-[8px] font-bold px-1 rounded", cfg.bg, "border", cfg.border)}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold leading-tight">{node.name}</p>
                  <p className="text-[8px] text-muted-foreground">{node.district}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {([
                  ["green_corridor", "🟢 GREEN", "hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25"],
                  ["held_red",       "🔴 HOLD",  "hover:bg-destructive/20 text-destructive border-destructive/25"],
                  ["blocked",        "⛔ BLOCK", "hover:bg-red-900/25 text-red-500 border-red-900/25"],
                ] as const).map(([action, label, cls]) => (
                  <button
                    key={action}
                    disabled={node.state === action || isPending}
                    onClick={() => executeAction(node.id, action)}
                    className={cn(
                      "text-[8px] font-bold py-1 rounded border glass transition-all",
                      node.state === action ? "opacity-40 cursor-default" : cls,
                      isPending && pending?.action === action && "opacity-60"
                    )}
                  >
                    {isPending && pending?.action === action
                      ? <Loader2 size={8} className="animate-spin mx-auto"/>
                      : label
                    }
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
