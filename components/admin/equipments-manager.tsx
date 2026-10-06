"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteEquipment, saveEquipment } from "@/lib/actions/equipments";
import { equipmentGroupLabels } from "@/lib/data";
import type { Equipment } from "@/lib/types";
import { equipmentSchema, type EquipmentInput } from "@/lib/validations/settings";

const empty: EquipmentInput = { name: "", group: "machinery", spec: "", quantity: 1, unit: "chiếc", origin: "", image: "" };

function EquipmentForm({ equipment, onDone }: { equipment?: Equipment; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const form = useForm<EquipmentInput>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: equipment ? { ...equipment } : empty,
    mode: "onTouched",
  });

  const text = (name: "name" | "spec" | "unit" | "origin", label: string, placeholder?: string) => (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`eq-${name}`}>{label}</FieldLabel>
          <Input {...field} id={`eq-${name}`} placeholder={placeholder} aria-invalid={fieldState.invalid} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await saveEquipment(equipment?.id ?? null, values);
          if (!res.ok) return void toast.error(res.error);
          toast.success(equipment ? "Đã cập nhật thiết bị" : "Đã thêm thiết bị");
          onDone();
        }),
      )}
    >
      <FieldGroup className="max-h-[65dvh] overflow-y-auto px-1">
        {text("name", "Tên thiết bị *", "VD: Máy xúc bánh xích")}
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="group"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="eq-group">Nhóm</FieldLabel>
                <Select items={equipmentGroupLabels} value={field.value} onValueChange={(v) => v && field.onChange(v)}>
                  <SelectTrigger id="eq-group" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(equipmentGroupLabels).map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          {text("origin", "Xuất xứ *", "Nhật Bản")}
        </div>
        {text("spec", "Thông số kỹ thuật *", "Gầu 0,7 – 1,2 m³")}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="quantity"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="eq-qty">Số lượng *</FieldLabel>
                <Input
                  id="eq-qty"
                  type="number"
                  inputMode="numeric"
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={Number.isNaN(field.value) ? "" : field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {text("unit", "Đơn vị *", "chiếc / bộ / m²")}
        </div>
        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Ảnh thiết bị *</FieldLabel>
              <ImageDropzone value={field.value} onChange={field.onChange} invalid={fieldState.invalid} aspect="aspect-[4/3]" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onDone}>
          Huỷ
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Lưu
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EquipmentsManager({ equipments }: { equipments: Equipment[] }) {
  const [editing, setEditing] = useState<Equipment | "new" | null>(null);
  const [deleting, setDeleting] = useState<Equipment | null>(null);

  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: "name",
      header: "Thiết bị",
      cell: ({ row }) => (
        <div className="flex min-w-56 items-center gap-3">
          <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image src={row.original.image} alt="" fill sizes="44px" className="object-cover" unoptimized={row.original.image.startsWith("/uploads/")} />
          </span>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.spec}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "group",
      header: "Nhóm",
      filterFn: "equals",
      cell: ({ getValue }) => <Badge variant="secondary">{equipmentGroupLabels[getValue<Equipment["group"]>()]}</Badge>,
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {row.original.quantity.toLocaleString("vi-VN")} {row.original.unit}
        </span>
      ),
    },
    { accessorKey: "origin", header: "Xuất xứ", meta: { className: "text-muted-foreground" } },
    {
      id: "actions",
      header: () => <span className="sr-only">Thao tác</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Sửa" onClick={() => setEditing(row.original)}>
            <Pencil />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Xoá" onClick={() => setDeleting(row.original)}>
            <Trash2 className="text-muted-foreground" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={equipments}
        searchPlaceholder="Tìm thiết bị…"
        filters={[{ columnId: "group", label: "Nhóm", options: equipmentGroupLabels }]}
        toolbar={
          <Button className="h-10" onClick={() => setEditing("new")}>
            <Plus /> Thêm thiết bị
          </Button>
        }
      />
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "Thêm thiết bị" : "Cập nhật thiết bị"}</DialogTitle>
            <DialogDescription>Hiển thị tại mục “Máy móc & Thiết bị” trên website.</DialogDescription>
          </DialogHeader>
          {editing !== null && (
            <EquipmentForm key={editing === "new" ? "new" : editing.id} equipment={editing === "new" ? undefined : editing} onDone={() => setEditing(null)} />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Xoá thiết bị?"
        description={`"${deleting?.name}" sẽ bị gỡ khỏi danh mục năng lực.`}
        onConfirm={async () => {
          if (!deleting) return;
          const res = await deleteEquipment(deleting.id);
          if (res.ok) toast.success("Đã xoá thiết bị");
          else toast.error(res.error);
        }}
      />
    </>
  );
}
