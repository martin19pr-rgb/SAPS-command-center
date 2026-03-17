
"use client";

import React from "react";
import { Siren, Truck, ShieldAlert, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgencyEscalation() {
  const agencies = [
    { name: "EMS (MEDICS)", icon: Siren, color: "bg-red-500/20 text-red-400 border-red-500/30" },
    { name: "TRAFFIC DEPT", icon: Truck, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { name: "PRIVATE SECURITY", icon: ShieldAlert, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-headline uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Share2 size={16} /> Agency Escalation
        </h3>
      </div>

      <div className="space-y-3">
        {agencies.map((agency, i) => (
          <div key={i} className={`p-4 rounded-xl border glass flex items-center justify-between group hover:border-white/20 transition-all ${agency.color}`}>
            <div className="flex items-center gap-3">
              <agency.icon size={20} />
              <span className="text-xs font-bold">{agency.name}</span>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-[10px] glass hover:bg-white/10 border-white/10 text-white">
              ESCALATE
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mt-auto p-3 glass rounded-xl border-dashed border-white/10 bg-white/5">
        <p className="text-[10px] text-muted-foreground leading-relaxed text-center italic">
          One-click escalation notifies all relevant agencies and shares real-time telemetry.
        </p>
      </div>
    </div>
  );
}
