"use client";

import React, { useState } from "react";
import { Siren, Truck, ShieldAlert, Share2, CheckCircle2, Loader2, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

type AgencyStatus = "idle" | "notifying" | "active";

interface Agency {
  key: string;
  name: string;
  icon: React.ElementType;
  color: string;
  activeColor: string;
  units: number;
}

const agencies: Agency[] = [
  {
    key: "ems", name: "EMS (MEDICS)", icon: Siren, units: 3,
    color: "bg-red-500/15 text-red-400 border-red-500/25",
    activeColor: "bg-red-500/25 text-red-300 border-red-400/50 shadow-red-500/20",
  },
  {
    key: "traffic", name: "TRAFFIC DEPT", icon: Truck, units: 5,
    color: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    activeColor: "bg-blue-500/25 text-blue-300 border-blue-400/50 shadow-blue-500/20",
  },
  {
    key: "private", name: "PRIVATE SECURITY", icon: ShieldAlert, units: 8,
    color: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    activeColor: "bg-orange-500/25 text-orange-300 border-orange-400/50 shadow-orange-500/20",
  },
];

export default function AgencyEscalation() {
  const [statuses, setStatuses] = useState<Record<string, AgencyStatus>>({
    ems: "idle", traffic: "idle", private: "idle",
  });
  const [allEscalated, setAllEscalated] = useState(false);

  const escalate = (key: string) => {
    if (statuses[key] !== "idle") return;
    setStatuses(prev => ({ ...prev, [key]: "notifying" }));
    setTimeout(() => {
      setStatuses(prev => ({ ...prev, [key]: "active" }));
    }, 1800);
  };

  const escalateAll = () => {
    agencies.forEach(a => escalate(a.key));
    setAllEscalated(true);
  };

  const activeCount = Object.values(statuses).filter(s => s === "active").length;

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Share2 size={16}/> Agency Escalation
        </h3>
        {activeCount > 0 && (
          <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
            <Radio size={10} className="animate-pulse"/> {activeCount} NOTIFIED
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        {agencies.map(agency => {
          const status = statuses[agency.key];
          return (
            <div
              key={agency.key}
              className={cn(
                "p-3 rounded-xl border glass flex items-center justify-between transition-all shadow-lg",
                status === "active" ? agency.activeColor :
                status === "notifying" ? agency.color : agency.color
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border",
                  status === "active" ? "border-current bg-white/10" : "border-current/30 bg-white/5"
                )}>
                  <agency.icon size={16}/>
                </div>
                <div>
                  <span className="text-[10px] font-bold block">{agency.name}</span>
                  <span className="text-[8px] text-current/60 font-bold">{agency.units} UNITS AVAILABLE</span>
                </div>
              </div>

              <button
                onClick={() => escalate(agency.key)}
                disabled={status !== "idle"}
                className={cn(
                  "h-7 px-2.5 text-[9px] font-bold rounded-lg border transition-all",
                  status === "idle" ? "glass border-white/15 text-white hover:bg-white/10 cursor-pointer" :
                  status === "notifying" ? "bg-transparent border-transparent cursor-not-allowed opacity-70" :
                  "bg-transparent border-transparent cursor-default"
                )}
              >
                {status === "idle" && "ESCALATE"}
                {status === "notifying" && <span className="flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> NOTIFYING</span>}
                {status === "active" && <span className="flex items-center gap-1"><CheckCircle2 size={10}/> ACTIVE</span>}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={escalateAll}
        disabled={allEscalated}
        className={cn(
          "mt-auto w-full p-2.5 rounded-xl text-[10px] font-bold border transition-all",
          allEscalated
            ? "glass border-emerald-500/30 text-emerald-400 cursor-default"
            : "glass border-white/10 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5"
        )}
      >
        {allEscalated ? "✓ ALL AGENCIES NOTIFIED" : "ESCALATE ALL AGENCIES"}
      </button>
    </div>
  );
}
