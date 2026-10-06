import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/dbRetry";
import {
  Users,
  Briefcase,
  ShieldCheck,
  Star,
  Clock,
} from "lucide-react";
import { AdminProviderActions } from "@/components/AdminProviderActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Dashboard — EthioConnect" };

export default async function AdminPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [users, providers, pendingProviders, reviews] = await Promise.all([
    dbRetry(() => prisma.user.count()),
    dbRetry(() => prisma.providerProfile.count()),
    dbRetry(() =>
      prisma.providerProfile.findMany({
        where: { isVerified: false },
        include: {
          user: { select: { name: true, email: true } },
          categories: { select: { nameEn: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
    ),
    dbRetry(() =>
      prisma.review.findMany({
        include: {
          client: { select: { name: true } },
          provider: { select: { businessName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      })
    ),
    dbRetry(() => prisma.providerProfile.count({ where: { isVerified: true } })),
  ]);

  const stats = [
    { label: "Total users", value: users, icon: Users },
    { label: "Providers", value: providers, icon: Briefcase },
    { label: "Pending verification", value: pendingProviders.length, icon: Clock },
    { label: "Verified providers", value: providers - pendingProviders.length, icon: ShieldCheck },
    { label: "Reviews", value: reviews.length, icon: Star },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {session.name}. Here is what's happening on
            EthioConnect.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center gap-2">
              <s.icon className="h-4 w-4 text-brand-600" />
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pending verification */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Clock className="h-5 w-5 text-amber-500" />
          Pending verification ({pendingProviders.length})
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Review new provider registrations and verify them with the
          checkmark button.
        </p>

        {pendingProviders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No providers waiting for approval. 🎉
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Categories</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingProviders.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900">
                        {p.businessName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{p.user.name}</div>
                      <div className="text-xs text-slate-400">
                        {p.user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {[p.subcity, p.city].filter(Boolean).join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.categories.map((c) => (
                          <span
                            key={c.nameEn}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                          >
                            {c.nameEn}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <AdminProviderActions
                          providerId={p.id}
                          isVerified={p.isVerified}
                          isActive={p.isActive}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent reviews */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
          Latest reviews
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                  {r.provider.businessName}
                </p>
                <p className="text-xs font-semibold text-gold-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                by {r.client.name} ·{" "}
                {new Date(r.createdAt).toLocaleDateString("en-GB")}
              </p>
              {r.comment && (
                <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
