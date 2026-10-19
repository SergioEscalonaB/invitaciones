import { NextResponse } from "next/server";
import { confirmInvitation, declineInvitation, getInvitation } from "@/lib/invitation-repository";
import type { RsvpConfirmationPayload } from "@/types/invitation";

type Context = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Context) {
  try { const item = await getInvitation((await params).token); return item ? NextResponse.json(item) : NextResponse.json({ error: "Invitación no encontrada." }, { status: 404 }); }
  catch { return NextResponse.json({ error: "No se pudo cargar la invitación." }, { status: 500 }); }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const token = (await params).token;
    const body = await request.json() as ({ action: "confirm" } & RsvpConfirmationPayload) | { action: "decline"; note?: string };
    if (body.action === "confirm") return NextResponse.json(await confirmInvitation(token, body));
    if (body.action === "decline") return NextResponse.json(await declineInvitation(token, body.note));
    return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar la respuesta." }, { status: 400 }); }
}
