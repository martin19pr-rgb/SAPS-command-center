
"use client";

import React, { useState, useEffect } from "react";
import { Video, ShieldAlert, Eye, Maximize2, AlertCircle, ScanSearch } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const feeds = [
  { id: 1, name: "Johannesburg Central - S8", type: "CCTV", threat: "None", confidence: 98, status: "Normal", hint: "city surveillance" },
  { id: 2, name: "Unit O-247 (Bodycam)", type: "Patrol", threat: "Weapon Detected", confidence: 82, status: "Critical", hint: "police patrol" },
];

export default function VideoIntelligence() {
  const [activeFeed, setActiveFeed] = useState(feeds[1]);
  const [analysisPulse, setAnalysisPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setAnalysisPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ScanSearch size={16} /> AI Video Intelligence
        </h3>
        <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/20 text-primary font-bold">LIVE STREAMING</Badge>
      </div>

      <div className="flex-1 glass rounded-xl overflow-hidden relative group border-white/10 shadow-lg">
        <img 
          src={activeFeed.id === 1 ? "https://picsum.photos/seed/cctv1/800/600" : "https://picsum.photos/seed/bodycam1/800/600"} 
          className="w-full h-full object-cover grayscale-[0.2]"
          alt="Video Feed"
          data-ai-hint={activeFeed.hint}
        />
        
        {/* Detection Overlay */}
        {activeFeed.status === "Critical" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[25%] left-[35%] w-36 h-64 border-2 border-destructive animate-pulse rounded-lg bg-destructive/5 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <div className="absolute -top-7 left-0 bg-destructive text-white text-[9px] px-2 py-1 rounded font-bold uppercase tracking-tighter">
                WEAPON DETECTED - 82% CONF.
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{activeFeed.type}</p>
              <p className="text-sm font-bold text-white">{activeFeed.name}</p>
            </div>
            <button className="p-2 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
              <Maximize2 size={14} />
            </button>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/60 font-bold uppercase">THREAT ANALYSIS</span>
              <span className={cn("font-bold tracking-widest uppercase", activeFeed.status === "Critical" ? "text-destructive" : "text-emerald-400")}>
                {activeFeed.threat}
              </span>
            </div>
            <Progress value={activeFeed.confidence} className="h-1 bg-white/10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {feeds.map(feed => (
          <button 
            key={feed.id}
            onClick={() => setActiveFeed(feed)}
            className={cn(
              "p-3 text-left rounded-lg transition-all border",
              activeFeed.id === feed.id ? "glass-accent border-primary/40 bg-primary/10" : "glass hover:bg-white/5 border-white/5"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{feed.type}</span>
              {feed.status === "Critical" && <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            </div>
            <p className="text-xs font-bold truncate">{feed.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
