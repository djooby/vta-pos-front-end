import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, res: NextResponse) {
  const path = req.nextUrl.pathname;
  // ? check Login
  const user = req.cookies.get("user")?.value as string;
  const role = req.cookies.get("role")?.value as string;

  const admins = ["Super Admin", "Admin"];
  const superAdmin = "Super Admin";

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (!admins.includes(role) && path === "/") {
    return NextResponse.redirect(new URL("/pos", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/employee:path*",
    "/order:path*",
    "/pos:path*",
    "/product:path*",
    "/product:path*",
  ],
};
