/**
 * Phiên đăng nhập quản trị bằng cookie ký HMAC-SHA256 (Web Crypto — chạy được cả ở proxy).
 * Token: `<user>.<hết hạn, epoch giây>.<chữ ký base64url>`.
 * Khoá ký lấy từ AUTH_SECRET; nếu không đặt thì suy ra từ ADMIN_USER/ADMIN_PASSWORD
 * (đổi mật khẩu = mọi phiên cũ hết hiệu lực).
 *
 * Dùng chung cho proxy.ts (chặn trang) và Server Actions (chặn mutation —
 * vì action có thể được gọi trực tiếp, không chỉ qua trang /admin).
 */

export const SESSION_COOKIE = "anyhome_admin";
export const SESSION_TTL = 60 * 60 * 12; // 12 giờ
export const REMEMBER_TTL = 60 * 60 * 24 * 30; // 30 ngày

const credentials = () => ({ user: process.env.ADMIN_USER, pass: process.env.ADMIN_PASSWORD });

export const isAuthConfigured = () => {
  const { user, pass } = credentials();
  return !!(user && pass);
};

/** Tên hiển thị của tài khoản quản trị */
export const adminName = () => process.env.ADMIN_USER || "admin";

const encoder = new TextEncoder();

async function sign(data: string): Promise<string> {
  const { user, pass } = credentials();
  const secret = process.env.AUTH_SECRET || `${user}:${pass}`;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
  return btoa(String.fromCharCode(...sig)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSessionToken(maxAge: number): Promise<string> {
  const payload = `${encodeURIComponent(adminName())}.${Math.floor(Date.now() / 1000) + maxAge}`;
  return `${payload}.${await sign(payload)}`;
}

export function checkCredentials(user: string, pass: string): boolean {
  const expected = credentials();
  if (!expected.user || !expected.pass) return false;
  // So sánh cả hai để thời gian phản hồi không lộ trường nào sai
  const userOk = safeEqual(user, expected.user);
  const passOk = safeEqual(pass, expected.pass);
  return userOk && passOk;
}

export async function isAuthorized(token: string | undefined): Promise<boolean> {
  // Chưa cấu hình: mở ở dev cho tiện, khoá hoàn toàn ở production
  if (!isAuthConfigured()) return process.env.NODE_ENV !== "production";
  if (!token) return false;

  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const [user, exp] = payload.split(".");
  if (decodeURIComponent(user ?? "") !== adminName() || !(Number(exp) > Date.now() / 1000)) return false;
  return safeEqual(token.slice(lastDot + 1), await sign(payload));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
