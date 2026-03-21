"use client";

import DashboardShell from "@/components/dashboard/shell";
import { useState, useEffect } from "react";
import { Activity, Clock, MapPin, User, ChevronRight, Filter, Radio, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type IncidentStatus = "Active" | "Enroute" | "Resolved" | "Escalated";

interface Incident {
  id: string;
  type: string;
  location: string;
  district: string;
  officer: string;
  time: string;
  status: IncidentStatus;
  severity: "critical" | "medium" | "low";
  description: string;
}

const allIncidents: Incident[] = [
  { id: "#LMP-4451", type: "Armed Robbery", location: "Maseru CBD, Kingsway", district: "Maseru", officer: "LMP-247", time: "18:46", status: "Active", severity: "critical", description: "3 armed suspects, blue Toyota Hilux" },
  { id: "#LMP-4450", type: "Shooting", location: "Leribe Hospital Road", district: "Leribe", officer: "LMP-108", time: "18:44", status: "Enroute", severity: "critical", description: "1 victim, suspects fled on foot" },
  { id: "#LMP-4449", type: "Kidnapping", location: "Thaba-Tseka A3", district: "Thaba-Tseka", officer: "LMP-334", time: "18:41", status: "Escalated", severity: "critical", description: "AMBER alert issued, white VW Golf" },
  { id: "#LMP-4448", type: "Vehicle Hijacking", location: "Mokhotlong Main Road", district: "Mokhotlong", officer: "LMP-019", time: "18:39", status: "Enroute", severity: "medium", description: "Blue BMW 3-series, 2 suspects" },
  { id: "#LMP-4447", type: "Assault", location: "Butha-Buthe Market", district: "Butha-Buthe", officer: "LMP-891", time: "18:35", status: "Active", severity: "medium", description: "Domestic violence, suspect on scene" },
  { id: "#LMP-4446", type: "Civil Unrest", location: "Mohale's Hoek Main Road", district: "Mohale's Hoek", officer: "LMP-552", time: "18:31", status: "Active", severity: "low", description: "Community protest, roads blocked" },
  { id: "#LMP-4445", type: "Vehicle Theft", location: "Mafeteng Market Square", district: "Mafeteng", officer: "LMP-247", time: "18:20", status: "Resolved", severity: "medium", description: "Vehicle recovered, 1 arrested" },
  { id: "#LMP-4444", type: "House Break-in", location: "Qacha's Nek Ext 2", district: "Qacha's Nek", officer: "LMP-108", time: "17:55", status: "Resolved", severity: "low", description: "Suspects fled, scene secured" },
];

const statusColor: Record<IncidentStatus, string> = {
  Active: "text-destructive bg-destructive/10 border-destructive/30",
  Enroute: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  Escalated: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  Resolved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};
const severityDot: Record<string, string> = {
  critical: "bg-destructive",
  medium: "bg-orange-500",
  low: "bg-blue-400",
};

export default function ActivityPage() {
  const [filter, setFilter] = useState<IncidentStatus | "All">("All");
  const [selected, setSelected] = useState<Incident | null>(null);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTicker(p => p + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = filter === "All" ? allIncidents : allIncidents.filter(i => i.status === filter);
  const statusCounts = Object.fromEntries(
    (["Active", "Enroute", "Escalated", "Resolved"] as IncidentStatus[]).map(s => [s, allIncidents.filter(i => i.status === s).length])
  );

  return (
    <DashboardShell pageTitle="OPERATIONAL ACTIVITY" pageSubtitle="Kingdom of Lesotho — Live Incident Log">
      <div className="flex-1 p-5 flex gap-5 overflow-hidden">
        {/* Incident List */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Filter Bar */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5">
              <Filter size={12}/> FILTER:
            </span>
            {(["All", "Active", "Enroute", "Escalated", "Resolved"] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "text-[10px] font-bold px-3 py-1 rounded-full border transition-all",
                  filter === s ? "bg-primary text-white border-primary" : "glass border-white/10 text-muted-foreground hover:text-white"
                )}
              >
                {s}{s !== "All" && ` (${statusCounts[s as IncidentStatus] ?? 0})`}
              </button>
            ))}
          </div>

          {/* Incidents */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filtered.map(inc => (
              <div
                key={inc.id}
                onClick={() => setSelected(inc)}
                className={cn(
                  "glass p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5",
                  selected?.id === inc.id ? "border-primary/40 bg-primary/5" : "border-white/8"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", severityDot[inc.severity])}/>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-muted-foreground">{inc.id}</span>
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border", statusColor[inc.status])}>{inc.status}</span>
                      </div>
                      <p className="text-sm font-bold truncate">{inc.type}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={11} className="text-muted-foreground flex-shrink-0"/>
                        <span className="text-[10px] text-muted-foreground truncate">{inc.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={11}/>
                      <span className="text-[10px] font-mono font-bold">{inc.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <User size={11}/>
                      <span className="text-[10px] font-bold">{inc.officer}</span>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground"/>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 pl-5">{inc.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Stats + Detail */}
        <div className="w-72 flex flex-col gap-4 flex-shrink-0">
          {/* Summary stats */}
          <div className="glass rounded-xl p-4 border border-white/8">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Activity size={13}/> Today's Summary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Incidents", value: allIncidents.length, color: "text-white" },
                { label: "Active Now", value: statusCounts.Active, color: "text-destructive" },
                { label: "Enroute", value: statusCounts.Enroute, color: "text-blue-400" },
                { label: "Resolved", value: statusCounts.Resolved, color: "text-emerald-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center glass rounded-lg p-2.5 border border-white/5">
                  <p className={cn("text-xl font-bold font-headline", color)}>{value}</p>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Incident detail panel */}
          {selected ? (
            <div className="glass rounded-xl p-4 border border-primary/25 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Shield size={13}/> Incident Detail
                </h3>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-white transition-colors text-[10px]">✕</button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Reference</p>
                  <p className="text-sm font-bold font-mono">{selected.id}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Incident Type</p>
                  <p className="text-sm font-bold">{selected.type}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Location</p>
                  <p className="text-xs">{selected.location}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Description</p>
                  <p className="text-xs text-muted-foreground">{selected.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Assigned Officer</p>
                    <p className="text-xs font-bold text-primary">{selected.officer}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Time</p>
                    <p className="text-xs font-bold font-mono">{selected.time}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Status</p>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border", statusColor[selected.status])}>{selected.status}</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <button className="flex-1 text-[10px] font-bold bg-primary text-white rounded-lg py-2 hover:bg-primary/80 transition-colors">
                    DISPATCH UNIT
                  </button>
                  <button className="flex-1 text-[10px] font-bold glass border border-white/15 rounded-lg py-2 hover:bg-white/8 transition-colors">
                    ESCALATE
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-4 border border-white/8 flex-1 flex items-center justify-center">
              <p className="text-[10px] text-muted-foreground text-center">Select an incident to view full details and available actions.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
