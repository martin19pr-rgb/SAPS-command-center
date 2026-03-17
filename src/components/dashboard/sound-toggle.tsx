"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export type SoundSettings = {
  enabled: boolean;
  critical: boolean;
  warnings: boolean;
  dispatch: boolean;
};

interface Props {
  onChange?: (settings: SoundSettings) => void;
}

export default function SoundToggle({ onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SoundSettings>({
    enabled: true,
    critical: true,
    warnings: true,
    dispatch: true,
  });

  const update = (patch: Partial<SoundSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    onChange?.(next);
  };

  const testSound = async () => {
    if (!settings.enabled) return;
    const { playCriticalAlert } = await import("@/lib/sounds");
    playCriticalAlert();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        title="Sound settings"
        className={cn(
          "p-2 rounded-lg transition-all",
          settings.enabled ? "text-primary hover:bg-white/10" : "text-muted-foreground hover:bg-white/10"
        )}
      >
        {settings.enabled ? <Volume2 size={17}/> : <VolumeX size={17}/>}
      </button>

      {open && (
        <div className="absolute right-0 bottom-12 w-52 glass rounded-xl border border-white/15 p-3 z-50 space-y-3 shadow-2xl animate-slide-in-right">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white flex items-center gap-2">
              <Bell size={12}/> Alert Sounds
            </span>
            <button
              onClick={() => update({ enabled: !settings.enabled })}
              className={cn(
                "w-8 h-4 rounded-full transition-colors relative",
                settings.enabled ? "bg-primary" : "bg-white/20"
              )}
            >
              <div className={cn(
                "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                settings.enabled ? "left-4" : "left-0.5"
              )}/>
            </button>
          </div>

          {settings.enabled && (
            <>
              <div className="border-t border-white/10 pt-2 space-y-2">
                {([
                  ["critical", "Critical Alerts", "text-destructive"],
                  ["warnings", "Warning Alerts", "text-orange-400"],
                  ["dispatch", "Dispatch Events", "text-primary"],
                ] as const).map(([key, label, color]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className={cn("text-[10px] font-bold", color)}>{label}</span>
                    <button
                      onClick={() => update({ [key]: !settings[key] })}
                      className={cn(
                        "w-7 h-3.5 rounded-full transition-colors relative",
                        settings[key] ? "bg-primary" : "bg-white/20"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all",
                        settings[key] ? "left-3.5" : "left-0.5"
                      )}/>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={testSound}
                className="w-full text-[10px] font-bold glass rounded-lg py-1.5 hover:bg-white/10 transition-colors text-muted-foreground"
              >
                TEST ALERT SOUND
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
