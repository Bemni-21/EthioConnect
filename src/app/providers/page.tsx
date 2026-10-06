import { searchProviders } from "@/lib/queries";
import { SearchFilters } from "@/components/SearchFilters";
import { ProviderCard } from "@/components/ProviderCard";
import { getCategory, CATEGORIES, CITIES } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Browse Services — EthioConnect",
};

interface Props {
  searchParams: Promise<{
    q?: string;
    city?: string;
    subcity?: string;
    category?: string;
    minRating?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProvidersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const { providers, pagination } = await searchProviders({
    q: sp.q,
    city: sp.city,
    subcity: sp.subcity,
    category: sp.category,
    minRating: Number(sp.minRating ?? "0") || 0,
    sort: sp.sort,
    page,
    limit: 12,
  });

  const activeCategory = sp.category ? getCategory(sp.category) : null;

  function buildPageUrl(p: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.city) params.set("city", sp.city);
    if (sp.subcity) params.set("subcity", sp.subcity);
    if (sp.category) params.set("category", sp.category);
    if (sp.minRating) params.set("minRating", sp.minRating);
    if (sp.sort) params.set("sort", sp.sort);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/providers${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {activeCategory
            ? `${activeCategory.nameEn} (${activeCategory.nameAm})`
            : "Browse all services"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {pagination.total} service provider
          {pagination.total === 1 ? "" : "s"} found
          {sp.city ? ` in ${sp.city}` : " across Ethiopia"}
          {activeCategory ? "" : sp.q ? ` for “${sp.q}”` : ""}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SearchFilters
            initialCity={sp.city ?? null}
            initialCategory={sp.category ?? null}
          />

          {sp.sort && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-700">Sort by</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { value: "recommended", label: "Recommended" },
                  { value: "rating", label: "Top rated" },
                  { value: "price", label: "Lowest price" },
                  { value: "newest", label: "Newest" },
                ].map((s) => (
                  <a
                    key={s.value}
                    href={`/providers?${new URLSearchParams({
                      ...(sp.q ? { q: sp.q } : {}),
                      ...(sp.city ? { city: sp.city } : {}),
                      ...(sp.category ? { category: sp.category } : {}),
                      sort: s.value,
                    }).toString()}`}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      sp.sort === s.value
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div>
          {providers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No providers found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different keyword, city or category — or{" "}
                <a href="/register" className="font-semibold text-brand-700 underline">
                  register your own service
                </a>
                .
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {CATEGORIES.slice(0, 6).map((c) => (
                  <a
                    key={c.slug}
                    href={`/providers?category=${c.slug}`}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                  >
                    {c.nameEn}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {providers.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2">
              {page > 1 ? (
                <a
                  href={buildPageUrl(page - 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </a>
              ) : (
                <span className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-300">
                  <ChevronLeft className="h-4 w-4" /> Prev
                </span>
              )}

              <span className="px-3 text-sm text-slate-600">
                Page {pagination.page} of {pagination.pages}
              </span>

              {page < pagination.pages ? (
                <a
                  href={buildPageUrl(page + 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </a>
              ) : (
                <span className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-300">
                  Next <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
