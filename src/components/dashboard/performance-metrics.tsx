
"use client";

import React from "react";
import { Clock, AlertTriangle, Users, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PerformanceMetrics() {
  const metrics = [
    { label: "AVG RESPONSE TIME", value: "4.8m", trend: "-12%", icon: Clock, color: "text-emerald-400" },
    { label: "ACTIVE INCIDENTS", value: "14", trend: "+2", icon: AlertTriangle, color: "text-orange-400" },
    { label: "OFFICER UTILIZATION", value: "88%", trend: "OPTIMAL", icon: Users, color: "text-primary" },
    { label: "RESOLUTION RATE", value: "94.2%", trend: "HIGH", icon: CheckCircle, color: "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <Card key={i} className="glass p-4 border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">{m.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-headline font-bold">{m.value}</span>
              <span className={`text-[10px] font-bold ${m.trend.startsWith('-') || m.trend === 'OPTIMAL' ? 'text-emerald-400' : 'text-orange-400'}`}>
                {m.trend}
              </span>
            </div>
          </div>
          <m.icon className={m.color} size={20} />
        </Card>
      ))}
    </div>
  );
}
