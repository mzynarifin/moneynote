import { NextResponse } from "next/server";

export function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return NextResponse.json({
    ok: Boolean(url && key),
    hasUrl: Boolean(url),
    urlPrefix: url.slice(0, 20),
    hasKey: Boolean(key),
    keyPrefix: key.slice(0, 8),
    nodeEnv: process.env.NODE_ENV,
  });
}