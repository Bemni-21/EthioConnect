import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  MessageCircle,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import { getProviderDetail } from "@/lib/queries";
import { getCategory, formatETB } from "@/lib/constants";
import { Stars } from "@/components/Stars";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ReviewList, ReviewData } from "@/components/ReviewList";
import { ReviewForm } from "@/components/ReviewForm";
import { ShareButtons } from "@/components/ShareButtons";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProviderProfilePage({ params }: Props) {
  const { id } = await params;
  const provider = await getProviderDetail(id);
  if (!provider) notFound();

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = provider.reviews.filter((r) => r.rating === star).length;
    return { star, count, pct: provider.reviews.length ? (count / provider.reviews.length) * 100 : 0 };
  });

  const phoneHref = provider.phone ? `tel:${provider.phone.replace(/\s/g, "")}` : null;
  const telegramHref = provider.telegram
    ? provider.telegram.startsWith("http")
      ? provider.telegram
      : `https://t.me/${provider.telegram.replace(/^@/, "")}`
    : null;
  const whatsappHref = provider.whatsapp
    ? `https://wa.me/${provider.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <CategoryIcon
              icon={provider.categories[0]?.icon ?? "Briefcase"}
              className="h-10 w-10"
            />
          </span>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {provider.businessName}
              </h1>
              {provider.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified Pro
                </span>
              )}
            </div>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {[provider.woreda, provider.subcity, provider.city]
                .filter(Boolean)
                .join(", ")}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Stars rating={provider.ratingAvg ?? 0} size={18} />
                <span className="text-sm font-semibold text-slate-900">
                  {provider.ratingAvg ? provider.ratingAvg.toFixed(1) : "New"}
                </span>
                <span className="text-sm text-slate-400">
                  ({provider.reviewCount} review{provider.reviewCount === 1 ? "" : "s"})
                </span>
              </div>
              <span className="text-slate-200">|</span>
              <span className="text-sm text-slate-600">
                {provider.pricingType === "HOURLY" && "Hourly rate"}
                {provider.pricingType === "FIXED" && "Fixed pricing"}
                {provider.pricingType === "NEGOTIABLE" && "Negotiable pricing"}
                {provider.startingPrice
                  ? ` · from ${formatETB(provider.startingPrice)}`
                  : ""}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {provider.categories.map((c) => (
                <span
                  key={c.slug}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {c.nameEn} / {c.nameAm}
                </span>
              ))}
            </div>
          </div>

          {/* Contact buttons */}
          <div className="flex shrink-0 flex-col gap-2 md:w-56">
            {phoneHref && (
              <a
                href={phoneHref}
                className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                <Phone className="h-4 w-4" /> Call now
              </a>
            )}
            {telegramHref && (
              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
              >
                <MessageCircle className="h-4 w-4" /> Telegram
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {!phoneHref && !telegramHref && !whatsappHref && (
              <p className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
                No contact details provided yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div className="space-y-8">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">About</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {provider.bio || "No description provided."}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              Member since{" "}
              {new Date(provider.createdAt).toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">
              Reviews ({provider.reviewCount})
            </h2>
            <div className="mt-4">
              <ReviewList
                reviews={
                  provider.reviews.map(
                    (r): ReviewData => ({
                      id: r.id,
                      rating: r.rating,
                      comment: r.comment,
                      createdAt: r.createdAt.toISOString(),
                      client: { name: r.client.name },
                    })
                  )
                }
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">Rating breakdown</h3>
            <div className="mt-3 space-y-2">
              {ratingBreakdown.map((r) => (
                <div key={r.star} className="flex items-center gap-2 text-xs">
                  <span className="w-8 font-medium text-slate-600">{r.star}★</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gold-400"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400">{r.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">Share</h3>
            <div className="mt-3">
              <ShareButtons />
            </div>
          </section>

          <ReviewForm providerId={provider.id} />
        </aside>
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        <Link href="/providers" className="text-brand-700 hover:underline">
          ← Back to all providers
        </Link>
      </p>
    </div>
  );
}
