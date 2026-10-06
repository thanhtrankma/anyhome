import type { Metadata } from "next";
import { connection } from "next/server";

import { AdminHeader } from "@/components/admin/header";
import { SidebarNav } from "@/components/admin/sidebar";
import { getLeads } from "@/lib/store";

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s · Anyhome Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Dữ liệu quản trị luôn đọc mới theo từng request
  await connection();
  const newLeads = getLeads().filter((l) => l.status === "new");

  return (
    <div className="min-h-dvh bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarNav newLeads={newLeads.length} />
      </aside>
      <div className="lg:pl-64">
        <AdminHeader newLeads={newLeads} />
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
