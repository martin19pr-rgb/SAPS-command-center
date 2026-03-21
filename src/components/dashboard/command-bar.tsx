"use client";

import React, { useState } from "react";
import { Mic, Send, Terminal, CheckCircle2, AlertCircle, Loader2, TrafficCone, Camera, Crosshair, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommandType } from "@/lib/pursuit-store";

type FeedbackState = "idle" | "processing" | "success" | "error";

interface CommandResult {
  type: CommandType;
  response: string;
  action?: string;
}

const suggestions = [
  { text: "Green corridor to Maseru CBD", icon: TrafficCone, type: "TRAFFIC" as CommandType },
  { text: "Show cameras near incident", icon: Camera, type: "CAMERA" as CommandType },
  { text: "Activate pursuit mode", icon: Crosshair, type: "PURSUIT" as CommandType },
  { text: "Escalate to EMS", icon: Radio, type: "DISPATCH" as CommandType },
  { text: "Block Kingsway intersection", icon: TrafficCone, type: "TRAFFIC" as CommandType },
  { text: "Track suspect north on A1", icon: Camera, type: "CAMERA" as CommandType },
];

function parseSmartCommand(text: string): CommandResult {
  const lower = text.toLowerCase();

  if (lower.includes("pursuit") || lower.includes("chase") || lower.includes("suspect vehicle")) {
    return {
      type: "PURSUIT",
      response: "Pursuit mode activated. AI tracking all cameras. Green corridor A1 northbound. Blocking east exits.",
      action: "PURSUIT_MODE",
    };
  }

  if (lower.includes("green corridor") || lower.includes("open route") || lower.includes("clear path")) {
    const route = lower.includes("a1") ? "A1 Northbound" : lower.includes("a2") ? "A2 South" : "Police Route";
    return {
      type: "TRAFFIC",
      response: `Green corridor activated on ${route}. 4 intersections set to priority green. Estimated clear time: 2 min.`,
      action: "GREEN_CORRIDOR",
    };
  }

  if (lower.includes("hold red") || lower.includes("held red") || lower.includes("stop traffic")) {
    return {
      type: "TRAFFIC",
      response: "Intersections held red for 120 seconds. Kingsway, Moshoeshoe Rd — all exits locked. Suspect routes blocked.",
      action: "HOLD_RED",
    };
  }

  if (lower.includes("block") && (lower.includes("intersection") || lower.includes("street") || lower.includes("road") || lower.includes("exit"))) {
    return {
      type: "TRAFFIC",
      response: "Intersection blocked. Traffic diverted. Officers notified. Estimated duration: 8 minutes.",
      action: "BLOCK",
    };
  }

  if (lower.includes("camera") || lower.includes("cctv") || lower.includes("feed") || lower.includes("footage")) {
    const loc = lower.includes("maseru") ? "Maseru CBD" : lower.includes("a1") ? "A1 Corridor" : "incident radius";
    return {
      type: "CAMERA",
      response: `Fetching cameras near ${loc}. CAM-101, CAM-102, CAM-103 now live. AI scanning for suspects.`,
      action: "SHOW_CAMERAS",
    };
  }

  if (lower.includes("track") && (lower.includes("suspect") || lower.includes("north") || lower.includes("south"))) {
    return {
      type: "CAMERA",
      response: "AI tracking activated on CAM-101 → CAM-102. Suspect: male, red jacket, northbound. Next camera: CAM-102 (A1 Checkpoint).",
      action: "TRACK_SUSPECT",
    };
  }

  if (lower.includes("dispatch") || lower.includes("nearest unit") || lower.includes("send unit")) {
    return {
      type: "DISPATCH",
      response: "Dispatching LMP-247 — 1.4km from incident. ETA 3.1 min. Officer notified via radio.",
      action: "DISPATCH",
    };
  }

  if (lower.includes("escalate") || lower.includes("ems") || lower.includes("medical") || lower.includes("ambulance")) {
    return {
      type: "DISPATCH",
      response: "EMS Lesotho notified. 7 units available. Code red dispatch to Maseru CBD. ETA ~6 minutes.",
      action: "ESCALATE_EMS",
    };
  }

  if (lower.includes("risk zone") || lower.includes("high risk") || lower.includes("danger")) {
    return {
      type: "INFO",
      response: "Displaying 3 active risk zones: Maseru CBD (critical), Leribe (high), Mafeteng (medium). Heat analysis updated.",
    };
  }

  if (lower.includes("officer") || lower.includes("locate") || lower.includes("track officer")) {
    const offId = (text.match(/\b(LMP-?\d+|\d{3})\b/i) || ["LMP-247"])[0];
    return {
      type: "INFO",
      response: `Officer ${offId} located: -29.300° / 27.490°. Status: Enroute. BPM: 112. Battery: 84%. ETA to scene: 2.1 min.`,
    };
  }

  if (lower.includes("restore") || lower.includes("reset traffic") || lower.includes("normal")) {
    return {
      type: "TRAFFIC",
      response: "All traffic systems restored to normal. 7 intersections reverted. Corridor deactivated.",
      action: "RESET_TRAFFIC",
    };
  }

  return {
    type: "GENERAL",
    response: `Command processed: "${text}". LMPS AI brain is analysing and routing to the appropriate system.`,
  };
}

