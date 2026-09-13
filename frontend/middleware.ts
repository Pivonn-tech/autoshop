import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Admin route: require auth (role check can be added later)
    if (pathname.startsWith("/admin") && !req.nextauth.token) {
      const signInUrl = new URL("/auth/login", req.url);
      signInUrl.searchParams.append("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/my-garage/:path*", "/admin/:path*", "/admin"],
};
