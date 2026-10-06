import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/dbRetry";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const [users, providers, pending, reviews, verified] = await Promise.all([
    dbRetry(() => prisma.user.count()),
    dbRetry(() => prisma.providerProfile.count()),
    dbRetry(() => prisma.providerProfile.count({ where: { isVerified: false, isActive: true } })),
    dbRetry(() => prisma.review.count()),
    dbRetry(() => prisma.providerProfile.count({ where: { isVerified: true } })),
  ]);

  return NextResponse.json({
    stats: {
      users,
      providers,
      pending,
      reviews,
      verified,
    },
  });
}
