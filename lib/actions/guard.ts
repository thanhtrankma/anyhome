import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE, isAuthorized } from "@/lib/auth";

/** Gọi đầu mọi Server Action quản trị. */
export async function requireAdmin() {
  const jar = await cookies();
  if (!(await isAuthorized(jar.get(SESSION_COOKIE)?.value))) {
    throw new Error("Unauthorized");
  }
}
