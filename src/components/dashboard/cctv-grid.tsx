"use client";

import React, { useState, useEffect } from "react";
import { Camera, Crosshair, ScanSearch, Eye, ChevronRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CctvCamera } from "@/lib/pursuit-store";
import { Progress } from "@/components/ui/progress";

interface Props {
  cameras: CctvCamera[];
  pursuitActive: boolean;
  onCameraSelect?: (id: string) => void;
}

const aiDetections = [
  { camId: "CAM-101", detect: "Suspect: Male, red jacket, northbound", conf: 87, tracking: true },
  { camId: "CAM-102", detect: "Vehicle: Silver sedan, partial PLK-4**", conf: 72, tracking: false },
  { camId: "CAM-103", detect: "Clear — no suspects detected", conf: 99, tracking: false },
  { camId: "CAM-104", detect: "Clear — normal foot traffic", conf: 97, tracking: false },
  { camId: "CAM-105", detect: "Vehicle match: possible suspect route", conf: 63, tracking: false },
  { camId: "CAM-106", detect: "Crowd gathering — monitoring", conf: 54, tracking: false },
];

export default function CctvGrid({ cameras, pursuitActive, onCameraSelect }: Props) {
  const [activeCam, setActiveCam] = useState<CctvCamera | null>(cameras[0] ?? null);
  const [scanLine, setScanLine] = useState(0);
  const [autoSwitch, setAutoSwitch] = useState(pursuitActive);

  useEffect(() => {
    const t = setInterval(() => setScanLine(p => (p + 2) % 100), 25);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!autoSwitch) return;
    const trackingCams = cameras.filter(c => c.tracking);
    if (trackingCams.length === 0) return;
    let i = 0;
    const t = setInterval(() => {
      setActiveCam(trackingCams[i % trackingCams.length]);
      i++;
    }, 4000);
    return () => clearInterval(t);
  }, [autoSwitch, cameras]);

  const detection = aiDetections.find(d => d.camId === activeCam?.id);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Camera size={15}/> CCTV City Grid
        </h3>
        <div className="flex items-center gap-2">
          {pursuitActive && (
            <button
              onClick={() => setAutoSwitch(p => !p)}
              className={cn(
                "text-[9px] font-bold px-2 py-0.5 rounded border transition-all",
                autoSwitch ? "bg-primary/20 text-primary border-primary/30" : "glass border-white/10 text-muted-foreground"
              )}
            >
              {autoSwitch ? "AUTO-TRACK ON" : "AUTO-TRACK OFF"}
            </button>
          )}
        </div>
      </div>

      {/* Main viewer */}
      {activeCam && (
        <div className="flex-1 glass rounded-xl overflow-hidden relative border-white/10 shadow-lg min-h-0 group">
          <img
            src={`https://picsum.photos/seed/${activeCam.imgSeed}/800/500`}
            className="w-full h-full object-cover grayscale-[0.4]"
            alt={activeCam.name}
          />

          {/* Scan line */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `linear-gradient(to bottom, transparent ${scanLine - 2}%, rgba(59,130,246,0.06) ${scanLine}%, transparent ${scanLine + 1}%)`
          }}/>

          {/* Tracking box */}
          {activeCam.tracking && (
            <div className="absolute top-[25%] left-[40%] w-20 h-36 border-2 border-primary animate-pulse rounded bg-primary/5 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="absolute -top-5 left-0 bg-primary text-white text-[7px] px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap">
                TARGET LOCKED
              </div>
              <Crosshair size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"/>
            </div>
          )}

          {/* REC + CAM ID */}
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse"/>
              <span className="text-[8px] font-bold text-white">REC</span>
            </div>
            <div className="bg-black/70 px-1.5 py-0.5 rounded">
              <span className="text-[8px] font-bold text-white">{activeCam.id}</span>
            </div>
            {activeCam.tracking && (
              <div className="bg-primary/80 px-1.5 py-0.5 rounded animate-pulse">
                <span className="text-[8px] font-bold text-white">AI TRACKING</span>
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none"/>

          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-[9px] font-bold text-white/60 uppercase">{activeCam.type}</p>
            <p className="text-xs font-bold text-white">{activeCam.name}</p>
            {detection && (
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center justify-between text-[8px]">
                  <span className="text-white/50 flex items-center gap-1">
                    <ScanSearch size={9}/> AI ANALYSIS
                  </span>
                  <span className={cn("font-bold", detection.tracking ? "text-primary" : "text-emerald-400")}>
                    {detection.conf}% CONF
                  </span>
                </div>
                <p className={cn("text-[9px] font-bold", detection.tracking ? "text-primary" : "text-muted-foreground")}>
                  {detection.detect}
                </p>
                <Progress value={detection.conf} className="h-0.5 bg-white/10"/>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Camera grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {cameras.map(cam => (
          <button
            key={cam.id}
            onClick={() => { setActiveCam(cam); setAutoSwitch(false); }}
            className={cn(
              "relative rounded-lg overflow-hidden border transition-all aspect-video",
              activeCam?.id === cam.id ? "border-primary ring-1 ring-primary/40" : "border-white/10 hover:border-white/25",
              cam.tracking && "ring-1 ring-primary/60"
            )}
          >
            <img
              src={`https://picsum.photos/seed/${cam.imgSeed}/200/150`}
              className="w-full h-full object-cover grayscale-[0.5]"
              alt={cam.name}
            />
            <div className="absolute inset-0 bg-black/40"/>
            {cam.tracking && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"/>
            )}
            <div className="absolute bottom-1 left-1">
              <span className="text-[6px] font-bold text-white/80 bg-black/60 px-1 rounded">{cam.id}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
