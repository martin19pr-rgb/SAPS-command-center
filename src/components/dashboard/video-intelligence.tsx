"use client";

import React, { useState, useEffect } from "react";
import { Maximize2, ScanSearch, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ThreatLevel = "CLEAR" | "SUSPICIOUS" | "WEAPON DETECTED" | "VIOLENCE";

interface Feed {
  id: number;
  name: string;
  type: string;
  threat: ThreatLevel;
  confidence: number;
  status: "Normal" | "Warning" | "Critical";
  detections: string[];
  imgSeed: string;
}

const feeds: Feed[] = [
  {
    id: 1, name: "Johannesburg CBD — CAM-08", type: "CCTV", threat: "SUSPICIOUS", confidence: 74,
    status: "Warning", detections: ["Loitering group", "Unlit area"], imgSeed: "cctv8",
  },
  {
    id: 2, name: "Unit O-247 (Bodycam)", type: "Patrol", threat: "WEAPON DETECTED", confidence: 88,
    status: "Critical", detections: ["Firearm", "Hostile posture"], imgSeed: "bodycam247",
  },
  {
    id: 3, name: "Sandton Junction — CAM-12", type: "CCTV", threat: "CLEAR", confidence: 98,
    status: "Normal", detections: [], imgSeed: "sandton12",
  },
  {
    id: 4, name: "Unit O-891 (Bodycam)", type: "Patrol", threat: "VIOLENCE", confidence: 93,
    status: "Critical", detections: ["Physical altercation", "Multiple suspects"], imgSeed: "bodycam891",
  },
];

const threatColor: Record<ThreatLevel, string> = {
  "CLEAR": "text-emerald-400",
  "SUSPICIOUS": "text-yellow-400",
  "WEAPON DETECTED": "text-destructive",
  "VIOLENCE": "text-destructive",
};
const threatBg: Record<ThreatLevel, string> = {
  "CLEAR": "bg-emerald-500/10 border-emerald-500/30",
  "SUSPICIOUS": "bg-yellow-500/10 border-yellow-500/30",
  "WEAPON DETECTED": "bg-destructive/10 border-destructive/30",
  "VIOLENCE": "bg-destructive/10 border-destructive/30",
};

export default function VideoIntelligence() {
  const [activeFeed, setActiveFeed] = useState<Feed>(feeds[1]);
  const [scanLine, setScanLine] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScanLine(p => (p + 2) % 100), 25);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ScanSearch size={16}/> AI Video Intelligence
        </h3>
        <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/20 text-primary font-bold animate-pulse">
          ● LIVE
        </Badge>
      </div>

      {/* Main feed viewer */}
      <div className="flex-1 glass rounded-xl overflow-hidden relative group border-white/10 shadow-lg min-h-0">
        <img
          src={`https://picsum.photos/seed/${activeFeed.imgSeed}/800/600`}
          className="w-full h-full object-cover grayscale-[0.3]"
          alt="Video Feed"
        />

        {/* Scan line */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent ${scanLine - 2}%, rgba(99,179,237,0.07) ${scanLine}%, transparent ${scanLine + 1}%)`
          }}
        />

        {/* Detection box for weapon/violence */}
        {(activeFeed.status === "Critical") && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] left-[30%] w-28 h-52 border-2 border-destructive animate-pulse rounded bg-destructive/5 shadow-[0_0_40px_rgba(239,68,68,0.25)]">
              <div className="absolute -top-6 left-0 bg-destructive text-white text-[8px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter whitespace-nowrap">
                {activeFeed.threat} · {activeFeed.confidence}%
              </div>
              {activeFeed.detections.map((d, i) => (
                <div key={i} className="absolute text-[7px] font-bold text-destructive/80 bg-black/60 px-1 rounded" style={{ top: `${20 + i * 18}px`, left: 4 }}>
                  ▶ {d}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning box */}
        {activeFeed.status === "Warning" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[35%] left-[45%] w-32 h-40 border-2 border-yellow-400 rounded bg-yellow-500/5 shadow-[0_0_25px_rgba(234,179,8,0.2)]">
              <div className="absolute -top-5 left-0 bg-yellow-500 text-black text-[8px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter whitespace-nowrap">
                {activeFeed.threat} · {activeFeed.confidence}%
              </div>
            </div>
          </div>
        )}

        {/* REC indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"/>
          <span className="text-[9px] font-bold text-white tracking-widest">REC</span>
        </div>

        {/* Corner crosshairs */}
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-white/30 pointer-events-none"/>
        <div className="absolute bottom-16 right-2 w-4 h-4 border-b border-r border-white/30 pointer-events-none"/>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"/>

        <div className="absolute bottom-3 left-3 right-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{activeFeed.type}</p>
              <p className="text-xs font-bold text-white">{activeFeed.name}</p>
            </div>
            <button className="p-1.5 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
              <Maximize2 size={13}/>
            </button>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-white/50 font-bold uppercase">THREAT LEVEL</span>
              <span className={cn("font-bold tracking-widest uppercase", threatColor[activeFeed.threat])}>
                {activeFeed.threat}
              </span>
            </div>
            <Progress value={activeFeed.confidence} className="h-0.5 bg-white/10"/>
          </div>
        </div>
      </div>

      {/* Feed selector grid */}
      <div className="grid grid-cols-2 gap-2">
        {feeds.map(feed => (
          <button
            key={feed.id}
            onClick={() => setActiveFeed(feed)}
            className={cn(
              "p-2.5 text-left rounded-lg transition-all border",
              activeFeed.id === feed.id
                ? `glass-accent border-primary/40 ${threatBg[feed.threat]}`
                : "glass hover:bg-white/5 border-white/5"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-muted-foreground uppercase font-bold">{feed.type}</span>
              {feed.status === "Critical" ? (
                <AlertTriangle size={10} className="text-destructive animate-pulse"/>
              ) : feed.status === "Warning" ? (
                <AlertTriangle size={10} className="text-yellow-400"/>
              ) : (
                <CheckCircle2 size={10} className="text-emerald-400"/>
              )}
            </div>
            <p className="text-[10px] font-bold truncate">{feed.name}</p>
            <p className={cn("text-[8px] font-bold mt-0.5 uppercase", threatColor[feed.threat])}>{feed.threat}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
