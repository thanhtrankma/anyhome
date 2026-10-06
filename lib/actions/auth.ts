"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  REMEMBER_TTL,
  SESSION_COOKIE,
  SESSION_TTL,
  checkCredentials,
  createSessionToken,
  isAuthConfigured,
} from "@/lib/auth";

export interface LoginState {
  error?: string;
  username?: string;
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
// Giới hạn đăng nhập sai theo IP (theo từng instance server — đủ để chặn dò mật khẩu đơn giản)
const attempts = new Map<string, { count: number; first: number }>();

/** Chỉ cho phép quay về đường dẫn nội bộ trong /admin — chặn open redirect. */
const safeNext = (next: unknown) =>
  typeof next === "string" && /^\/admin(\/|\?|$)/.test(next) && !next.startsWith("/admin/login") ? next : "/admin";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isAuthConfigured()) {
    return { username, error: "Máy chủ chưa cấu hình ADMIN_USER / ADMIN_PASSWORD." };
  }
  if (!username || !password) return { username, error: "Vui lòng nhập tên đăng nhập và mật khẩu." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && now - record.first < WINDOW_MS && record.count >= MAX_ATTEMPTS) {
    const minutes = Math.ceil((record.first + WINDOW_MS - now) / 60000);
    return { username, error: `Bạn đã nhập sai quá nhiều lần. Thử lại sau ${minutes} phút.` };
  }

  if (!checkCredentials(username, password)) {
    const fresh = !record || now - record.first >= WINDOW_MS;
    attempts.set(ip, fresh ? { count: 1, first: now } : { ...record, count: record.count + 1 });
    // Làm chậm dò mật khẩu tự động
    await new Promise((r) => setTimeout(r, 600));
    return { username, error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }

  attempts.delete(ip);
  const maxAge = formData.get("remember") ? REMEMBER_TTL : SESSION_TTL;
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(maxAge), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
