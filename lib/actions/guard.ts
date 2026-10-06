import "server-only";

import { headers } from "next/headers";

import { isAuthorized } from "@/lib/auth";

/** Gọi đầu mọi Server Action quản trị. */
export async function requireAdmin() {
  const h = await headers();
  if (!isAuthorized(h.get("authorization"))) {
    throw new Error("Unauthorized");
  }
}
