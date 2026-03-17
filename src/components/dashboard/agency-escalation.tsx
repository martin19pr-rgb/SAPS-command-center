"use client";

import React, { useState } from "react";
import { Siren, Truck, ShieldAlert, Share2, CheckCircle2, Loader2, Radio, PhoneCall, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type AgencyStatus = "idle" | "notifying" | "active";

interface Agency {
  key: string;
  name: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  activeColor: string;
  units: number;
  phone: string;
}

const agencies: Agency[] = [
  {
    key: "ems", name: "EMS LIMPOPO", sub: "Emergency Medical Services", icon: Siren, units: 7, phone: "10177",
    color: "bg-red-500/12 text-red-400 border-red-500/22",
    activeColor: "bg-red-500/22 text-red-300 border-red-400/45 shadow-red-500/15",
  },
  {
    key: "traffic", name: "TRAFFIC DEPT", sub: "Limpopo Traffic Police", icon: Truck, units: 12, phone: "0800 006 417",
    color: "bg-blue-500/12 text-blue-400 border-blue-500/22",
    activeColor: "bg-blue-500/22 text-blue-300 border-blue-400/45 shadow-blue-500/15",
  },
  {
    key: "private", name: "ADT / PRIVATE SEC", sub: "Private Security Response", icon: ShieldAlert, units: 9, phone: "ADT Direct",
    color: "bg-orange-500/12 text-orange-400 border-orange-500/22",
    activeColor: "bg-orange-500/22 text-orange-300 border-orange-400/45 shadow-orange-500/15",
  },
];

export default function AgencyEscalation() {
  const [statuses, setStatuses] = useState<Record<string, AgencyStatus>>({
    ems: "idle", traffic: "idle", private: "idle",
  });

  const escalate = (key: string) => {
    if (statuses[key] !== "idle") return;
    setStatuses(prev => ({ ...prev, [key]: "notifying" }));
    setTimeout(() => setStatuses(prev => ({ ...prev, [key]: "active" })), 1600);
  };

  const escalateAll = () => agencies.forEach(a => escalate(a.key));
  const activeCount = Object.values(statuses).filter(s => s === "active").length;
  const allEscalated = agencies.every(a => statuses[a.key] !== "idle");

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Share2 size={15}/> Emergency Links
        </h3>
        {activeCount > 0 && (
          <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
            <Radio size={10} className="animate-pulse"/> {activeCount} ACTIVE
          </span>
        )}
      </div>

      <div className="space-y-2">
        {agencies.map(agency => {
          const status = statuses[agency.key];
          return (
            <div
              key={agency.key}
              className={cn(
                "p-2.5 rounded-xl border glass flex items-center justify-between transition-all shadow-lg",
                status === "active" ? agency.activeColor : agency.color
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center border flex-shrink-0", "border-current/30 bg-white/5")}>
                  <agency.icon size={14}/>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold block truncate">{agency.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] text-current/50 font-bold">{agency.units} UNITS</span>
                    <span className="text-[8px] text-current/40">·</span>
                    <span className="text-[8px] text-current/50 font-mono">{agency.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {status === "active" && (
                  <Link href="/alerts" className="p-1 glass rounded border-current/20 hover:bg-white/10 transition-colors" title="View alerts">
                    <ExternalLink size={11}/>
                  </Link>
                )}
                <button
                  onClick={() => escalate(agency.key)}
                  disabled={status !== "idle"}
                  className={cn(
                    "h-7 px-2 text-[9px] font-bold rounded-lg border transition-all flex items-center gap-1",
                    status === "idle" ? "glass border-white/15 text-white hover:bg-white/10 cursor-pointer" :
                    status === "notifying" ? "bg-transparent border-transparent cursor-not-allowed opacity-60" :
                    "bg-transparent border-transparent cursor-default"
                  )}
                >
                  {status === "idle" && <><PhoneCall size={10}/> ALERT</>}
                  {status === "notifying" && <><Loader2 size={9} className="animate-spin"/> CALLING</>}
                  {status === "active" && <><CheckCircle2 size={9}/> LINKED</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={escalateAll}
        disabled={allEscalated}
        className={cn(
          "mt-auto w-full py-2 rounded-xl text-[10px] font-bold border transition-all",
          allEscalated
            ? "glass border-emerald-500/30 text-emerald-400 cursor-default"
            : "glass border-white/10 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5"
        )}
      >
        {allEscalated ? "✓ ALL AGENCIES LINKED" : "ESCALATE ALL AGENCIES"}
      </button>
    </div>
  );
}
