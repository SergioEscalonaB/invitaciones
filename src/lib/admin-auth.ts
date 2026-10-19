import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "invitaciones_admin";
const SESSION_VALUE = "authenticated-admin";

function sessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET?.trim() || null;
}

export function authIsConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim() && sessionSecret());
}

export function passwordMatches(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createAdminSessionToken(): string {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET no está configurado.");
  return createHmac("sha256", secret).update(SESSION_VALUE).digest("base64url");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const received = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!received || !authIsConfigured()) return false;
  const expected = createAdminSessionToken();
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
