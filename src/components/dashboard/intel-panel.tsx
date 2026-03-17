"use client";

import React, { useState } from "react";
import { ScanSearch, TrafficCone, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import VideoIntelligence from "@/components/dashboard/video-intelligence";
import TrafficControl from "@/components/dashboard/traffic-control";
import CctvGrid from "@/components/dashboard/cctv-grid";
import type { TrafficNode, TrafficState, CctvCamera } from "@/lib/pursuit-store";

type Tab = "video" | "traffic" | "cctv";

interface Props {
  trafficNodes: TrafficNode[];
  cameras: CctvCamera[];
  pursuitActive: boolean;
  onSetTrafficState: (id: string, state: TrafficState) => void;
  onGreenCorridor: () => void;
  onResetTraffic: () => void;
}

export default function IntelPanel({ trafficNodes, cameras, pursuitActive, onSetTrafficState, onGreenCorridor, onResetTraffic }: Props) {
  const [tab, setTab] = useState<Tab>(pursuitActive ? "traffic" : "video");

  const tabs: { id: Tab; icon: React.ReactNode; label: string; alert?: number }[] = [
    { id: "video",   icon: <ScanSearch size={12}/>, label: "VIDEO" },
    {
      id: "traffic", icon: <TrafficCone size={12}/>, label: "TRAFFIC",
      alert: trafficNodes.filter(n => n.state !== "normal").length || undefined
    },
    {
      id: "cctv",    icon: <Camera size={12}/>, label: "CCTV",
      alert: cameras.filter(c => c.tracking).length || undefined
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex gap-1 mb-3">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 py-1.5 rounded-lg border transition-all",
              tab === t.id
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "glass border-white/10 text-muted-foreground hover:border-white/25"
            )}
          >
            {t.icon} {t.label}
            {t.alert && (
              <span className="ml-0.5 bg-orange-500 text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {t.alert}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {tab === "video"   && <VideoIntelligence/>}
        {tab === "traffic" && (
          <TrafficControl
            nodes={trafficNodes}
            pursuitActive={pursuitActive}
            onSetState={onSetTrafficState}
            onGreenCorridor={onGreenCorridor}
            onResetAll={onResetTraffic}
          />
        )}
        {tab === "cctv" && (
          <CctvGrid
            cameras={cameras}
            pursuitActive={pursuitActive}
          />
        )}
      </div>
    </div>
  );
}
