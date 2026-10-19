import { NextResponse } from "next/server";
import { ADMIN_COOKIE, authIsConfigured, createAdminSessionToken, passwordMatches } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!authIsConfigured()) return NextResponse.json({ error: "La autenticación administrativa no está configurada." }, { status: 503 });
  const body = await request.json() as { password?: string };
  if (!body.password || !passwordMatches(body.password)) return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSessionToken(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
