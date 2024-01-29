import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  if (path === "/") {
    if (allowedToAdminOnly.includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else if (role === "User") {
      return NextResponse.redirect(
        new URL("/enterprise/transfer/delivered", req.url)
      );
    }
  }

  //! Dashboard Page
  if (path === "/dashboard" && !allowedToAdminOnly.includes(role)) {
    if (role === "User") {
      return NextResponse.redirect(
        new URL("/enterprise/transfer/delivered", req.url)
      );
    }
  }


}

export const config = {
  matcher: ["/:path*"],
};
