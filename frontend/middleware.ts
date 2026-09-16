import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Must be authenticated for all protected routes
    if (!token) {
      const signInUrl = new URL("/auth/login", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Admin routes additionally require isAdmin flag
    if (pathname.startsWith("/admin") && !token.isAdmin) {
      // Authenticated but not an admin — show 403 page
      return NextResponse.redirect(new URL("/auth/error?error=AccessDenied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Let the middleware function above handle all redirect logic
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/my-garage/:path*",
    "/admin/:path*",
    "/admin",
  ],
};
