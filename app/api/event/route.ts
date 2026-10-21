import { NextResponse } from "next/server";
import { getEventDetails } from "@/lib/invitation-repository";

export async function GET() {
  try {
    return NextResponse.json(await getEventDetails());
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar el evento." },
      { status: 500 },
    );
  }
}
