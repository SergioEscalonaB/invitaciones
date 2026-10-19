import { NextResponse } from "next/server";
import { createInvitation, getAllInvitations, getStats } from "@/lib/invitation-repository";

export async function GET() {
  try { return NextResponse.json({ invitations: await getAllInvitations(), stats: await getStats() }); }
  catch { return NextResponse.json({ error: "No se pudieron cargar las invitaciones." }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { guestName?: string; allowedGuests?: number; token?: string };
    if (!body.guestName?.trim() || !Number.isInteger(body.allowedGuests) || (body.allowedGuests ?? 0) < 1) return NextResponse.json({ error: "Nombre y cupo válido son obligatorios." }, { status: 400 });
    return NextResponse.json(await createInvitation(body.guestName, body.allowedGuests!, body.token), { status: 201 });
  } catch { return NextResponse.json({ error: "No se pudo crear la invitación." }, { status: 500 }); }
}
