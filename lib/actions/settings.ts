"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { saveSettings } from "@/lib/store";
import { DOCUMENT_BUCKET, supabase } from "@/lib/supabase";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";

const MAX_PDF_BYTES = 20 * 1024 * 1024;
const PROFILE_PDF_FILE = "profile.pdf";

export async function updateSettings(input: SettingsInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return fail("Cài đặt chưa hợp lệ", parsed.error);
  await saveSettings(parsed.data);
  revalidatePath("/", "layout");
  return ok(undefined);
}

export async function uploadProfilePdf(formData: FormData): Promise<ActionResult<{ updatedAt: string }>> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return fail("Không nhận được tệp");
  if (file.size > MAX_PDF_BYTES) return fail("Tệp PDF tối đa 20 MB");

  const bytes = Buffer.from(await file.arrayBuffer());
  // Kiểm tra chữ ký "%PDF" thay vì tin vào phần mở rộng/mime từ trình duyệt
  if (bytes.subarray(0, 4).toString() !== "%PDF") return fail("Tệp không phải PDF hợp lệ");

  const { error } = await supabase()
    .storage.from(DOCUMENT_BUCKET)
    .upload(PROFILE_PDF_FILE, bytes, { contentType: "application/pdf", upsert: true });
  if (error) return fail(`Không tải lên được: ${error.message}`);

  const updatedAt = new Date().toISOString();
  await saveSettings({ profilePdfFile: PROFILE_PDF_FILE, profilePdfUpdatedAt: updatedAt });
  revalidatePath("/admin", "layout");
  return ok({ updatedAt });
}
