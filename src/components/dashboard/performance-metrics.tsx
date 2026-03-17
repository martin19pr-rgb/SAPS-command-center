"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, Users, CheckCircle, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: string;
  rawValue: number;
  trend: string;
  trendDir: "down" | "up" | "neutral";
  trendGood: boolean;
  icon: React.ElementType;
  color: string;
  accent: string;
  unit: string;
}

const baseMetrics: Omit<Metric, "value">[] = [
  {
    label: "AVG RESPONSE TIME", rawValue: 4.8, trend: "-12%", trendDir: "down", trendGood: true,
    icon: Clock, color: "text-emerald-400", accent: "bg-emerald-500/10 border-emerald-500/20", unit: "m",
  },
  {
    label: "ACTIVE INCIDENTS", rawValue: 14, trend: "+2", trendDir: "up", trendGood: false,
    icon: AlertTriangle, color: "text-orange-400", accent: "bg-orange-500/10 border-orange-500/20", unit: "",
  },
  {
    label: "OFFICER UTILIZATION", rawValue: 88, trend: "OPTIMAL", trendDir: "neutral", trendGood: true,
    icon: Users, color: "text-primary", accent: "bg-primary/10 border-primary/20", unit: "%",
  },
  {
    label: "RESOLUTION RATE", rawValue: 94.2, trend: "HIGH", trendDir: "neutral", trendGood: true,
    icon: CheckCircle, color: "text-emerald-400", accent: "bg-emerald-500/10 border-emerald-500/20", unit: "%",
  },
];

export default function PerformanceMetrics() {
  const [values, setValues] = useState(baseMetrics.map(m => m.rawValue));

  useEffect(() => {
    const t = setInterval(() => {
      setValues(prev => prev.map((v, i) => {
        const delta = (Math.random() - 0.5) * 0.4;
        const clamped = Math.max(0, v + delta);
        return Math.round(clamped * 10) / 10;
      }));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const metrics = baseMetrics.map((m, i) => ({
    ...m,
    value: `${values[i]}${m.unit}`,
  }));

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((m, i) => {
        const TrendIcon = m.trendDir === "down" ? TrendingDown : m.trendDir === "up" ? TrendingUp : Minus;
        return (
          <Card key={i} className={cn("glass p-4 border flex items-center justify-between gap-3 relative overflow-hidden", m.accent)}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"/>
            <div className="space-y-1 min-w-0">
              <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase leading-none">{m.label}</p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xl font-headline font-bold tabular-nums">{m.value}</span>
                <span className={cn(
                  "text-[9px] font-bold flex items-center gap-0.5",
                  m.trendGood ? "text-emerald-400" : "text-orange-400"
                )}>
                  <TrendIcon size={10}/>
                  {m.trend}
                </span>
              </div>
            </div>
            <div className={cn("p-2 rounded-xl flex-shrink-0", m.accent)}>
              <m.icon className={m.color} size={18}/>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
