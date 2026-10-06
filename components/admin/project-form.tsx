"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ImageDropzone } from "@/components/admin/image-dropzone";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveProject } from "@/lib/actions/projects";
import { projectCategoryLabels, slugify } from "@/lib/data";
import type { Project } from "@/lib/types";
import { PROJECT_SCOPES, projectSchema, type ProjectInput } from "@/lib/validations/project";

const toFormValues = (p?: Project): ProjectInput => ({
  title: p?.title ?? "",
  slug: p?.slug ?? "",
  category: p?.category ?? "residential",
  location: p?.location ?? "",
  scale: p?.scale ?? "",
  area: p?.area ?? Number.NaN,
  year: p?.year ?? new Date().getFullYear(),
  client: p?.client ?? "",
  scope: p?.scope ?? ["Thiết kế", "Thi công"],
  summary: p?.summary ?? "",
  cover: p?.cover ?? "",
  gallery: p?.gallery.filter((g) => g !== p.cover) ?? [],
  render: p?.beforeAfter?.render ?? "",
  real: p?.beforeAfter?.real ?? "",
  featured: p?.featured ?? false,
  status: p?.status ?? "draft",
});

export function ProjectForm({ project, onDone }: { project?: Project; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: toFormValues(project),
    mode: "onTouched",
  });

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const res = await saveProject(project?.id ?? null, {
        ...values,
        gallery: [values.cover, ...values.gallery.filter((g) => g !== values.cover)],
        render: values.render || undefined,
        real: values.real || undefined,
      });
      if (!res.ok) {
        Object.entries(res.fieldErrors ?? {}).forEach(([k, m]) => form.setError(k as keyof ProjectInput, { message: m[0] }));
        toast.error(res.error);
        return;
      }
      toast.success(project ? "Đã cập nhật dự án" : "Đã thêm dự án mới");
      onDone();
    }),
  );

  const numberProps = (onChange: (n: number) => void) => ({
    type: "number" as const,
    inputMode: "numeric" as const,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.valueAsNumber),
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex h-full flex-col">
      <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="p-title">Tên dự án *</FieldLabel>
                <Input
                  {...field}
                  id="p-title"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!form.getFieldState("slug").isDirty) form.setValue("slug", slugify(e.target.value));
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="p-slug">Slug (URL)</FieldLabel>
                <Input {...field} id="p-slug" className="font-mono text-xs" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="p-category">Loại công trình *</FieldLabel>
                  <Select items={projectCategoryLabels} value={field.value} onValueChange={(v) => v && field.onChange(v)}>
                    <SelectTrigger id="p-category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(projectCategoryLabels).map(([v, l]) => (
                        <SelectItem key={v} value={v}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="client"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="p-client">Chủ đầu tư</FieldLabel>
                  <Input {...field} id="p-client" placeholder="Có thể để trống" />
                </Field>
              )}
            />
          </div>
          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="p-location">Địa điểm *</FieldLabel>
                <Input {...field} id="p-location" placeholder="VD: KCN Lai Cách, Cẩm Giàng, Hải Dương" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Controller
              name="scale"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="p-scale">Quy mô *</FieldLabel>
                  <Input {...field} id="p-scale" placeholder="3 tầng · 450 m²" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="area"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="p-area">Diện tích (m²) *</FieldLabel>
                  <Input
                    id="p-area"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    aria-invalid={fieldState.invalid}
                    {...numberProps(field.onChange)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="year"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="p-year">Năm hoàn thành *</FieldLabel>
                  <Input
                    id="p-year"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    aria-invalid={fieldState.invalid}
                    {...numberProps(field.onChange)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <Controller
            name="scope"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label">Phạm vi thực hiện *</FieldLegend>
                <div className="flex flex-wrap gap-4">
                  {PROJECT_SCOPES.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={field.value.includes(s)}
                        onCheckedChange={(checked) => field.onChange(checked ? [...field.value, s] : field.value.filter((v) => v !== s))}
                      />
                      {s}
                    </label>
                  ))}
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            )}
          />
          <Controller
            name="summary"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="p-summary">Mô tả ngắn *</FieldLabel>
                <Textarea {...field} id="p-summary" rows={3} aria-invalid={fieldState.invalid} />
                <FieldDescription>{field.value.length}/500 ký tự</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="cover"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Ảnh đại diện *</FieldLabel>
                <ImageDropzone value={field.value} onChange={field.onChange} invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="gallery"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Thư viện ảnh công trình</FieldLabel>
                <ImageDropzone multiple value={field.value} onChange={field.onChange} label="Kéo thả nhiều ảnh cùng lúc" />
              </Field>
            )}
          />
          <FieldSet>
            <FieldLegend variant="label">So sánh 3D Render vs Thực tế</FieldLegend>
            <FieldDescription>Tải lên cả 2 ảnh cùng góc chụp để hiển thị thanh trượt so sánh trên website.</FieldDescription>
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="render"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Ảnh phối cảnh 3D</FieldLabel>
                    <ImageDropzone value={field.value ?? ""} onChange={field.onChange} label="Ảnh 3D" />
                  </Field>
                )}
              />
              <Controller
                name="real"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Ảnh thực tế</FieldLabel>
                    <ImageDropzone value={field.value ?? ""} onChange={field.onChange} label="Ảnh thực tế" invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldSet>
        </FieldGroup>

        <FieldGroup className="rounded-lg border p-4">
          <Controller
            name="featured"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <FieldLabel htmlFor="p-featured" className="flex-1">
                  Dự án nổi bật
                  <span className="block text-xs font-normal text-muted-foreground">Ưu tiên hiển thị trong khối so sánh 3D/Thực tế</span>
                </FieldLabel>
                <Switch id="p-featured" checked={field.value} onCheckedChange={field.onChange} />
              </Field>
            )}
          />
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <FieldLabel htmlFor="p-status" className="flex-1">
                  Hiển thị trên website
                  <span className="block text-xs font-normal text-muted-foreground">{field.value === "published" ? "Published" : "Draft — chỉ admin thấy"}</span>
                </FieldLabel>
                <Switch id="p-status" checked={field.value === "published"} onCheckedChange={(c) => field.onChange(c ? "published" : "draft")} />
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className="flex justify-end gap-2 border-t bg-background px-6 py-4">
        <Button type="button" variant="outline" onClick={onDone}>
          Huỷ
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          {project ? "Lưu thay đổi" : "Thêm dự án"}
        </Button>
      </div>
    </form>
  );
}
