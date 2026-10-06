import type { SiteSettings } from "@/lib/types";

/** Danh sách hotline đang dùng (bỏ số trống). */
export const getHotlines = (s: Pick<SiteSettings, "hotline" | "hotline2">) => [s.hotline, s.hotline2].filter(Boolean);

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
