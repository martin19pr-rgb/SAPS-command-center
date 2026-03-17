"use client";

import React, { useEffect, useState } from "react";
import { Crosshair, ChevronRight, Zap, Camera, TrafficCone, Radio, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PursuitData } from "@/lib/pursuit-store";

interface Props {
  pursuit: PursuitData;
  onCancel: () => void;
}

export default function PursuitBanner({ pursuit, onCancel }: Props) {
  const [elapsed, setElapsed] = useState(pursuit.elapsedSeconds);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(p => p + 1);
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="relative w-full rounded-xl border border-orange-500/40 bg-orange-950/25 shadow-[0_0_30px_rgba(249,115,22,0.15)] overflow-hidden">
      {/* Animated scan bar */}
      <div
        className="absolute top-0 left-0 h-full w-1 bg-orange-500 opacity-70 transition-none"
        style={{ animation: "slide-x 2s linear infinite" }}
      />

      <div className="p-3 pl-5">
        <div className="flex items-center gap-4">
          {/* Badge */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full bg-orange-500", pulse ? "opacity-100" : "opacity-40")}/>
            <span className="text-orange-400 font-headline font-bold text-sm tracking-wider uppercase">PURSUIT MODE</span>
            <span className="font-mono text-orange-400 text-xs bg-orange-500/15 px-2 py-0.5 rounded border border-orange-500/25">
              {fmt(elapsed)}
            </span>
          </div>

          {/* Suspect info */}
          <div className="flex items-center gap-1 text-[10px] border-l border-white/10 pl-4">
            <Crosshair size={11} className="text-orange-400 flex-shrink-0"/>
            <span className="text-muted-foreground">SUSPECT:</span>
            <span className="text-white font-bold">{pursuit.suspectId}</span>
            <ChevronRight size={10} className="text-muted-foreground"/>
            <span className="text-orange-400 font-bold">{pursuit.suspectVehicle}</span>
          </div>

          {/* AI decision output */}
          <div className="flex items-center gap-4 flex-1 border-l border-white/10 pl-4">
            <div className="flex items-center gap-1.5 text-[10px]">
              <Camera size={11} className="text-primary flex-shrink-0"/>
              <span className="text-muted-foreground">NEXT CAM:</span>
              <span className="text-primary font-bold">{pursuit.nextCamera}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <TrafficCone size={11} className="text-emerald-400 flex-shrink-0"/>
              <span className="text-muted-foreground">TRAFFIC:</span>
              <span className="text-emerald-400 font-bold">{pursuit.trafficAction}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <Crosshair size={11} className="text-yellow-400 flex-shrink-0"/>
              <span className="text-muted-foreground">INTERCEPT:</span>
              <span className="text-yellow-400 font-bold">{pursuit.interceptionPoint}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <Radio size={11} className="text-blue-400 flex-shrink-0"/>
              <span className="text-muted-foreground">UNITS:</span>
              <span className="text-blue-400 font-bold">{pursuit.recommendedUnits.join(", ")}</span>
            </div>
          </div>

          {/* Direction badge */}
          <div className="flex-shrink-0 flex items-center gap-2 border-l border-white/10 pl-4">
            <span className="text-[9px] text-muted-foreground">HEADING</span>
            <span className="text-orange-400 font-bold text-xs uppercase">{pursuit.suspectDirection}</span>
            <span className="text-[9px] font-mono text-muted-foreground">{pursuit.suspectSpeed}</span>
          </div>

          <button
            onClick={onCancel}
            className="ml-2 p-1 glass rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
            title="End Pursuit"
          >
            <X size={14}/>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-x {
          0% { transform: translateX(-4px); opacity: 0.3; }
          50% { opacity: 0.9; }
          100% { transform: translateX(calc(100vw - 8px)); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