const typeIcon: Record<CommandType, React.ReactNode> = {
  TRAFFIC:  <TrafficCone size={10}/>,
  CAMERA:   <Camera size={10}/>,
  PURSUIT:  <Crosshair size={10}/>,
  DISPATCH: <Radio size={10}/>,
  INFO:     <Terminal size={10}/>,
  GENERAL:  <Terminal size={10}/>,
};
const typeColor: Record<CommandType, string> = {
  TRAFFIC:  "text-emerald-400",
  CAMERA:   "text-blue-400",
  PURSUIT:  "text-orange-400",
  DISPATCH: "text-yellow-400",
  INFO:     "text-muted-foreground",
  GENERAL:  "text-muted-foreground",
};

interface Props {
  onCommand?: (result: CommandResult) => void;
}

export default function CommandBar({ onCommand }: Props) {
  const [command, setCommand] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [lastResult, setLastResult] = useState<CommandResult | null>(null);

  const handleSubmit = async (text = command) => {
    if (!text.trim()) return;
    setFeedback("processing");
    setLastResult(null);

    await new Promise(r => setTimeout(r, 650));

    const result = parseSmartCommand(text);
    setLastResult(result);
    setFeedback("success");
    setCommand("");
    onCommand?.(result);

    setTimeout(() => setFeedback("idle"), 6000);
  };

  return (
    <div className="w-full px-2 pb-2 space-y-2">
      {/* Suggestion chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {suggestions.map(s => (
          <button
            key={s.text}
            onClick={() => handleSubmit(s.text)}
            className={cn(
              "text-[9px] font-bold whitespace-nowrap px-2.5 py-1 glass rounded-full border border-white/10 hover:border-primary/40 hover:text-primary transition-all text-muted-foreground flex items-center gap-1"
            )}
          >
            <s.icon size={9}/> {s.text}
          </button>
        ))}
      </div>

      <form
        onSubmit={e => { e.preventDefault(); handleSubmit(); }}
        className={cn(
          "relative flex items-center glass rounded-2xl p-1 shadow-2xl border transition-all",
          feedback === "success" && lastResult?.type === "PURSUIT" ? "border-orange-500/50 shadow-orange-500/10" :
          feedback === "success" && lastResult?.type === "TRAFFIC" ? "border-emerald-500/40" :
          feedback === "success" && lastResult?.type === "CAMERA"  ? "border-blue-500/40" :
          feedback === "success" ? "border-emerald-500/40" :
          feedback === "error" ? "border-destructive/40" :
          feedback === "processing" ? "border-primary/50 shadow-primary/10" :
          "border-white/15 focus-within:border-primary/40"
        )}
      >
        <div className="pl-4 pr-3 text-muted-foreground">
          <Terminal size={16}/>
        </div>
        <input
          type="text"
          value={command}
          onChange={e => setCommand(e.target.value)}
          placeholder="'Green corridor to CBD' · 'Activate pursuit' · 'Block Kingsway' · 'Show cameras near incident'…"
          className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium placeholder:text-muted-foreground/40"
          disabled={feedback === "processing"}
        />
        <div className="flex items-center gap-2 pr-2">
          {lastResult && feedback === "success" && (
            <span className={cn("text-[9px] font-bold max-w-[180px] truncate flex items-center gap-1", typeColor[lastResult.type])}>
              {typeIcon[lastResult.type]}
              {lastResult.response}
            </span>
          )}
          {feedback === "error" && (
            <span className="text-[9px] text-destructive font-bold flex items-center gap-1">
              <AlertCircle size={10}/> Failed
            </span>
          )}
          <button type="button" className="p-2 text-muted-foreground hover:text-white transition-colors" title="Voice command">
            <Mic size={16}/>
          </button>
          <button
            type="submit"
            disabled={feedback === "processing" || !command.trim()}
            className={cn(
              "text-white p-2 rounded-xl transition-all disabled:opacity-50",
              lastResult?.type === "PURSUIT" ? "bg-orange-500 hover:bg-orange-400" :
              lastResult?.type === "TRAFFIC" ? "bg-emerald-600 hover:bg-emerald-500" :
              "bg-primary hover:bg-primary/90"
            )}
          >
            {feedback === "processing"
              ? <Loader2 size={16} className="animate-spin"/>
              : <Send size={16}/>
            }
          </button>
        </div>
      </form>

      {/* Full response strip */}
      {lastResult && feedback === "success" && (
        <div className={cn(
          "glass rounded-xl border px-3 py-2 flex items-start gap-2 transition-all",
          typeColor[lastResult.type],
          lastResult.type === "PURSUIT" ? "border-orange-500/25 bg-orange-950/15" :
          lastResult.type === "TRAFFIC" ? "border-emerald-500/20 bg-emerald-950/10" :
          lastResult.type === "CAMERA"  ? "border-blue-500/20 bg-blue-950/10" :
          "border-white/10"
        )}>
          <div className="flex-shrink-0 mt-0.5">{typeIcon[lastResult.type]}</div>
          <div>
            <span className="text-[8px] font-bold uppercase opacity-70">{lastResult.type} COMMAND</span>
            <p className="text-[10px] font-medium text-white">{lastResult.response}</p>
          </div>
        </div>
      )}
    </div>
  );
}
