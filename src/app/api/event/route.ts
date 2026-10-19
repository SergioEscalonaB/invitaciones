import { NextResponse } from "next/server";
import { getEventDetails, updateEventDetails } from "@/lib/invitation-repository";
import type { EventDetails } from "@/types/invitation";

export async function GET() {
  try { return NextResponse.json(await getEventDetails()); }
  catch { return NextResponse.json({ error: "No se pudo cargar el evento." }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try { return NextResponse.json(await updateEventDetails(await request.json() as EventDetails)); }
  catch { return NextResponse.json({ error: "No se pudo actualizar el evento." }, { status: 500 }); }
}
