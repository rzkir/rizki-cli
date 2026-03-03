import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const authPages = ["/signin", "/signup"];

const protectedPaths = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has("session");

  if (hasSessionCookie && authPages.includes(pathname)) {
    try {
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/session`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        },
      );

      const data = await response.json();

      if (data.authenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Error verifying session:", error);
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  // Redirect ke /login jika belum login tapi mengakses halaman protected (mis. /dashboard)
  const isProtectedPath = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!hasSessionCookie && isProtectedPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
