import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(
  request: NextRequest
) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }

  // Protect write routes (only ADMIN or ANALYST)
  if (pathname.startsWith("/sources/new") ||
      pathname.startsWith("/sources/") && pathname.includes("/edit") ||
      pathname.startsWith("/sources/") && pathname.includes("/schema") ||
      pathname.startsWith("/my-uploads")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    if (token.role !== "ADMIN" && token.role !== "ANALYST") {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }

  // Protect other authenticated read routes (all authenticated users)
  if (pathname.startsWith("/sources") || 
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/audit") ||
      pathname.startsWith("/profile")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/sources/:path*",
    "/dashboard/:path*",
    "/my-uploads/:path*",
    "/profile/:path*",
    "/audit/:path*",
  ],
};