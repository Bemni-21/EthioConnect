import { prisma } from "./prisma";

const RETRYABLE = new Set(["P1001", "P1003", "P1004", "P1006", "P1017"]);

/**
 * Retries Prisma calls that fail with transient connection errors
 * (common with Supabase free-tier wake-up / pooler cold starts).
 */
export async function dbRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code?: string }).code
          : undefined;
      const message = err instanceof Error ? err.message : "";
      const isRetryable =
        RETRYABLE.has(code ?? "") ||
        message.includes("Can't reach database server");
      if (!isRetryable || attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastError;
}
