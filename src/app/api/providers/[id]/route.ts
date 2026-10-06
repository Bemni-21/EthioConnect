import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const provider = await prisma.providerProfile.findUnique({
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
  });

  if (!provider || !provider.isActive) {
    return NextResponse.json({ error: "Provider not found." }, { status: 404 });
  }

  const avg =
    provider.reviews.length > 0
      ? provider.reviews.reduce((s, r) => s + r.rating, 0) /
        provider.reviews.length
      : null;

  return NextResponse.json({
    provider: { ...provider, ratingAvg: avg, reviewCount: provider._count.reviews },
  });
}
