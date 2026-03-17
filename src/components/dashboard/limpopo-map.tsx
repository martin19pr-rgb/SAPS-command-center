"use client";

import { useEffect, useRef, useState } from "react";
import { Wifi, Target, Radio, Navigation, Shield, TrafficCone, Camera, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrafficNode, CctvCamera, PursuitData, MapTab } from "@/lib/pursuit-store";

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
  critical: "#ef4444", high: "#f97316", medium: "#f97316", low: "#60a5fa",
};

const tlStateStyle: Record<string, { bg: string; glow: string; border: string }> = {
  normal:         { bg: "#6b7280", glow: "transparent",   border: "rgba(255,255,255,0.3)" },
  green_corridor: { bg: "#10b981", glow: "#10b981",        border: "rgba(16,185,129,0.8)" },
  held_red:       { bg: "#ef4444", glow: "#ef4444",        border: "rgba(239,68,68,0.8)" },
  blocked:        { bg: "#7f1d1d", glow: "transparent",   border: "rgba(127,29,29,0.7)" },
};

interface Props {
  trafficNodes?: TrafficNode[];
  cameras?: CctvCamera[];
  pursuit?: PursuitData | null;
  activeMapTab?: MapTab;
  onTabChange?: (tab: MapTab) => void;
}

export default function LimpopoMap({ trafficNodes = [], cameras = [], pursuit = null, activeMapTab, onTabChange }: Props) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalTab, setInternalTab] = useState<MapTab>("standard");
  const activeTab = activeMapTab ?? internalTab;
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

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);
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

    // Always show: incidents
    incidents.forEach(inc => {
      const color = sevColor[inc.severity];
      add(L.circleMarker([inc.lat, inc.lng], {
        radius: inc.severity === "critical" ? 11 : 8,
        color, fillColor: color, fillOpacity: 0.85, weight: 2,
      }).bindPopup(`
        <div style="font-family:sans-serif;font-size:11px">
          <div style="font-weight:700;color:${color};text-transform:uppercase;margin-bottom:4px">🚨 ${inc.label}</div>
          <div style="color:#9ca3af">${inc.district}</div>
          <div style="color:#9ca3af">Reported: ${inc.time}</div>
          <div style="color:${color};font-weight:700;text-transform:uppercase;margin-top:4px">${inc.severity} priority</div>
        </div>
      `));
    });

    // Always show: officers
    officers.forEach(off => {
      const color = off.status === "Enroute" ? "#3b82f6" : off.status === "At Scene" ? "#f97316" : "#6366f1";
      add(L.circleMarker([off.lat, off.lng], {
        radius: 7, color: "#fff", fillColor: color, fillOpacity: 1, weight: 1.5,
      }).bindPopup(`
        <div style="font-family:sans-serif;font-size:11px">
          <div style="font-weight:700;color:#fff;margin-bottom:4px">🚓 Officer ${off.id}</div>
          <div style="color:${color};font-weight:700">${off.status}</div>
        </div>
      `));
    });

    // Always show: citizens
    citizens.forEach(cit => {
      const color = cit.status === "SOS Active" ? "#ef4444" : "#10b981";
      add(L.circleMarker([cit.lat, cit.lng], {
        radius: 6, color: "#fff", fillColor: color, fillOpacity: 0.9, weight: 1.5,
      }).bindPopup(`
        <div style="font-family:sans-serif;font-size:11px">
          <div style="font-weight:700;color:#fff;margin-bottom:4px">🧍 Citizen ${cit.id}</div>
          <div style="color:${color};font-weight:700">${cit.status}</div>
        </div>
      `));
    });

    // Risk zones tab
    if (activeTab === "risk") {
      riskZones.forEach(z => {
        const color = z.level === "critical" ? "#ef4444" : z.level === "high" ? "#f97316" : "#eab308";
        add(L.circle([z.lat, z.lng], {
          radius: z.radius, color, fillColor: color, fillOpacity: 0.15, weight: 1.5, dashArray: "6 4",
        }).bindPopup(`<div style="font-family:sans-serif;font-size:11px;color:${color};font-weight:700;white-space:pre-line">${z.label}</div>`));
      });
    }

    // Traffic control tab
    if (activeTab === "traffic" && trafficNodes.length > 0) {
      trafficNodes.forEach(node => {
        const s = tlStateStyle[node.state] ?? tlStateStyle.normal;
        const icon = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:3px;background:${s.bg};border:2px solid ${s.border};box-shadow:0 0 8px ${s.glow};position:relative;">
            <div style="position:absolute;top:-1px;left:-1px;right:-1px;bottom:-1px;border-radius:2px;background:${s.bg};opacity:0.4;animation:pulse 2s infinite;"></div>
          </div>`,
          iconSize: [14, 14],
          className: "",
        });
        add(L.marker([node.lat, node.lng], { icon }).bindPopup(`
          <div style="font-family:sans-serif;font-size:11px">
            <div style="font-weight:700;color:${s.bg};text-transform:uppercase;margin-bottom:4px">🚦 ${node.id}</div>
            <div style="color:#fff;font-weight:600">${node.name}</div>
            <div style="color:#9ca3af">${node.district}</div>
            <div style="margin-top:4px;text-transform:uppercase;font-weight:700;color:${s.bg}">STATE: ${node.state.replace("_", " ")}</div>
          </div>
        `));
      });
    }

    // CCTV cameras tab
    if (activeTab === "cameras" && cameras.length > 0) {
      cameras.forEach(cam => {
        const color = cam.tracking ? "#3b82f6" : "#4b5563";
        const glow  = cam.tracking ? "#3b82f6" : "transparent";
        const icon = L.divIcon({
          html: `<div style="width:12px;height:10px;border-radius:2px;background:${color};border:1.5px solid rgba(255,255,255,0.5);box-shadow:0 0 8px ${glow};"></div>`,
          iconSize: [12, 10],
          className: "",
        });
        add(L.marker([cam.lat, cam.lng], { icon }).bindPopup(`
          <div style="font-family:sans-serif;font-size:11px">
            <div style="font-weight:700;color:${cam.tracking ? "#3b82f6" : "#fff"};text-transform:uppercase;margin-bottom:4px">📷 ${cam.id}</div>
            <div style="color:#fff;font-weight:600">${cam.name}</div>
            <div style="color:#9ca3af">${cam.type}</div>
            ${cam.tracking ? `<div style="margin-top:4px;color:#3b82f6;font-weight:700">● AI TRACKING ACTIVE</div>` : ""}
          </div>
        `));
      });
    }

    // Pursuit mode tab
    if (activeTab === "pursuit" && pursuit) {
      // Suspect route: dashed red line from incident to interception
      const incidentPos = incidents[0];
      const interceptPos = [pursuit.interceptionLat, pursuit.interceptionLng];

      // Suspect path (dashed red)
      add(L.polyline([[incidentPos.lat, incidentPos.lng], interceptPos], {
        color: "#ef4444", weight: 3, dashArray: "8 6", opacity: 0.85,
      }));

      // Police corridor (green)
      add(L.polyline([[-23.880, 29.450], interceptPos], {
        color: "#10b981", weight: 4, dashArray: "12 4", opacity: 0.85,
      }));

      // Interception zone
      add(L.circle(interceptPos, {
        radius: 2000, color: "#eab308", fillColor: "#eab308", fillOpacity: 0.15, weight: 2, dashArray: "6 4",
      }).bindPopup(`
        <div style="font-family:sans-serif;font-size:11px;color:#eab308;font-weight:700">
          🎯 AI INTERCEPTION ZONE<br/>${pursuit.interceptionPoint}
        </div>
      `));

      // Suspect marker
      const suspectIcon = L.divIcon({
        html: `<div style="width:18px;height:18px;border-radius:50%;background:#ef4444;border:2px solid #fff;box-shadow:0 0 12px #ef4444;display:flex;align-items:center;justify-content:center;font-size:9px;">🚗</div>`,
        iconSize: [18, 18], className: "",
      });
      add(L.marker([incidentPos.lat + 0.02, incidentPos.lng + 0.01], { icon: suspectIcon })
        .bindPopup(`<div style="font-family:sans-serif;font-size:11px;color:#ef4444;font-weight:700">🚗 SUSPECT: ${pursuit.suspectVehicle}</div>`));

      // Camera markers along route
      cameras.filter(c => c.tracking).forEach(cam => {
        const camIcon = L.divIcon({
          html: `<div style="width:14px;height:11px;border-radius:2px;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 10px #3b82f6;"></div>`,
          iconSize: [14, 11], className: "",
        });
        add(L.marker([cam.lat, cam.lng], { icon: camIcon })
          .bindPopup(`<div style="font-family:sans-serif;font-size:11px;color:#3b82f6;font-weight:700">📷 ${cam.id} — AI TRACKING</div>`));
      });
    }

  }, [mapReady, activeTab, trafficNodes, cameras, pursuit]);

  const handleTabChange = (tab: MapTab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const tabButtons: [MapTab, any, string][] = [
    ["standard", Target, "Standard"],
    ["risk",     Radio,       "Risk Zones"],
    ["patrol",   Navigation,  "Patrols"],
    ["traffic",  TrafficCone, "Traffic Ctrl"],
    ["cameras",  Camera,      "City Cameras"],
    ["pursuit",  Crosshair,   "Pursuit Mode"],
  ];

  return (
    <div className="relative w-full h-full glass rounded-xl overflow-hidden border-white/5 shadow-2xl">
      <div ref={containerRef} className="absolute inset-0 z-0"/>

      {/* HUD corners */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/60 pointer-events-none z-10"/>
      <div className="absolute top-3 right-20 w-5 h-5 border-t-2 border-r-2 border-primary/60 pointer-events-none z-10"/>
      <div className="absolute bottom-16 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/60 pointer-events-none z-10"/>

      {/* View controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
        {tabButtons.map(([id, Icon, label]) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            title={label}
            className={cn(
              "p-2 rounded-lg glass transition-all hover:bg-white/10 border",
              activeTab === id
                ? id === "pursuit"
                  ? "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/40"
                  : id === "traffic"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30"
                  : "bg-primary text-white border-primary shadow-lg shadow-primary/40"
                : "border-white/10"
            )}
          >
            <Icon size={14}/>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 glass rounded-lg p-2.5 z-20 space-y-1.5">
        <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
          <Shield size={10} className="text-primary"/> LIMPOPO
        </div>
        {activeTab === "traffic" ? (
          <>
            {[["bg-emerald-400", "Green Corridor"], ["bg-destructive", "Held Red"], ["bg-red-950", "Blocked"], ["bg-gray-500", "Normal"]].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-sm ${cls}`}/>
                <span className="text-[8px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </>
        ) : activeTab === "cameras" ? (
          <>
            {[["bg-primary", "AI Tracking"], ["bg-gray-500", "Camera"]].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-2 h-1.5 rounded-sm ${cls}`}/>
                <span className="text-[8px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </>
        ) : activeTab === "pursuit" ? (
          <>
            {[["bg-destructive", "Suspect Route"], ["bg-emerald-400", "Police Route"], ["bg-yellow-400", "Interception"], ["bg-primary", "CCTV Tracking"]].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3 h-0.5 ${cls}`}/>
                <span className="text-[8px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </>
        ) : (
          <>
            {[["bg-destructive", "Critical"], ["bg-orange-500", "Medium/High"], ["bg-blue-400", "Low"], ["bg-primary", "Officer"], ["bg-emerald-400", "EMS/Citizen"]].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${cls}`}/>
                <span className="text-[8px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </>
        )}
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
          {pursuit && (
            <div className="flex items-center gap-1.5 text-orange-400 animate-pulse">
              <Crosshair size={10}/>
              <span className="font-bold tracking-tight text-[10px]">PURSUIT ACTIVE</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[10px] tracking-widest">
          <Wifi size={11} className="text-emerald-400 animate-pulse"/>
          LIVE · {syncTime || "--:--:--"}
        </div>
      </div>
    </div>
  );
}
