import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req) {
    // Protected routes that require authentication
    const protectedRoutes = ["/dashboard", "/checkout", "/my-garage"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute && !req.nextauth.token) {
      const signInUrl = new URL("/auth/login", req.url);
      signInUrl.searchParams.append("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/my-garage/:path*"],
};
