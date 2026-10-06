import Link from "next/link";
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES, CITIES } from "@/lib/constants";
import { getTopProviders } from "@/lib/queries";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProviderCard } from "@/components/ProviderCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const topProviders = await getTopProviders(6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 0, transparent 50%), radial-gradient(circle at 80% 20%, white 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <MapPin className="h-3.5 w-3.5" />
              Serving all of Ethiopia 🇪🇹
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Find trusted local services, fast.
            </h1>
            <p className="mt-4 text-lg text-brand-50">
              Plumbers, electricians, mechanics, tutors, salons and more —
              compare ratings, see real reviews, and contact providers directly
              by phone or Telegram.
            </p>

            <form
              action="/providers"
              method="get"
              className="mt-8 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row sm:items-center sm:gap-0"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  placeholder="What service do you need?"
                  className="w-full rounded-xl border-0 bg-transparent py-3 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <select
                name="city"
                defaultValue=""
                className="rounded-xl border-0 bg-transparent px-3 py-3 text-sm text-slate-700 focus:outline-none"
              >
                <option value="">All cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Popular services
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Browse by trade — available in Addis Ababa and across Ethiopia.
            </p>
          </div>
          <Link
            href="/providers"
            className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/providers?category=${c.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <CategoryIcon icon={c.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                {c.nameEn}
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">{c.nameAm}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top rated */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
                <Star className="h-6 w-6 fill-gold-400 text-gold-400" />
                Top rated providers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Based on verified customer reviews.
              </p>
            </div>
            <Link
              href="/providers?sort=rating"
              className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
            >
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topProviders.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          How EthioConnect works
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "1. Search your city",
              desc: "Filter by trade, subcity and budget — from Bole to Kirkos, Hawassa to Bahir Dar.",
            },
            {
              title: "2. Compare & review",
              desc: "Check star ratings, read real customer experiences and view provider portfolios.",
            },
            {
              title: "3. Contact directly",
              desc: "Call, message on Telegram or WhatsApp — no middleman, no commission on your deal.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <h3 className="font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-xl bg-brand-50 p-8 text-center">
          <ShieldCheck className="h-8 w-8 text-brand-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Are you a service provider?
          </h3>
          <p className="max-w-md text-sm text-slate-600">
            Register for free, showcase your work, get verified with your
            kebele ID or business license, and start receiving customers today.
          </p>
          <Link
            href="/register"
            className="mt-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Register as a provider
          </Link>
        </div>
      </section>
    </div>
  );
}
