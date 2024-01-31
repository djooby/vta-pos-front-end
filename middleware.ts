import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  // ? check Login
  const user = req.cookies.get("user")?.value as string;
  const role = req.cookies.get("role")?.value as string;

  const allowedAllRoles = ["Super Admin", "Admin", "User"];
  const allowedToAdminOnly = ["Super Admin", "Admin"];
  const allowedToSuperAdminOnly = ["Super Admin"];
  const outsidePages = ["/", "/dashboard", "/profile"];

  //! If In login Auth but connected
  if (path.startsWith("/auth/login") && user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  //! Home Page
  if (path === "/" && !allowedToAdminOnly.includes(role)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  //! Product Page
  if (path.startsWith("/product") && !allowedToAdminOnly.includes(role)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  //! Employee Page
  if (path.startsWith("/employee") && !allowedToSuperAdminOnly.includes(role)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/:path*"],
};
