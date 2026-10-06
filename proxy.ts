import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, isAuthorized } from "@/lib/auth";

const LOGIN_PATH = "/admin/login";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authorized = await isAuthorized(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === LOGIN_PATH) {
    // Đã đăng nhập thì không cần thấy lại trang đăng nhập
    return authorized ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }
  if (authorized) return NextResponse.next();

  const url = new URL(LOGIN_PATH, request.url);
  if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
