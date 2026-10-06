"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { FileSpreadsheet, MessageSquareText, Phone, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteLead, updateLeadStatus } from "@/lib/actions/leads";
import { leadProjectTypeLabels, leadStatusLabels } from "@/lib/data";
import type { Lead, LeadStatus } from "@/lib/types";

function StatusSelect({ lead }: { lead: Lead }) {
  const [pending, startTransition] = useTransition();
  return (
    <Select
      items={leadStatusLabels}
      value={lead.status}
      disabled={pending}
      onValueChange={(v) =>
        v &&
        startTransition(async () => {
          const res = await updateLeadStatus(lead.id, v as LeadStatus);
          if (res.ok) toast.success(`${lead.name}: ${leadStatusLabels[v as LeadStatus]}`);
          else toast.error(res.error);
        })
      }
    >
      <SelectTrigger size="sm" className="w-32" aria-label="Trạng thái xử lý">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(leadStatusLabels).map(([v, l]) => (
          <SelectItem key={v} value={v}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [deleting, setDeleting] = useState<Lead | null>(null);

  const columns: ColumnDef<Lead>[] = [
    {
      id: "name",
      // Gộp tên + SĐT + email để ô tìm kiếm khớp cả số điện thoại
      accessorFn: (l) => [l.name, l.phone, l.email].filter(Boolean).join(" "),
      header: "Khách hàng",
      cell: ({ row }) => {
        const l = row.original;
        return (
          <div className="min-w-44">
            <p className="flex items-center gap-2 font-medium">
              {l.status === "new" && <span className="size-2 rounded-full bg-sky-500" aria-label="Mới" />}
              {l.name}
            </p>
            <a href={`tel:${l.phone}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <Phone className="size-3" /> {l.phone}
            </a>
            {l.email && <p className="text-xs text-muted-foreground">{l.email}</p>}
          </div>
        );
      },
    },
    {
      accessorKey: "projectType",
      header: "Nhu cầu",
      filterFn: "equals",
      cell: ({ row }) => (
        <div className="min-w-40 space-y-1">
          <Badge variant="secondary">{leadProjectTypeLabels[row.original.projectType]}</Badge>
          <p className="text-xs text-muted-foreground">{[row.original.area, row.original.budget].filter(Boolean).join(" · ") || "—"}</p>
        </div>
      ),
    },
    {
      accessorKey: "message",
      header: "Nội dung",
      enableSorting: false,
      cell: ({ getValue }) => {
        const msg = getValue<string | undefined>();
        if (!msg) return <span className="text-muted-foreground">—</span>;
        return (
          <Tooltip>
            <TooltipTrigger render={<span className="flex max-w-64 items-start gap-1.5 text-left text-sm" />}>
              <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <span className="line-clamp-2">{msg}</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">{msg}</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ngày gửi",
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap tabular-nums">
          {new Date(getValue<string>()).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
        </span>
      ),
      meta: { className: "text-muted-foreground" },
    },
    { accessorKey: "status", header: "Trạng thái", filterFn: "equals", cell: ({ row }) => <StatusSelect lead={row.original} /> },
    {
      id: "actions",
      header: () => <span className="sr-only">Thao tác</span>,
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" aria-label="Xoá" onClick={() => setDeleting(row.original)}>
          <Trash2 className="text-muted-foreground" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={leads}
        searchPlaceholder="Tìm theo tên, SĐT, nội dung…"
        filters={[
          { columnId: "status", label: "Trạng thái", options: leadStatusLabels },
          { columnId: "projectType", label: "Loại", options: leadProjectTypeLabels },
        ]}
        toolbar={
          <Button variant="outline" nativeButton={false} render={<a href="/admin/leads/export" download />} className="h-10">
            <FileSpreadsheet /> Xuất CSV
          </Button>
        }
        emptyText="Chưa có khách hàng đăng ký."
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Xoá khách hàng?"
        description={`Thông tin liên hệ của "${deleting?.name}" sẽ bị xoá vĩnh viễn.`}
        onConfirm={async () => {
          if (!deleting) return;
          const res = await deleteLead(deleting.id);
          if (res.ok) toast.success("Đã xoá");
          else toast.error(res.error);
        }}
      />
    </>
  );
}
