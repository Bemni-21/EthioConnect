import Link from "next/link";
import { MapPin, BadgeCheck, ArrowRight } from "lucide-react";
import { Stars } from "./Stars";
import { CategoryIcon } from "./CategoryIcon";
import { formatETB } from "@/lib/constants";

export interface ProviderCardData {
  id: string;
  businessName: string;
  bio: string;
  city: string;
  subcity: string | null;
  pricingType: "HOURLY" | "FIXED" | "NEGOTIABLE";
  startingPrice: number | null;
  isVerified: boolean;
  ratingAvg: number | null;
  reviewCount: number;
  categories: { slug: string; nameEn: string; icon: string }[];
}

export function ProviderCard({ provider }: { provider: ProviderCardData }) {
  return (
    <Link
      href={`/providers/${provider.id}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <CategoryIcon
              icon={provider.categories[0]?.icon ?? "Briefcase"}
              className="h-6 w-6"
            />
          </span>
          <div>
            <h3 className="flex items-center gap-1.5 font-semibold text-slate-900 group-hover:text-brand-700">
              {provider.businessName}
              {provider.isVerified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-brand-600" />
              )}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {[provider.subcity, provider.city].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {provider.categories.slice(0, 3).map((c) => (
          <span
            key={c.slug}
            className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
          >
            {c.nameEn}
          </span>
        ))}
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-600">
        {provider.bio}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <Stars rating={provider.ratingAvg ?? 0} size={14} />
          <span className="text-sm text-slate-600">
            {provider.ratingAvg ? provider.ratingAvg.toFixed(1) : "New"}
            <span className="text-slate-400">
              {" "}
              ({provider.reviewCount})
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-brand-700">
            {provider.startingPrice
              ? `from ${formatETB(provider.startingPrice)}`
              : provider.pricingType === "NEGOTIABLE"
                ? "Negotiable"
                : "Contact for price"}
          </span>
          <ArrowRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-600" />
        </div>
      </div>
    </Link>
  );
}
