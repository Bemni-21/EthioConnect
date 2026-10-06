import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/dbRetry";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { id } = await params;
  const { action } = await req.json();

  if (action === "approve") {
    const updated = await dbRetry(() =>
      prisma.providerProfile.update({
        where: { id },
        data: { isVerified: true },
      })
    );
    return NextResponse.json({ provider: updated });
  }

  if (action === "reject") {
    const existing = await dbRetry(() =>
      prisma.providerProfile.findUnique({ where: { id } })
    );
    await dbRetry(() => prisma.providerProfile.delete({ where: { id } }));
    if (existing?.userId) {
      await dbRetry(() =>
        prisma.user.update({
          where: { id: existing.userId },
          data: { role: "CLIENT" },
        })
      ).catch(() => {});
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "deactivate" || action === "activate") {
    const updated = await dbRetry(() =>
      prisma.providerProfile.update({
        where: { id },
        data: { isActive: action === "activate" },
      })
    );
    return NextResponse.json({ provider: updated });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
