export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { prisma } = await import("@/lib/prisma");
    const { dbRetry } = await import("@/lib/dbRetry");
    try {
      await dbRetry(() => prisma.$queryRaw`SELECT 1`, 4);
      console.log("✔ Database connection ready");
    } catch (e) {
      console.error("✖ Database warm-up failed:", e);
    }
  }
}
