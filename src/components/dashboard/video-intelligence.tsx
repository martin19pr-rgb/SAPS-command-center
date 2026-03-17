
"use client";

import React, { useState, useEffect } from "react";
import { Video, ShieldAlert, Eye, Maximize2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const feeds = [
  { id: 1, name: "Intersection 42-A", type: "CCTV", threat: "None", confidence: 98, status: "Normal" },
  { id: 2, name: "Patrol O-247", type: "Bodycam", threat: "Weapon Detected", confidence: 82, status: "Critical" },
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
          <Video size={16} /> AI Video Intelligence
        </h3>
        <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/20">LIVE ANALYSIS</Badge>
      </div>

      <div className="flex-1 glass rounded-xl overflow-hidden relative group">
        <img 
          src={activeFeed.id === 1 ? "https://picsum.photos/seed/cctv1/800/600" : "https://picsum.photos/seed/bodycam1/800/600"} 
          className="w-full h-full object-cover grayscale-[0.2]"
          alt="Video Feed"
          data-ai-hint="city surveillance"
        />
        
        {/* Detection Overlay */}
        {activeFeed.status === "Critical" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[30%] left-[40%] w-32 h-64 border-2 border-destructive animate-pulse-ring rounded-lg">
              <div className="absolute -top-6 left-0 bg-destructive text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                WEAPON DETECTED (82%)
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-white/70">{activeFeed.type}</p>
              <p className="text-sm font-bold text-white">{activeFeed.name}</p>
            </div>
            <button className="p-1.5 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={14} />
            </button>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/60">THREAT LEVEL</span>
              <span className={cn("font-bold", activeFeed.status === "Critical" ? "text-destructive" : "text-emerald-400 uppercase")}>
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
              "p-2 text-left rounded-lg transition-all border",
              activeFeed.id === feed.id ? "glass-accent" : "glass hover:bg-white/5"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground uppercase">{feed.type}</span>
              {feed.status === "Critical" && <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            </div>
            <p className="text-xs font-bold truncate">{feed.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
