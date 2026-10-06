/**
 * Bảo vệ khu vực quản trị bằng HTTP Basic Auth (đủ cho giai đoạn đầu).
 * Dùng chung cho proxy.ts (chặn trang) và Server Actions (chặn mutation —
 * vì action có thể được gọi trực tiếp, không chỉ qua trang /admin).
 */
export function isAuthorized(authorization: string | null): boolean {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  // Chưa cấu hình: mở ở dev cho tiện, khoá hoàn toàn ở production
  if (!user || !pass) return process.env.NODE_ENV !== "production";

  if (!authorization?.startsWith("Basic ")) return false;
  const decoded = atob(authorization.slice(6));
  const sep = decoded.indexOf(":");
  return safeEqual(decoded.slice(0, sep), user) && safeEqual(decoded.slice(sep + 1), pass);
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
