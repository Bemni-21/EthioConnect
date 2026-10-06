import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/dbRetry";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to review." }, { status: 401 });
  }
  if (user.role === "PROVIDER") {
    return NextResponse.json({ error: "Service providers cannot leave reviews." }, { status: 403 });
  }

  const { providerId, rating, comment } = await req.json();
  if (!providerId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const provider = await dbRetry(() =>
    prisma.providerProfile.findUnique({ where: { id: providerId } })
  );
  if (!provider) {
    return NextResponse.json({ error: "Provider not found." }, { status: 404 });
  }
  if (provider.userId === user.id) {
    return NextResponse.json({ error: "You cannot review your own profile." }, { status: 403 });
  }

  try {
    const review = await dbRetry(() =>
      prisma.review.create({
        data: {
          rating,
          comment,
          providerId,
          clientId: user.id,
        },
        include: { client: { select: { name: true } } },
      })
    );
    return NextResponse.json({ review });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "You have already reviewed this provider." }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Could not save review." }, { status: 500 });
  }
}
