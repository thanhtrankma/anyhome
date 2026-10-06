import { FileText, FolderKanban, HardHat, Inbox, LayoutDashboard, Settings, type LucideIcon } from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Dự án", icon: FolderKanban },
  { href: "/admin/posts", label: "Bài viết & Tin tức", icon: FileText },
  { href: "/admin/equipments", label: "Năng lực & Thiết bị", icon: HardHat },
  { href: "/admin/leads", label: "Báo giá / Leads", icon: Inbox },
  { href: "/admin/settings", label: "Cài đặt hệ thống", icon: Settings },
];

/** Nhãn breadcrumb cho từng segment URL */
export const SEGMENT_LABELS: Record<string, string> = {
  admin: "Quản trị",
  projects: "Dự án",
  posts: "Bài viết",
  new: "Viết bài mới",
  edit: "Chỉnh sửa",
  equipments: "Năng lực & Thiết bị",
  leads: "Báo giá / Leads",
  settings: "Cài đặt",
};
