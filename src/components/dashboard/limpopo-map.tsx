"use client";

import { useEffect, useRef, useState } from "react";
import { Wifi, Target, Radio, Navigation, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "standard" | "risk" | "patrol";

const LIMPOPO_CENTER: [number, number] = [-23.9, 29.45];

const incidents = [
  { id: 1, lat: -23.9045, lng: 29.4679, severity: "critical", label: "ARMED ROBBERY", district: "Polokwane CBD", time: "18:46" },
  { id: 2, lat: -23.8333, lng: 30.1667, severity: "critical", label: "SHOOTING", district: "Tzaneen", time: "18:44" },
  { id: 3, lat: -22.9500, lng: 30.4833, severity: "medium",   label: "HIJACKING", district: "Thohoyandou", time: "18:39" },
  { id: 4, lat: -23.3167, lng: 30.7167, severity: "low",      label: "CIVIL UNREST", district: "Giyani", time: "18:31" },
  { id: 5, lat: -24.1833, lng: 28.9667, severity: "medium",   label: "ASSAULT", district: "Mokopane", time: "18:38" },
  { id: 6, lat: -23.0500, lng: 29.9000, severity: "critical", label: "KIDNAPPING", district: "Louis Trichardt", time: "18:49" },
  { id: 7, lat: -23.9333, lng: 31.1333, severity: "medium",   label: "VEHICLE THEFT", district: "Phalaborwa", time: "18:35" },
];

const officers = [
  { id: "LIM-247", lat: -23.880, lng: 29.450, status: "Enroute" },
  { id: "LIM-108", lat: -23.920, lng: 30.160, status: "At Scene" },
  { id: "LIM-552", lat: -22.940, lng: 30.480, status: "Standby" },
  { id: "LIM-891", lat: -24.190, lng: 28.970, status: "At Scene" },
  { id: "LIM-334", lat: -23.060, lng: 29.890, status: "Enroute" },
  { id: "LIM-019", lat: -23.940, lng: 31.130, status: "Standby" },
];

const citizens = [
  { id: "CIT-001", lat: -23.895, lng: 29.471, status: "SOS Active" },
  { id: "CIT-002", lat: -23.840, lng: 30.172, status: "Monitoring" },
];

const riskZones = [
  { lat: -23.9045, lng: 29.4679, label: "HIGH ROBBERY RISK\n18:00–21:00", radius: 5000, level: "critical" },
  { lat: -23.8333, lng: 30.1667, label: "GANG ACTIVITY", radius: 3500, level: "high" },
  { lat: -22.9500, lng: 30.4833, label: "BORDER RISK ZONE", radius: 4000, level: "medium" },
];

const sevColor: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f97316",
  low: "#60a5fa",
};

