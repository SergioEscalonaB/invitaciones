import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ADMIN_COOKIE = "invitaciones_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;
const THROTTLE_ID = "admin-login";
const MAX_FAILURES = 5;
const BLOCK_MINUTES = 15;
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export function authIsConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function passwordMatches(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const left = Buffer.from(candidate); const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function loginIsBlocked(): Promise<boolean> {
  const state = await prisma.adminLoginThrottle.findUnique({ where: { id: THROTTLE_ID } });
  return Boolean(state?.blockedUntil && state.blockedUntil > new Date());
}

export async function recordLoginFailure(): Promise<void> {
  const current = await prisma.adminLoginThrottle.findUnique({ where: { id: THROTTLE_ID } });
  const failures = (current?.blockedUntil && current.blockedUntil <= new Date() ? 0 : current?.failures ?? 0) + 1;
  const blockedUntil = failures >= MAX_FAILURES ? new Date(Date.now() + BLOCK_MINUTES * 60_000) : null;
  await prisma.adminLoginThrottle.upsert({ where: { id: THROTTLE_ID }, create: { id: THROTTLE_ID, failures, blockedUntil }, update: { failures, blockedUntil } });
}

export async function clearLoginFailures(): Promise<void> {
  await prisma.adminLoginThrottle.deleteMany({ where: { id: THROTTLE_ID } });
}

export async function createAdminSession(): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await prisma.adminSession.create({ data: { id: hashToken(token), expiresAt: new Date(Date.now() + ADMIN_SESSION_SECONDS * 1000) } });
  return token;
}

export async function revokeAdminSession(token?: string): Promise<void> {
  if (token) await prisma.adminSession.deleteMany({ where: { id: hashToken(token) } });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const received = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!received || !authIsConfigured()) return false;
  const session = await prisma.adminSession.findUnique({ where: { id: hashToken(received) } });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.adminSession.delete({ where: { id: session.id } });
    return false;
  }
  return true;
}
