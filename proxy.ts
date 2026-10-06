import { NextResponse, type NextRequest } from "next/server";

import { isAuthorized } from "@/lib/auth";

export function proxy(request: NextRequest) {
  if (isAuthorized(request.headers.get("authorization"))) return NextResponse.next();

  return new NextResponse("Yêu cầu đăng nhập quản trị", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Anyhome Admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
