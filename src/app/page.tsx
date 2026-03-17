"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import OfficerTracking from "@/components/dashboard/officer-tracking";
import CommandBar from "@/components/dashboard/command-bar";
import DispatchHub from "@/components/dashboard/dispatch-hub";
import PerformanceMetrics from "@/components/dashboard/performance-metrics";
import AgencyEscalation from "@/components/dashboard/agency-escalation";
import IntelPanel from "@/components/dashboard/intel-panel";
import PursuitBanner from "@/components/dashboard/pursuit-banner";
import DashboardShell from "@/components/dashboard/shell";
import {
  defaultTrafficNodes,
  defaultCameras,
  type TrafficNode,
  type TrafficState,
  type CctvCamera,
  type PursuitData,
  type MapTab,
} from "@/lib/pursuit-store";

const LimpopoMap = dynamic(() => import("@/components/dashboard/limpopo-map"), { ssr: false });

const DEFAULT_PURSUIT: PursuitData = {
  active: true,
  incidentId: "INC-4411",
  suspectId: "SUSPECT-ALPHA",
  suspectVehicle: "Silver Sedan · PLK-4**",
  suspectDirection: "NORTHBOUND",
  suspectSpeed: "~120 km/h",
  nextCamera: "CAM-102",
  currentCamera: "CAM-101",
  recommendedUnits: ["LIM-247", "LIM-334"],
  interceptionPoint: "N1 / Mankweng Junction",
  interceptionLat: -23.850,
  interceptionLng: 29.460,
  trafficAction: "N1 Corridor GREEN",
  elapsedSeconds: 0,
};

export default function DashboardPage() {
  const [trafficNodes, setTrafficNodes] = useState<TrafficNode[]>(defaultTrafficNodes);
  const [cameras, setCameras] = useState<CctvCamera[]>(defaultCameras);
  const [pursuit, setPursuit] = useState<PursuitData | null>(null);
  const [activeMapTab, setActiveMapTab] = useState<MapTab>("standard");

  const handleSetTrafficState = useCallback((id: string, state: TrafficState) => {
    setTrafficNodes(prev => prev.map(n => n.id === id ? { ...n, state } : n));
  }, []);

  const handleGreenCorridor = useCallback(() => {
    setTrafficNodes(prev => prev.map((n, i) => ({
      ...n,
      state: i <= 1 ? "green_corridor" : i === 2 ? "blocked" : n.state,
    })));
    setActiveMapTab("traffic");
  }, []);

  const handleResetTraffic = useCallback(() => {
    setTrafficNodes(defaultTrafficNodes);
  }, []);

  const handleActivatePursuit = useCallback(() => {
    setPursuit({ ...DEFAULT_PURSUIT, elapsedSeconds: 0 });
    setCameras(prev => prev.map((c, i) => ({ ...c, tracking: i < 2 })));
    setTrafficNodes(prev => prev.map((n, i) => ({
      ...n,
      state: i === 0 ? "green_corridor" : i === 1 ? "green_corridor" : i === 2 ? "held_red" : n.state,
    })));
    setActiveMapTab("pursuit");
  }, []);

  const handleCancelPursuit = useCallback(() => {
    setPursuit(null);
    setCameras(prev => prev.map(c => ({ ...c, tracking: false })));
    setTrafficNodes(defaultTrafficNodes);
    setActiveMapTab("standard");
  }, []);

  const handleCommand = useCallback((result: { type: string; action?: string }) => {
    if (result.action === "PURSUIT_MODE") {
      handleActivatePursuit();
    } else if (result.action === "GREEN_CORRIDOR") {
      handleGreenCorridor();
    } else if (result.action === "HOLD_RED") {
      setTrafficNodes(prev => prev.map((n, i) => i < 3 ? { ...n, state: "held_red" } : n));
      setActiveMapTab("traffic");
    } else if (result.action === "BLOCK") {
      setTrafficNodes(prev => prev.map((n, i) => i === 0 ? { ...n, state: "blocked" } : n));
      setActiveMapTab("traffic");
    } else if (result.action === "SHOW_CAMERAS") {
      setActiveMapTab("cameras");
    } else if (result.action === "TRACK_SUSPECT") {
      setCameras(prev => prev.map((c, i) => ({ ...c, tracking: i === 0 })));
      setActiveMapTab("cameras");
    } else if (result.action === "RESET_TRAFFIC") {
      handleResetTraffic();
    }
  }, [handleActivatePursuit, handleGreenCorridor, handleResetTraffic]);

  return (
    <DashboardShell pageTitle="SAPS LIMPOPO COMMAND" pageSubtitle="Provincial Operational Brain — Limpopo">
      <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden">
        <PerformanceMetrics/>

        {/* Pursuit Mode Banner */}
        {pursuit && (
          <PursuitBanner pursuit={pursuit} onCancel={handleCancelPursuit}/>
        )}

        <div className="flex-1 flex gap-5 min-h-0">
          {/* Left column */}
          <div className="w-72 flex flex-col gap-5 overflow-hidden flex-shrink-0">
            <div className="flex-1 overflow-hidden">
              <OfficerTracking/>
            </div>
            <div className="flex-shrink-0" style={{ height: "270px" }}>
              <DispatchHub/>
            </div>
          </div>

          {/* Center: Real Limpopo Map + Command */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex-1 min-h-0">
              <LimpopoMap
                trafficNodes={trafficNodes}
                cameras={cameras}
                pursuit={pursuit}
                activeMapTab={activeMapTab}
                onTabChange={setActiveMapTab}
              />
            </div>
            <CommandBar onCommand={handleCommand}/>
          </div>

          {/* Right column: tabbed intel panel + agency */}
          <div className="w-72 flex flex-col gap-4 overflow-hidden flex-shrink-0">
            <div className="flex-1 overflow-hidden min-h-0 glass rounded-xl p-3 border border-white/5">
              <IntelPanel
                trafficNodes={trafficNodes}
                cameras={cameras}
                pursuitActive={!!pursuit}
                onSetTrafficState={handleSetTrafficState}
                onGreenCorridor={handleGreenCorridor}
                onResetTraffic={handleResetTraffic}
              />
            </div>
            <div className="flex-shrink-0" style={{ height: "200px" }}>
              <AgencyEscalation/>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
