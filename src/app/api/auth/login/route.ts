import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, authIsConfigured, clearLoginFailures, createAdminSession, loginIsBlocked, passwordMatches, recordLoginFailure } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "ADMIN_PASSWORD no está configurada en el archivo .env." }, { status: 503 });
  if (!authIsConfigured()) return NextResponse.json({ error: "La autenticación administrativa no está configurada." }, { status: 503 });
  if (await loginIsBlocked()) return NextResponse.json({ error: "Demasiados intentos. Intenta de nuevo en 15 minutos." }, { status: 429 });
  const body = await request.json() as { password?: string };
  if (!body.password || !passwordMatches(body.password)) { await recordLoginFailure(); return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 }); }
  await clearLoginFailures();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminSession(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: ADMIN_SESSION_SECONDS });
  return response;
}
