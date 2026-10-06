import { NextResponse } from "next/server";
import { searchProviders } from "@/lib/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const result = await searchProviders({
    q: searchParams.get("q") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    subcity: searchParams.get("subcity") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    minRating: Number(searchParams.get("minRating") ?? "0") || 0,
    sort: searchParams.get("sort") ?? undefined,
    page: Number(searchParams.get("page") ?? "1") || 1,
    limit: Math.min(50, Number(searchParams.get("limit") ?? "12") || 12),
  });
  return NextResponse.json(result);
}
