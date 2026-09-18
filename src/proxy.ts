import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

const PROTECTED_PATHS = ["/dashboard", "/transactions"];

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } = await createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected =
    pathname === "/" ||
    PROTECTED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    );

  // Anonymous user → send to /login
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};