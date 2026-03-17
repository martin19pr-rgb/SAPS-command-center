
"use client";

import React, { useState } from "react";
import { Mic, Search, Send, Terminal } from "lucide-react";
import { naturalLanguageCommandInterface } from "@/ai/flows/natural-language-command-interface";

export default function CommandBar() {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await naturalLanguageCommandInterface({ commandText: command });
      console.log("Command Result:", result);
      // In a real app, this would trigger UI changes based on commandType
      setCommand("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 px-4">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center glass rounded-2xl p-1 shadow-2xl border-white/20 focus-within:border-primary/50 transition-all"
      >
        <div className="pl-4 pr-3 text-muted-foreground">
          <Terminal size={18} />
        </div>
        <input 
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Issue voice or text command (e.g., 'Locate Officer 247' or 'Show risk zones')..."
          className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium placeholder:text-muted-foreground/50"
        />
        <div className="flex items-center gap-2 pr-2">
          <button 
            type="button"
            className="p-2 text-muted-foreground hover:text-white transition-colors"
          >
            <Mic size={18} />
          </button>
          <button 
            type="submit"
            disabled={isProcessing}
            className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Send size={18} className={isProcessing ? "animate-pulse" : ""} />
          </button>
        </div>
      </form>
    </div>
  );
}