export default function LimpopoMap() {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("standard");
  const [syncTime, setSyncTime] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const layersRef = useRef<any[]>([]);

  useEffect(() => {
    setSyncTime(new Date().toLocaleTimeString());
    const t = setInterval(() => setSyncTime(new Date().toLocaleTimeString()), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then(L => {
      if (!containerRef.current) return;
      // Clean up any stale Leaflet instance on the container (happens during Fast Refresh)
      const el = containerRef.current as any;
      if (el._leaflet_id) {
        try { mapRef.current?.remove(); } catch {}
        mapRef.current = null;
        el._leaflet_id = undefined;
      }
      if (mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current, {
        center: LIMPOPO_CENTER,
        zoom: 8,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch {}
        mapRef.current = null;
      }
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const L = require("leaflet");

    layersRef.current.forEach(l => { try { mapRef.current.removeLayer(l); } catch {} });
    layersRef.current = [];

    const add = (layer: any) => { layer.addTo(mapRef.current); layersRef.current.push(layer); };

    incidents.forEach(inc => {
      const color = sevColor[inc.severity];
      const circle = L.circleMarker([inc.lat, inc.lng], {
        radius: inc.severity === "critical" ? 11 : 8,
        color,
        fillColor: color,
        fillOpacity: 0.85,
        weight: 2,
      }).bindPopup(`
        <div style="font-family:sans-serif;font-size:11px">
          <div style="font-weight:700;color:${color};text-transform:uppercase;margin-bottom:4px">🚨 ${inc.label}</div>
          <div style="color:#9ca3af">${inc.district}</div>
          <div style="color:#9ca3af">Reported: ${inc.time}</div>
          <div style="color:${color};font-weight:700;text-transform:uppercase;margin-top:4px">${inc.severity} priority</div>
        </div>
      `);
      add(circle);
    });

    officers.forEach(off => {
      const color = off.status === "Enroute" ? "#3b82f6" : off.status === "At Scene" ? "#f97316" : "#6366f1";
      const marker = L.circleMarker([off.lat, off.lng], {
        radius: 7,
        color: "#fff",
        fillColor: color,
        fillOpacity: 1,
        weight: 1.5,
      }).bindPopup(`
        <div style="font-family:sans-serif;font-size:11px">
          <div style="font-weight:700;color:#fff;margin-bottom:4px">🚓 Officer ${off.id}</div>
          <div style="color:${color};font-weight:700">${off.status}</div>
        </div>
      `);
      add(marker);
    });

    citizens.forEach(cit => {
      const color = cit.status === "SOS Active" ? "#ef4444" : "#10b981";
      const marker = L.circleMarker([cit.lat, cit.lng], {
        radius: 6,
        color: "#fff",
        fillColor: color,
        fillOpacity: 0.9,
        weight: 1.5,
      }).bindPopup(`
        <div style="font-family:sans-serif;font-size:11px">
          <div style="font-weight:700;color:#fff;margin-bottom:4px">🧍 Citizen ${cit.id}</div>
          <div style="color:${color};font-weight:700">${cit.status}</div>
        </div>
      `);
      add(marker);
    });

    if (activeTab === "risk") {
      riskZones.forEach(z => {
        const color = z.level === "critical" ? "#ef4444" : z.level === "high" ? "#f97316" : "#eab308";
        const circle = L.circle([z.lat, z.lng], {
          radius: z.radius,
          color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: "6 4",
        }).bindPopup(`
          <div style="font-family:sans-serif;font-size:11px;color:${color};font-weight:700;white-space:pre-line">${z.label}</div>
        `);
        add(circle);
      });
    }
  }, [mapReady, activeTab]);

  return (
    <div className="relative w-full h-full glass rounded-xl overflow-hidden border-white/5 shadow-2xl">
      <div ref={containerRef} className="absolute inset-0 z-0"/>

      {/* HUD corners */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/60 pointer-events-none z-10"/>
      <div className="absolute top-3 right-16 w-5 h-5 border-t-2 border-r-2 border-primary/60 pointer-events-none z-10"/>
      <div className="absolute bottom-16 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/60 pointer-events-none z-10"/>

      {/* View controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        {([["standard", Target, "Standard"], ["risk", Radio, "Risk Zones"], ["patrol", Navigation, "Patrols"]] as const).map(([id, Icon, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as Tab)}
            title={label}
            className={cn(
              "p-2 rounded-lg glass transition-all hover:bg-white/10",
              activeTab === id && "bg-primary text-white border-primary shadow-lg shadow-primary/40"
            )}
          >
            <Icon size={15}/>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 glass rounded-lg p-2.5 z-20 space-y-1.5">
        <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
          <Shield size={10} className="text-primary"/> LIMPOPO
        </div>
        {[["bg-destructive", "Critical"], ["bg-orange-500", "Medium/High"], ["bg-blue-400", "Low"], ["bg-primary", "Officer"], ["bg-emerald-400", "EMS/Citizen"]].map(([cls, label]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cls}`}/>
            <span className="text-[8px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div className="absolute bottom-4 left-4 right-4 p-2.5 glass rounded-lg flex items-center justify-between z-20 border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"/>
            <span className="font-bold tracking-tight text-[10px]">{incidents.filter(i => i.severity === "critical").length} CRITICAL</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-400">
            <div className="w-2 h-2 rounded-full bg-orange-500"/>
            <span className="font-bold tracking-tight text-[10px]">{incidents.filter(i => i.severity === "medium").length} MEDIUM</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary"/>
            <span className="font-bold tracking-tight text-[10px]">{officers.length} UNITS</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[10px] tracking-widest">
          <Wifi size={11} className="text-emerald-400 animate-pulse"/>
          LIVE · {syncTime || "--:--:--"}
        </div>
      </div>
    </div>
  );
}
