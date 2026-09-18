import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

const PROTECTED_PATHS = ["/dashboard", "/transactions"];
const AUTH_ONLY_PATHS = ["/login", "/register"];

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
  const isAuthPage = AUTH_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // Anonymous user → send to /login
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Authenticated user opening auth pages → send to /dashboard
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};