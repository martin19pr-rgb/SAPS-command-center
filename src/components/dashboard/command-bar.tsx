"use client";

import React, { useState } from "react";
import { Mic, Send, Terminal, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { naturalLanguageCommandInterface } from "@/ai/flows/natural-language-command-interface";
import { cn } from "@/lib/utils";

type FeedbackState = "idle" | "processing" | "success" | "error";

const suggestions = [
  "Show all critical incidents",
  "Track Officer 247",
  "Display risk zones",
  "Escalate to EMS",
];

export default function CommandBar() {
  const [command, setCommand] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const handleSubmit = async (text = command) => {
    if (!text.trim()) return;
    setFeedback("processing");
    setLastResponse(null);
    try {
      const result = await naturalLanguageCommandInterface({ commandText: text });
      setLastResponse((result as any)?.response ?? "Command processed.");
      setFeedback("success");
      setCommand("");
    } catch {
      setFeedback("error");
    } finally {
      setTimeout(() => setFeedback("idle"), 4000);
    }
  };

  return (
    <div className="w-full px-2 pb-2 space-y-2">
      {/* Suggestion chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setCommand(s); handleSubmit(s); }}
            className="text-[9px] font-bold whitespace-nowrap px-2.5 py-1 glass rounded-full border border-white/10 hover:border-primary/40 hover:text-primary transition-all text-muted-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={e => { e.preventDefault(); handleSubmit(); }}
        className={cn(
          "relative flex items-center glass rounded-2xl p-1 shadow-2xl border transition-all",
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
          placeholder="Command (e.g. 'Locate Officer 247' · 'Show high-risk zones' · 'Dispatch nearest unit')…"
          className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium placeholder:text-muted-foreground/40"
          disabled={feedback === "processing"}
        />
        <div className="flex items-center gap-2 pr-2">
          {lastResponse && feedback === "success" && (
            <span className="text-[9px] text-emerald-400 font-bold max-w-[120px] truncate flex items-center gap-1">
              <CheckCircle2 size={10}/> {lastResponse}
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
            className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {feedback === "processing"
              ? <Loader2 size={16} className="animate-spin"/>
              : <Send size={16}/>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
