import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";

export function GET() { return NextResponse.json({ siteUrl: getSiteUrl() }); }
