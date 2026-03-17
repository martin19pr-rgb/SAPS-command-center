"use client";

import dynamic from "next/dynamic";
import VideoIntelligence from "@/components/dashboard/video-intelligence";
import OfficerTracking from "@/components/dashboard/officer-tracking";
import CommandBar from "@/components/dashboard/command-bar";
import DispatchHub from "@/components/dashboard/dispatch-hub";
import PerformanceMetrics from "@/components/dashboard/performance-metrics";
import AgencyEscalation from "@/components/dashboard/agency-escalation";
import DashboardShell from "@/components/dashboard/shell";

const LimpopoMap = dynamic(() => import("@/components/dashboard/limpopo-map"), { ssr: false });

export default function DashboardPage() {
  return (
    <DashboardShell pageTitle="SAPS LIMPOPO COMMAND" pageSubtitle="Provincial Operational Brain — Limpopo">
      <div className="flex-1 p-5 flex flex-col gap-5 overflow-hidden">
        <PerformanceMetrics/>

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

          {/* Center: Real Limpopo Map */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">
            <div className="flex-1 min-h-0">
              <LimpopoMap/>
            </div>
            <CommandBar/>
          </div>

          {/* Right column */}
          <div className="w-72 flex flex-col gap-5 overflow-hidden flex-shrink-0">
            <div className="flex-1 overflow-hidden min-h-0">
              <VideoIntelligence/>
            </div>
            <div className="flex-shrink-0" style={{ height: "220px" }}>
              <AgencyEscalation/>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
