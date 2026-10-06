"use client";

import { ArrowDown, ArrowUp, ChevronDown, Copy, ExternalLink, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";
import { toast } from "sonner";

import { ImageDropzone } from "@/components/admin/image-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveContent } from "@/lib/actions/content";
import type { ContentField, ContentGroup } from "@/lib/content-schema";
import { cn } from "@/lib/utils";

type Values = Record<string, unknown>;

/** Phần tử rỗng cho list — mỗi trường lấy giá trị trống theo kiểu */
const emptyItem = (fields: ContentField[]): Values =>
  Object.fromEntries(
    fields.map((f) => [f.name, f.type === "number" ? 0 : f.type === "list" ? [] : f.type === "select" ? f.options?.[0]?.value : ""]),
  );

/* ─────────────────────────── Từng trường ─────────────────────────── */

function FieldInput({ field, value, onChange }: { field: ContentField; value: unknown; onChange: (v: unknown) => void }) {
  const id = useId();
  const full = field.width !== "half" || field.type === "list" || field.type === "image";

  const control = (() => {
    switch (field.type) {
      case "textarea":
        return <Textarea id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className="min-h-24" />;
      case "lines":
        return (
          <Textarea
            id={id}
            // Giữ chuỗi thô khi đang gõ để không mất dòng trống; server tách dòng khi lưu
            value={Array.isArray(value) ? value.join("\n") : String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-28 font-normal"
          />
        );
      case "number":
        return (
          <Input
            id={id}
            type="number"
            inputMode="numeric"
            value={value === undefined || value === null ? "" : String(value)}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            className="h-10"
          />
        );
      case "select":
        return (
          <Select
            items={Object.fromEntries((field.options ?? []).map((o) => [o.value, o.label]))}
            value={String(value ?? field.options?.[0]?.value ?? "")}
            onValueChange={(v) => onChange(v)}
          >
            <SelectTrigger id={id} className="h-10! w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "image":
        return (
          <div className="grid gap-2 sm:grid-cols-[minmax(0,280px)_1fr] sm:items-start">
            <ImageDropzone id={id} value={String(value ?? "")} onChange={onChange} aspect="aspect-[4/3]" label="Kéo thả hoặc bấm để tải ảnh" />
            <div className="space-y-1.5">
              <Input
                value={String(value ?? "")}
                onChange={(e) => onChange(e.target.value)}
                placeholder="…hoặc dán link ảnh https://"
                aria-label={`${field.label} — link ảnh`}
                className="h-10 font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">Ảnh tải lên được lưu ở Supabase Storage.</p>
            </div>
          </div>
        );
      case "list":
        return <ListInput field={field} value={Array.isArray(value) ? (value as Values[]) : []} onChange={onChange} />;
      default:
        return (
          <Input
            id={id}
            type={field.type === "url" ? "url" : "text"}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="h-10"
          />
        );
    }
  })();

  return (
    <Field className={cn("min-w-0", full && "sm:col-span-2")}>
      {field.type === "list" ? (
        <p className="text-sm font-medium">{field.label}</p>
      ) : (
        <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
      )}
      {control}
      {field.help && <FieldDescription>{field.help}</FieldDescription>}
    </Field>
  );
}

/* ─────────────────────────── Danh sách lặp ─────────────────────────── */

function ListInput({ field, value, onChange }: { field: ContentField; value: Values[]; onChange: (v: Values[]) => void }) {
  const fields = field.fields ?? [];
  const [open, setOpen] = useState<Set<number>>(() => new Set(value.length <= 3 ? value.map((_, i) => i) : []));
  const max = field.maxItems ?? 50;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  // Di chuyển/xoá làm lệch chỉ số → mở đúng thẻ vừa thao tác
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(new Set([j]));
  };
  const remove = (i: number) => {
    onChange(value.filter((_, k) => k !== i));
    setOpen(new Set());
  };
  const duplicate = (i: number) => {
    const next = [...value];
    next.splice(i + 1, 0, structuredClone(value[i]));
    onChange(next);
    setOpen(new Set([i + 1]));
  };
  const add = () => {
    onChange([...value, emptyItem(fields)]);
    setOpen(new Set([value.length]));
  };

  return (
    <div className="space-y-2">
      {value.length === 0 && (
        <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">Chưa có mục nào.</p>
      )}
      <ol className="space-y-2">
        {value.map((item, i) => {
          const isOpen = open.has(i);
          const title = String(item[field.itemLabel ?? fields[0]?.name ?? ""] ?? "").trim() || "(chưa đặt tên)";
          return (
            <li key={i} className={cn("rounded-xl border bg-background transition-shadow", isOpen && "shadow-sm ring-1 ring-primary/10")}>
              <div className="flex items-center gap-1 py-1.5 pr-1.5 pl-1">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex min-h-10 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg px-2 text-left text-sm hover:bg-muted/60"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted text-xs font-semibold text-muted-foreground tabular-nums">
                    {i + 1}
                  </span>
                  <span className="truncate font-medium">{title}</span>
                  <ChevronDown className={cn("ml-auto size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Đưa mục ${i + 1} lên`}>
                  <ArrowUp />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Đưa mục ${i + 1} xuống`}>
                  <ArrowDown />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => duplicate(i)} disabled={value.length >= max} aria-label={`Nhân bản mục ${i + 1}`} className="hidden sm:inline-flex">
                  <Copy />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(i)} aria-label={`Xoá mục ${i + 1}`} className="text-muted-foreground hover:text-destructive">
                  <Trash2 />
                </Button>
              </div>
              {isOpen && (
                <div className="grid gap-4 border-t px-4 py-4 sm:grid-cols-2">
                  {fields.map((f) => (
                    <FieldInput key={f.name} field={f} value={item[f.name]} onChange={(v) => onChange(value.map((it, k) => (k === i ? { ...it, [f.name]: v } : it)))} />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <Button type="button" variant="outline" onClick={add} disabled={value.length >= max} className="w-full border-dashed">
        <Plus /> Thêm mục
        {field.maxItems && <span className="text-xs font-normal text-muted-foreground">({value.length}/{max})</span>}
      </Button>
    </div>
  );
}

/* ─────────────────────────── Form nhóm ─────────────────────────── */

export function ContentForm({ group, initial }: { group: ContentGroup; initial: Values }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  // Cảnh báo khi rời trang mà chưa lưu
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (name: string, v: unknown) => {
    setDirty(true);
    setValues((prev) => ({ ...prev, [name]: v }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveContent(group.key, values);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setDirty(false);
      toast.success("Đã lưu — website đã cập nhật");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="sticky top-16 z-20 -mx-4 flex flex-wrap items-center gap-3 border-b bg-muted/85 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <p className={cn("flex items-center gap-2 text-sm", dirty ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>
          <span className={cn("size-2 rounded-full", dirty ? "bg-amber-500" : "bg-emerald-500")} aria-hidden />
          {dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ với website"}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" nativeButton={false} render={<a href={group.previewHref} target="_blank" rel="noreferrer" />}>
            <ExternalLink /> <span className="hidden sm:inline">Xem trên web</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!dirty || pending}
            onClick={() => {
              setValues(initial);
              setDirty(false);
            }}
          >
            <RotateCcw /> <span className="hidden sm:inline">Hoàn tác</span>
          </Button>
          <Button type="submit" disabled={!dirty || pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Save />}
            {pending ? "Đang lưu…" : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      {group.sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            {section.description && <CardDescription>{section.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              {section.fields.map((f) => (
                <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </form>
  );
}
