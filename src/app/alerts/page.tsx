"use client";

import DashboardShell from "@/components/dashboard/shell";
import { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, CheckCircle2, Siren, PhoneCall, Radio, Volume2, VolumeX, Clock, MapPin, User, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
type AlertType = "PANIC" | "SHOOTING" | "ROBBERY" | "HIJACKING" | "EMS_REQUEST" | "DISPATCH" | "SIGNAL_LOST" | "SYSTEM";

interface AlertEntry {
  id: number;
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  detail: string;
  location: string;
  time: string;
  officer?: string;
  read: boolean;
  emsLinked?: boolean;
}

const initialAlerts: AlertEntry[] = [
  { id: 1, severity: "CRITICAL", type: "PANIC", message: "PANIC ALERT — Officer LIM-891", detail: "Officer heartrate 149bpm, device stationary. Last GPS: Louis Trichardt.", location: "Louis Trichardt", time: "18:49", officer: "LIM-891", read: false },
  { id: 2, severity: "CRITICAL", type: "SHOOTING", message: "ACTIVE SHOOTING — Tzaneen", detail: "Multiple gunshots reported. EMS requested. LIM-108 dispatched.", location: "Tzaneen Hospital Road", time: "18:44", officer: "LIM-108", read: false, emsLinked: true },
  { id: 3, severity: "CRITICAL", type: "ROBBERY", message: "ARMED ROBBERY — Polokwane CBD", detail: "3 armed suspects. Blue Toyota Hilux. SAPS tactical unit notified.", location: "Polokwane CBD", time: "18:46", officer: "LIM-247", read: false },
  { id: 4, severity: "HIGH", type: "HIJACKING", message: "VEHICLE HIJACKING — Phalaborwa", detail: "Blue BMW 3-series hijacked. ANPR cameras activated on N1.", location: "Phalaborwa Gate Road", time: "18:39", officer: "LIM-019", read: false },
  { id: 5, severity: "HIGH", type: "EMS_REQUEST", message: "EMS REQUEST — Giyani", detail: "3 injured in unrest. EMS dispatched from Giyani District Hospital.", location: "Giyani Main Road", time: "18:35", read: false, emsLinked: true },
  { id: 6, severity: "MEDIUM", type: "SIGNAL_LOST", message: "SIGNAL LOST — Officer LIM-334", detail: "GPS and radio signal lost. Last known: N1 near Louis Trichardt.", location: "N1 Louis Trichardt", time: "18:30", officer: "LIM-334", read: true },
  { id: 7, severity: "MEDIUM", type: "DISPATCH", message: "AUTO-DISPATCH — Armed Robbery #LIM-4451", detail: "LIM-247 automatically assigned. ETA 3.1 min. Override available.", location: "Polokwane CBD", time: "18:46", officer: "LIM-247", read: true },
  { id: 8, severity: "INFO", type: "SYSTEM", message: "AI Predictive Alert — Evening Crime Peak", detail: "Historical data shows 40% increase in crime between 18:00–21:00. Additional patrols recommended for Polokwane CBD.", location: "Polokwane", time: "18:00", read: true },
];

const severityStyle: Record<AlertSeverity, string> = {
  CRITICAL: "border-destructive/40 bg-destructive/8",
  HIGH: "border-orange-500/40 bg-orange-500/5",
  MEDIUM: "border-yellow-500/30 bg-yellow-500/5",
  INFO: "border-blue-500/30 bg-blue-500/5",
};
const severityLabel: Record<AlertSeverity, string> = {
  CRITICAL: "text-destructive bg-destructive/15 border-destructive/30",
  HIGH: "text-orange-400 bg-orange-500/15 border-orange-500/30",
  MEDIUM: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
  INFO: "text-blue-400 bg-blue-500/15 border-blue-500/30",
};

const typeIcon: Record<AlertType, React.ElementType> = {
  PANIC: ShieldAlert,
  SHOOTING: AlertTriangle,
  ROBBERY: AlertTriangle,
  HIJACKING: AlertTriangle,
  EMS_REQUEST: Siren,
  DISPATCH: Radio,
  SIGNAL_LOST: PhoneCall,
  SYSTEM: Bell,
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<AlertSeverity | "All">("All");
  const [soundOn, setSoundOn] = useState(true);
  const soundTimeout = useRef<ReturnType<typeof setTimeout>>();

  const unread = alerts.filter(a => !a.read).length;

  useEffect(() => {
    if (!soundOn) return;
    const hasCritical = alerts.some(a => !a.read && a.severity === "CRITICAL");
    if (hasCritical) {
      soundTimeout.current = setTimeout(async () => {
        const { playCriticalAlert } = await import("@/lib/sounds");
        playCriticalAlert();
      }, 500);
    }
    return () => clearTimeout(soundTimeout.current);
  }, []);

  const markRead = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));

  const filtered = filter === "All" ? alerts : alerts.filter(a => a.severity === filter);

  return (
    <DashboardShell pageTitle="ALERT CENTRE" pageSubtitle="Limpopo Province — Real-Time Notifications">
      <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground font-bold">FILTER:</span>
            {(["All", "CRITICAL", "HIGH", "MEDIUM", "INFO"] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "text-[10px] font-bold px-3 py-1 rounded-full border transition-all",
                  filter === s ? "bg-primary text-white border-primary" : "glass border-white/10 text-muted-foreground hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundOn(p => !p)}
              className={cn(
                "p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold glass border",
                soundOn ? "border-primary/30 text-primary" : "border-white/10 text-muted-foreground"
              )}
            >
              {soundOn ? <Volume2 size={13}/> : <VolumeX size={13}/>}
              {soundOn ? "SOUND ON" : "SOUND OFF"}
            </button>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-bold glass border border-white/10 px-3 py-1 rounded-full hover:bg-white/8 text-muted-foreground transition-all">
                MARK ALL READ ({unread})
              </button>
            )}
          </div>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filtered.map(alert => {
            const Icon = typeIcon[alert.type];
            return (
              <div
                key={alert.id}
                onClick={() => markRead(alert.id)}
                className={cn(
                  "glass p-4 rounded-xl border cursor-pointer transition-all hover:brightness-110",
                  severityStyle[alert.severity],
                  !alert.read && "ring-1 ring-inset ring-white/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border",
                    alert.severity === "CRITICAL" ? "bg-destructive/20 text-destructive border-destructive/30" :
                    alert.severity === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                    alert.severity === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                    "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  )}>
                    <Icon size={17} className={!alert.read && alert.severity === "CRITICAL" ? "animate-pulse" : ""}/>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border", severityLabel[alert.severity])}>
                        {alert.severity}
                      </span>
                      <span className="text-[9px] glass border border-white/10 px-1.5 py-0.5 rounded font-bold text-muted-foreground">
                        {alert.type.replace("_", " ")}
                      </span>
                      {!alert.read && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"/>}
                      {alert.emsLinked && (
                        <span className="text-[9px] bg-red-500/20 border border-red-500/30 text-red-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                          <Siren size={8}/> EMS LINKED
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] font-bold mb-1">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground">{alert.detail}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={10}/><span className="text-[9px]">{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock size={10}/><span className="text-[9px] font-mono">{alert.time}</span>
                      </div>
                      {alert.officer && (
                        <div className="flex items-center gap-1 text-primary">
                          <User size={10}/><span className="text-[9px] font-bold">{alert.officer}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {alert.severity === "CRITICAL" && !alert.read && (
                      <button
                        className="text-[9px] font-bold bg-destructive/20 border border-destructive/30 text-destructive px-2 py-1 rounded-lg hover:bg-destructive/30 transition-colors"
                        onClick={e => { e.stopPropagation(); markRead(alert.id); }}
                      >
                        RESPOND
                      </button>
                    )}
                    {alert.emsLinked && (
                      <button className="text-[9px] font-bold bg-red-500/15 border border-red-500/30 text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/25 transition-colors">
                        VIEW EMS
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
