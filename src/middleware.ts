import { auth } from "@/lib/next-auth/auth";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/preview", "/preview/end"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith("/preview"),
  );

  const isLoggedIn = !!req.auth?.accessToken;

  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/main", req.url));
  }

  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
