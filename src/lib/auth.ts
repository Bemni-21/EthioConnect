import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { dbRetry } from "./dbRetry";

const SESSION_COOKIE = "ethio_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
// Set COOKIE_SECURE=true when deploying behind HTTPS
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function signToken(userId: string) {
  const hmac = createHmac("sha256", SESSION_SECRET).update(userId).digest("hex");
  return Buffer.from(JSON.stringify({ userId, hmac })).toString("base64url");
}

function verifyToken(token: string): string | null {
  try {
    const raw = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    const hmac = createHmac("sha256", SESSION_SECRET).update(raw.userId).digest("hex");
    return hmac === raw.hmac ? raw.userId : null;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signToken(userId), {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = verifyToken(token);
  if (!userId) return null;
  return dbRetry(() => prisma.user.findUnique({ where: { id: userId } }));
}
