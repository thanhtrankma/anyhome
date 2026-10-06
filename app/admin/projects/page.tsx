import { Suspense } from "react";

import { PageHeader } from "@/components/admin/page-header";
import { ProjectsManager } from "@/components/admin/projects-manager";
import { db } from "@/lib/store";

export const metadata = { title: "Quản lý dự án" };

export default function AdminProjectsPage() {
  const projects = [...db().projects].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const published = projects.filter((p) => p.status === "published").length;

  return (
    <>
      <PageHeader
        title="Quản lý dự án"
        description={`${projects.length} dự án · ${published} đang hiển thị trên website. Bật/tắt công tắc để xuất bản nhanh.`}
      />
      <Suspense>
        <ProjectsManager projects={projects} />
      </Suspense>
    </>
  );
}
