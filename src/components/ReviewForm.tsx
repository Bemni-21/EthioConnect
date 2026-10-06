"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewForm({ providerId }: { providerId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, rating, comment: comment.trim() || null }),
    });
    if (res.ok) {
      setStatus("done");
      setComment("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error || "Could not submit review.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <h3 className="font-semibold text-slate-900">Write a review</h3>

      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${i} star`}
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                i <= (hover || rating)
                  ? "fill-gold-400 text-gold-400"
                  : "fill-slate-200 text-slate-200"
              )}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-500">
          {rating}/5
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="How was the service? Quality, timeliness, price…"
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-3 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
      >
        {status === "loading" ? "Submitting…" : "Submit review"}
      </button>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}
      {status === "done" && (
        <p className="mt-2 text-sm text-brand-700">
          Thanks! Your review has been published.
        </p>
      )}
    </form>
  );
}
