"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminProviderActions({
  providerId,
  isVerified,
  isActive,
}: {
  providerId: string;
  isVerified: boolean;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  const run = (action: string) => {
    setResult(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/providers/${providerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setResult(action);
        setTimeout(() => window.location.reload(), 900);
      } else {
        setResult("error");
      }
    });
  };

  const btn =
    "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50";

  return (
    <div className="flex items-center gap-1.5">
      {!isVerified && (
        <button
          onClick={() => run("approve")}
          disabled={isPending}
          className={cn(btn, "bg-brand-50 text-brand-700 hover:bg-brand-100")}
          title="Verify provider"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          Verify
        </button>
      )}
      <button
        onClick={() => run(isActive ? "deactivate" : "activate")}
        disabled={isPending}
        className={cn(
          btn,
          isActive
            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        )}
      >
        {isActive ? "Deactivate" : "Reactivate"}
      </button>
      <button
        onClick={() => run("reject")}
        disabled={isPending}
        className={cn(btn, "bg-red-50 text-red-700 hover:bg-red-100")}
        title="Delete provider"
      >
        <XCircle className="h-3.5 w-3.5" />
      </button>
      {result === "error" && (
        <span className="text-xs text-red-600">Failed</span>
      )}
    </div>
  );
}
