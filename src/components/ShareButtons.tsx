"use client";

import { useState } from "react";
import { Share2, Heart, Check } from "lucide-react";

export function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={copy}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-brand-600" /> : <Share2 className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button
        onClick={copy}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
      >
        <Heart className="h-3.5 w-3.5" /> Save
      </button>
    </div>
  );
}
