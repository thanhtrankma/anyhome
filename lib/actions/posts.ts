"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { sanitizeHtml } from "@/lib/sanitize";
import { db, newId, persist } from "@/lib/store";
import type { PublishStatus } from "@/lib/types";
import { postSchema, type PostInput } from "@/lib/validations/post";

const refresh = () => revalidatePath("/", "layout");

export async function savePost(id: string | null, input: PostInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return fail("Vui lòng kiểm tra lại các trường bị lỗi", parsed.error);

  const store = db();
  const data = { ...parsed.data, content: sanitizeHtml(parsed.data.content) };
  if (store.posts.some((p) => p.slug === data.slug && p.id !== id)) {
    return { ok: false, error: "Slug đã tồn tại", fieldErrors: { slug: ["Slug đã được dùng cho bài khác"] } };
  }

  const now = new Date().toISOString();
  const existing = id ? store.posts.find((p) => p.id === id) : undefined;

  if (existing) {
    Object.assign(existing, data, {
      updatedAt: now,
      publishedAt: data.status === "published" ? (existing.publishedAt ?? now) : existing.publishedAt,
    });
  } else {
    store.posts.unshift({
      ...data,
      id: newId("post"),
      publishedAt: data.status === "published" ? now : null,
      updatedAt: now,
    });
  }

  persist();
  refresh();
  return ok({ id: existing?.id ?? store.posts[0].id });
}

export async function setPostStatus(id: string, status: PublishStatus): Promise<ActionResult> {
  await requireAdmin();
  const post = db().posts.find((p) => p.id === id);
  if (!post) return fail("Không tìm thấy bài viết");
  post.status = status;
  post.updatedAt = new Date().toISOString();
  if (status === "published") post.publishedAt ??= post.updatedAt;
  persist();
  refresh();
  return ok(undefined);
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin();
  const store = db();
  store.posts = store.posts.filter((p) => p.id !== id);
  persist();
  refresh();
  return ok(undefined);
}
