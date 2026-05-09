import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = [
  "/auth/signin",
  "/auth/forgot-password",
  "/auth/enter-otp",
  "/auth/reset-password",
  "/choose-language",
];

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/shops") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/drivers") ||
    pathname.startsWith("/driver-requests") ||
    pathname.startsWith("/profit-overview") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/logout");

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (token && token.role !== "admin" && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/choose-language",
    "/auth/signin",
    "/auth/forgot-password",
    "/auth/enter-otp",
    "/auth/reset-password",
    "/dashboard/:path*",
    "/shops/:path*",
    "/orders/:path*",
    "/drivers/:path*",
    "/driver-requests/:path*",
    "/profit-overview/:path*",
    "/settings/:path*",
    "/logout/:path*",
  ],
};
