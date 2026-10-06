"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, Loader2, Save, Send, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ImageDropzone } from "@/components/admin/image-dropzone";
import { FormErrorSummary, focusErrorSummary } from "@/components/form-error-summary";
import { PublishBadge } from "@/components/admin/status-badge";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { savePost } from "@/lib/actions/posts";
import { postCategoryLabels, slugify } from "@/lib/data";
import type { Post } from "@/lib/types";
import { postDefaults, postSchema, type PostInput } from "@/lib/validations/post";

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tagDraft, setTagDraft] = useState("");

  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          cover: post.cover,
          content: post.content,
          tags: post.tags,
          author: post.author,
          status: post.status,
        }
      : postDefaults,
    mode: "onTouched",
    shouldFocusError: false,
  });


  const status = form.watch("status");
  const slug = form.watch("slug");

  const submit = (nextStatus: PostInput["status"]) => {
    const previousStatus = form.getValues("status");
    form.setValue("status", nextStatus);
    void form.handleSubmit(
      (values) =>
        startTransition(async () => {
          const res = await savePost(post?.id ?? null, values);
          if (!res.ok) {
            Object.entries(res.fieldErrors ?? {}).forEach(([k, m]) => form.setError(k as keyof PostInput, { message: m[0] }));
            toast.error(res.error);
            return;
          }
          toast.success(nextStatus === "published" ? "Đã xuất bản bài viết" : "Đã lưu bản nháp");
          router.push("/admin/posts");
        }),
      () => {
        form.setValue("status", previousStatus);
        focusErrorSummary();
      },
    )();
  };

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,$/, "");
    const tags = form.getValues("tags");
    if (!tag || tags.includes(tag)) return setTagDraft("");
    form.setValue("tags", [...tags, tag], { shouldValidate: true, shouldDirty: true });
    setTagDraft("");
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit(status);
      }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" nativeButton={false} render={<Link href="/admin/posts" />} aria-label="Quay lại">
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{post ? "Chỉnh sửa bài viết" : "Viết bài mới"}</h1>
            <p className="text-sm text-muted-foreground">Tin tức, kiến thức xây dựng và nhật ký công trình</p>
          </div>
        </div>
        <div className="flex gap-2">
          {post?.status === "published" && (
            <Button variant="ghost" nativeButton={false} render={<Link href={`/tin-tuc/${post.slug}`} target="_blank" />}>
              <Eye /> Xem
            </Button>
          )}
          <Button type="button" variant="outline" disabled={pending} onClick={() => submit("draft")}>
            <Save /> Lưu nháp
          </Button>
          <Button type="button" disabled={pending} onClick={() => submit("published")}>
            {pending ? <Loader2 className="animate-spin" /> : <Send />}
            {post?.status === "published" ? "Cập nhật" : "Xuất bản"}
          </Button>
        </div>
      </div>

      {form.formState.submitCount > 0 && (
        <FormErrorSummary
          className="mb-6"
          errors={form.formState.errors}
          fields={{
            title: ["Tiêu đề", "post-title"],
            slug: ["Đường dẫn", "post-slug"],
            excerpt: ["Mô tả ngắn", "post-excerpt"],
            content: ["Nội dung", "post-content"],
            tags: ["Thẻ", "post-tags"],
            author: ["Tác giả", "post-author"],
            cover: ["Ảnh đại diện", "post-cover"],
          }}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Nội dung chính — overflow-visible để toolbar editor bám dính khi cuộn */}
        <Card className="overflow-visible">
          <CardContent className="pt-2">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="post-title">Tiêu đề *</FieldLabel>
                    <Input
                      {...field}
                      id="post-title"
                      placeholder="VD: Khởi công nhà máy Kintop tại KCN Lai Cách"
                      className="h-12 text-lg font-semibold"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!post && !form.getFieldState("slug").isDirty) form.setValue("slug", slugify(e.target.value));
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
                    <FieldLabel htmlFor="post-slug">Đường dẫn</FieldLabel>
                    <div className="flex items-center overflow-hidden rounded-lg border focus-within:ring-3 focus-within:ring-ring/50 aria-invalid:border-destructive" aria-invalid={fieldState.invalid}>
                      <span className="border-r bg-muted px-3 py-2 text-xs whitespace-nowrap text-muted-foreground">anyhome.com.vn/tin-tuc/</span>
                      <input {...field} id="post-slug" className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-xs outline-none" />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="excerpt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="post-excerpt">Mô tả ngắn (SEO) *</FieldLabel>
                    <Textarea {...field} id="post-excerpt" rows={2} aria-invalid={fieldState.invalid} />
                    <FieldDescription className={field.value.length > 300 ? "text-destructive" : undefined}>
                      {field.value.length}/300 ký tự · hiển thị trên Google và thẻ bài viết
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nội dung *</FieldLabel>
                    <RichTextEditor id="post-content" value={field.value} onChange={field.onChange} onBlur={field.onBlur} invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Trạng thái <PublishBadge status={status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <FieldLabel htmlFor="post-status" className="flex-1 font-normal">
                      Xuất bản ngay khi lưu
                    </FieldLabel>
                    <Switch id="post-status" checked={field.value === "published"} onCheckedChange={(c) => field.onChange(c ? "published" : "draft")} />
                  </Field>
                )}
              />
              {slug && <p className="mt-3 truncate font-mono text-xs text-muted-foreground">/tin-tuc/{slug}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Phân loại</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="post-category">Chuyên mục</FieldLabel>
                      <Select items={postCategoryLabels} value={field.value} onValueChange={(v) => v && field.onChange(v)}>
                        <SelectTrigger id="post-category" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(postCategoryLabels).map(([v, l]) => (
                            <SelectItem key={v} value={v}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="tags"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="post-tags">Thẻ (tags)</FieldLabel>
                      {field.value.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {field.value.map((t) => (
                            <Badge key={t} variant="secondary" className="gap-1 pr-1">
                              {t}
                              <button
                                type="button"
                                aria-label={`Xoá thẻ ${t}`}
                                onClick={() => field.onChange(field.value.filter((x) => x !== t))}
                                className="rounded-full p-0.5 hover:bg-foreground/10"
                              >
                                <X className="size-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Input
                        id="post-tags"
                        value={tagDraft}
                        placeholder="Nhập thẻ rồi nhấn Enter"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => (e.target.value.endsWith(",") ? addTag(e.target.value) : setTagDraft(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag(tagDraft);
                          }
                        }}
                        onBlur={() => addTag(tagDraft)}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="author"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="post-author">Tác giả</FieldLabel>
                      <Input {...field} id="post-author" aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ảnh đại diện *</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="cover"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <ImageDropzone id="post-cover" value={field.value} onChange={(v) => field.onChange(v)} invalid={fieldState.invalid} aspect="aspect-[3/2]" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
