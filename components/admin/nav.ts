import { FileText, FolderKanban, HardHat, Inbox, LayoutDashboard, Palette, type LucideIcon } from "lucide-react";

import { contentGroups } from "@/lib/content-schema";

export interface AdminNavItem {
  href: string;
  label: string;
  icon?: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  /** Nhóm dài: thu gọn được, mặc định chỉ mở khi đang ở trang trong nhóm */
  icon?: LucideIcon;
  collapsible?: boolean;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Tổng quan",
    items: [{ href: "/admin", label: "Bảng điều khiển", icon: LayoutDashboard }],
  },
  {
    label: "Nội dung",
    items: [
      { href: "/admin/projects", label: "Dự án", icon: FolderKanban },
      { href: "/admin/posts", label: "Bài viết & Tin tức", icon: FileText },
      { href: "/admin/equipments", label: "Năng lực & Thiết bị", icon: HardHat },
    ],
  },
  {
    label: "Khách hàng",
    items: [{ href: "/admin/leads", label: "Báo giá / Leads", icon: Inbox }],
  },
  {
    label: "Giao diện & cài đặt",
    icon: Palette,
    collapsible: true,
    items: [
      { href: "/admin/settings", label: "Liên hệ & số liệu" },
      ...contentGroups.map((g) => ({ href: `/admin/settings/${g.key}`, label: g.label })),
    ],
  },
];

/** Link khớp dài nhất thắng — /admin/settings/hero không làm sáng cả /admin/settings. */
export function activeNavHref(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return ADMIN_NAV.flatMap((g) => g.items.map((i) => i.href))
    .filter((h) => path === h || (h !== "/admin" && path.startsWith(`${h}/`)))
    .sort((a, b) => b.length - a.length)[0];
}

/** Nhãn breadcrumb cho từng segment URL */
export const SEGMENT_LABELS: Record<string, string> = {
  admin: "Quản trị",
  projects: "Dự án",
  posts: "Bài viết",
  new: "Viết bài mới",
  edit: "Chỉnh sửa",
  equipments: "Năng lực & Thiết bị",
  leads: "Báo giá / Leads",
  settings: "Giao diện & cài đặt",
  ...Object.fromEntries(contentGroups.map((g) => [g.key, g.label])),
};

/** Chữ cái đầu cho avatar */
export const initials = (name: string) =>
  name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "A";
