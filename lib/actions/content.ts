"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { coerceGroup, getContentGroup } from "@/lib/content";
import { saveSiteContent } from "@/lib/store";

export async function saveContent(groupKey: string, values: Record<string, unknown>): Promise<ActionResult> {
  await requireAdmin();
  const group = getContentGroup(groupKey);
  if (!group) return fail("Không tìm thấy nhóm cài đặt");

  let data: Record<string, unknown>;
  try {
    data = coerceGroup(group, values);
  } catch (e) {
    return fail((e as Error).message);
  }

  try {
    await saveSiteContent(group.key, data);
  } catch (e) {
    const msg = (e as Error).message;
    return fail(
      msg.includes("site_content")
        ? "Chưa có bảng site_content — chạy supabase/002_site_content.sql trong Supabase SQL Editor"
        : msg,
    );
  }
  revalidatePath("/", "layout");
  return ok(undefined);
}
