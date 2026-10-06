"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  CATEGORIES,
  CITIES,
  ADDIS_SUBCITIES,
} from "@/lib/constants";

export function SearchFilters({
  initialCity,
  initialCategory,
}: {
  initialCity: string | null;
  initialCategory: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState(initialCity ?? "");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") ?? "");

  const update = (params: URLSearchParams) => {
    const qs = params.toString();
    startTransition(() => {
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    });
  };

  const apply = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    if (minRating) params.set("minRating", minRating);
    update(params);
  };

  const clear = () => {
    setQ("");
    setCity("");
    setCategory("");
    setMinRating("");
    router.push(pathname);
  };

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {isPending && (
          <span className="text-xs font-normal text-slate-400">updating…</span>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
        className="mt-3 space-y-3"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search services, e.g. plumber, tutor…"
            className={`${inputCls} pl-9`}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nameEn}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputCls}
          >
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className={inputCls}
          >
            <option value="">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
          </select>

          {city === "Addis Ababa" && (
            <select
              value={searchParams.get("subcity") ?? ""}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) params.set("subcity", e.target.value);
                else params.delete("subcity");
                update(params);
              }}
              className={inputCls}
            >
              <option value="">All subcities</option>
              {ADDIS_SUBCITIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Apply filters
          </button>
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
