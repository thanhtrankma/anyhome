"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, PenSquare, Send, Trash2, Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { PublishBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deletePost, setPostStatus } from "@/lib/actions/posts";
import { postCategoryLabels } from "@/lib/data";
import type { Post } from "@/lib/types";

export function PostsTable({ posts }: { posts: Post[] }) {
  const [deleting, setDeleting] = useState<Post | null>(null);

  const toggle = async (post: Post) => {
    const next = post.status === "published" ? "draft" : "published";
    const res = await setPostStatus(post.id, next);
    if (res.ok) toast.success(next === "published" ? "Đã xuất bản" : "Đã chuyển về nháp");
    else toast.error(res.error);
  };

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: "Bài viết",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex min-w-72 items-center gap-3">
            <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={p.cover} alt="" fill sizes="64px" className="object-cover" unoptimized={p.cover.startsWith("/uploads/")} />
            </span>
            <div className="min-w-0">
              <Link href={`/admin/posts/${p.id}/edit`} className="line-clamp-1 font-medium hover:underline">
                {p.title}
              </Link>
              <p className="line-clamp-1 text-xs text-muted-foreground">{p.excerpt}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Chuyên mục",
      filterFn: "equals",
      cell: ({ getValue }) => <Badge variant="secondary">{postCategoryLabels[getValue<Post["category"]>()]}</Badge>,
    },
    { accessorKey: "author", header: "Tác giả", meta: { className: "text-muted-foreground whitespace-nowrap" } },
    {
      accessorKey: "status",
      header: "Trạng thái",
      filterFn: "equals",
      cell: ({ getValue }) => <PublishBadge status={getValue<Post["status"]>()} />,
    },
    {
      accessorKey: "updatedAt",
      header: "Cập nhật",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString("vi-VN"),
      meta: { className: "tabular-nums text-muted-foreground" },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Thao tác</span>,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Thao tác" />}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem render={<Link href={`/admin/posts/${p.id}/edit`} />}>
                <Pencil /> Chỉnh sửa
              </DropdownMenuItem>
              {p.status === "published" && (
                <DropdownMenuItem render={<Link href={`/tin-tuc/${p.slug}`} target="_blank" />}>
                  <Eye /> Xem trên web
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => toggle(p)}>
                {p.status === "published" ? <Undo2 /> : <Send />}
                {p.status === "published" ? "Chuyển về nháp" : "Xuất bản"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleting(p)}>
                <Trash2 /> Xoá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={posts}
        searchPlaceholder="Tìm theo tiêu đề, tác giả…"
        filters={[
          { columnId: "category", label: "Chuyên mục", options: postCategoryLabels },
          { columnId: "status", label: "Trạng thái", options: { published: "Published", draft: "Draft" } },
        ]}
        toolbar={
          <Button nativeButton={false} render={<Link href="/admin/posts/new" />} className="h-10">
            <PenSquare /> Viết bài mới
          </Button>
        }
        emptyText="Chưa có bài viết nào."
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Xoá bài viết?"
        description={`"${deleting?.title}" sẽ bị xoá vĩnh viễn.`}
        onConfirm={async () => {
          if (!deleting) return;
          const res = await deletePost(deleting.id);
          if (res.ok) toast.success("Đã xoá bài viết");
          else toast.error(res.error);
        }}
      />
    </>
  );
}
