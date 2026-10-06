import { prisma } from "./prisma";
import { dbRetry } from "./dbRetry";

export interface ProviderListItem {
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

export interface SearchFilters {
  q?: string;
  city?: string;
  subcity?: string;
  category?: string;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function searchProviders(filters: SearchFilters) {
  const {
    q = "",
    city = "",
    subcity = "",
    category = "",
    minRating = 0,
    sort = "recommended",
    page = 1,
    limit = 12,
  } = filters;

  const where: Record<string, unknown> = {
    isActive: true,
    ...(city ? { city } : {}),
    ...(subcity ? { subcity } : {}),
    ...(category ? { categories: { some: { slug: category } } } : {}),
    ...(q
      ? {
          OR: [
            { businessName: { contains: q, mode: "insensitive" } },
            { bio: { contains: q, mode: "insensitive" } },
            { user: { name: { contains: q, mode: "insensitive" } } },
            { categories: { some: { nameEn: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const [providers, ratingAgg, total] = await Promise.all([
    dbRetry(() =>
      prisma.providerProfile.findMany({
        where,
        include: {
          user: { select: { name: true } },
          categories: { select: { slug: true, nameEn: true, icon: true } },
          _count: { select: { reviews: true } },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
      })
    ),
    dbRetry(() => prisma.review.groupBy({ by: ["providerId"], _avg: { rating: true } })),
    dbRetry(() => prisma.providerProfile.count({ where })),
  ]);

  const ratingMap = new Map(ratingAgg.map((r) => [r.providerId, r._avg.rating]));

  let items: ProviderListItem[] = providers.map((p) => ({
    id: p.id,
    businessName: p.businessName,
    bio: p.bio,
    city: p.city,
    subcity: p.subcity,
    pricingType: p.pricingType,
    startingPrice: p.startingPrice,
    isVerified: p.isVerified,
    ratingAvg: ratingMap.get(p.id) ?? null,
    reviewCount: p._count.reviews,
    categories: p.categories,
  }));

  if (minRating > 0) {
    items = items.filter((i) => (i.ratingAvg ?? 0) >= minRating);
  }

  if (sort === "rating") {
    items.sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0));
  } else if (sort === "price") {
    items.sort(
      (a, b) =>
        (a.startingPrice ?? Number.MAX_SAFE_INTEGER) -
        (b.startingPrice ?? Number.MAX_SAFE_INTEGER)
    );
  }

  return {
    providers: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getTopProviders(limit = 6) {
  const { providers } = await searchProviders({ sort: "rating", limit });
  return providers;
}

export async function getProviderDetail(id: string) {
  const provider = await dbRetry(() =>
    prisma.providerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, createdAt: true } },
        categories: true,
        reviews: {
          include: { client: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reviews: true } },
      },
    })
  );

  if (!provider || !provider.isActive) return null;

  const ratingAvg =
    provider.reviews.length > 0
      ? provider.reviews.reduce((s, r) => s + r.rating, 0) / provider.reviews.length
      : null;

  return { ...provider, ratingAvg, reviewCount: provider._count.reviews };
}
