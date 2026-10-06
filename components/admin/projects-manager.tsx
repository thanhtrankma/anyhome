"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { ProjectForm } from "@/components/admin/project-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { deleteProject, setProjectStatus } from "@/lib/actions/projects";
import { projectCategoryLabels } from "@/lib/data";
import type { Project } from "@/lib/types";

function StatusSwitch({ project }: { project: Project }) {
  const [pending, startTransition] = useTransition();
  return (
    <Switch
      checked={project.status === "published"}
      disabled={pending}
      aria-label="Hiển thị trên website"
      onCheckedChange={(checked) =>
        startTransition(async () => {
          const res = await setProjectStatus(project.id, checked ? "published" : "draft");
          if (res.ok) toast.success(checked ? "Đã xuất bản dự án" : "Đã chuyển về nháp");
          else toast.error(res.error);
        })
      }
    />
  );
}

export function ProjectsManager({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editing, setEditing] = useState<Project | "new" | null>(searchParams.get("new") ? "new" : null);
  const [deleting, setDeleting] = useState<Project | null>(null);

  const closeSheet = () => {
    setEditing(null);
    if (searchParams.get("new")) router.replace("/admin/projects");
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "title",
      header: "Dự án",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex min-w-64 items-center gap-3">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={p.cover} alt="" fill sizes="48px" className="object-cover" unoptimized={p.cover.startsWith("/uploads/")} />
            </span>
            <div className="min-w-0">
              <button type="button" onClick={() => setEditing(p)} className="flex items-center gap-1.5 text-left font-medium hover:underline">
                {p.featured && <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Nổi bật" />}
                <span className="line-clamp-1">{p.title}</span>
              </button>
              <p className="line-clamp-1 text-xs text-muted-foreground">{p.location}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Loại",
      filterFn: "equals",
      cell: ({ getValue }) => <Badge variant="secondary">{projectCategoryLabels[getValue<Project["category"]>()]}</Badge>,
    },
    { accessorKey: "scale", header: "Quy mô", meta: { className: "text-muted-foreground whitespace-nowrap" } },
    { accessorKey: "year", header: "Năm", meta: { className: "tabular-nums" } },
    {
      accessorKey: "status",
      header: "Hiển thị",
      filterFn: "equals",
      cell: ({ row }) => <StatusSwitch project={row.original} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Thao tác</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Thao tác" />}>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditing(row.original)}>
              <Pencil /> Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setDeleting(row.original)}>
              <Trash2 /> Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={projects}
        searchPlaceholder="Tìm theo tên, địa điểm…"
        filters={[
          { columnId: "category", label: "Loại", options: projectCategoryLabels },
          { columnId: "status", label: "Trạng thái", options: { published: "Published", draft: "Draft" } },
        ]}
        toolbar={
          <Button onClick={() => setEditing("new")} className="h-10">
            <Plus /> Thêm dự án
          </Button>
        }
      />

      <Sheet open={editing !== null} onOpenChange={(o) => !o && closeSheet()}>
        <SheetContent side="right" className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-2xl">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle>{editing === "new" ? "Thêm dự án mới" : "Chỉnh sửa dự án"}</SheetTitle>
            <SheetDescription>Thông tin hiển thị tại mục Dự án tiêu biểu trên website.</SheetDescription>
          </SheetHeader>
          {editing !== null && (
            <ProjectForm key={editing === "new" ? "new" : editing.id} project={editing === "new" ? undefined : editing} onDone={closeSheet} />
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Xoá dự án?"
        description={`"${deleting?.title}" sẽ bị xoá vĩnh viễn khỏi website. Thao tác này không thể hoàn tác.`}
        onConfirm={async () => {
          if (!deleting) return;
          const res = await deleteProject(deleting.id);
          if (res.ok) toast.success("Đã xoá dự án");
          else toast.error(res.error);
        }}
      />
    </>
  );
}
