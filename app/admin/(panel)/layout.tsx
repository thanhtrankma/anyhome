import { connection } from "next/server";

import { AdminHeader } from "@/components/admin/header";
import { SidebarNav } from "@/components/admin/sidebar";
import { adminName } from "@/lib/auth";
import { getLeads } from "@/lib/store";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Dữ liệu quản trị luôn đọc mới theo từng request
  await connection();
  const newLeads = (await getLeads()).filter((l) => l.status === "new");
  const userName = adminName();

  return (
    <div className="min-h-dvh bg-muted/50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarNav newLeads={newLeads.length} userName={userName} />
      </aside>
      <div className="lg:pl-64">
        <AdminHeader newLeads={newLeads} userName={userName} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
