"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { sanitizeHtml } from "@/lib/sanitize";
import { getPostById, newId, postToRow, unwrap } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import type { PublishStatus } from "@/lib/types";
import { postSchema, type PostInput } from "@/lib/validations/post";

const refresh = () => revalidatePath("/", "layout");

export async function savePost(id: string | null, input: PostInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return fail("Vui lòng kiểm tra lại các trường bị lỗi", parsed.error);

  const data = { ...parsed.data, content: sanitizeHtml(parsed.data.content) };
  const dup = unwrap(
    await supabase().from("posts").select("id").eq("slug", data.slug).neq("id", id ?? "").limit(1),
    "posts",
  );
  if (dup.length) {
    return { ok: false, error: "Slug đã tồn tại", fieldErrors: { slug: ["Slug đã được dùng cho bài khác"] } };
  }

  const now = new Date().toISOString();
  const existing = id ? await getPostById(id) : null;
  const table = supabase().from("posts");

  if (existing) {
    const publishedAt = data.status === "published" ? (existing.publishedAt ?? now) : existing.publishedAt;
    unwrap(await table.update(postToRow({ ...data, updatedAt: now, publishedAt })).eq("id", existing.id), "posts");
    refresh();
    return ok({ id: existing.id });
  }

  const newPostId = newId("post");
  unwrap(
    await table.insert(
      postToRow({ ...data, id: newPostId, publishedAt: data.status === "published" ? now : null, updatedAt: now }),
    ),
    "posts",
  );
  refresh();
  return ok({ id: newPostId });
}

export async function setPostStatus(id: string, status: PublishStatus): Promise<ActionResult> {
  await requireAdmin();
  const post = await getPostById(id);
  if (!post) return fail("Không tìm thấy bài viết");
  const now = new Date().toISOString();
  unwrap(
    await supabase()
      .from("posts")
      .update(postToRow({ status, updatedAt: now, publishedAt: status === "published" ? (post.publishedAt ?? now) : post.publishedAt }))
      .eq("id", id),
    "posts",
  );
  refresh();
  return ok(undefined);
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin();
  unwrap(await supabase().from("posts").delete().eq("id", id), "posts");
  refresh();
  return ok(undefined);
}
