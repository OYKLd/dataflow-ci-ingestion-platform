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

  // Protect other authenticated routes
  if (pathname.startsWith("/sources") || 
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/my-uploads") ||
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
  ],
};