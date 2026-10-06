"use server";

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { DATA_DIR, PROFILE_PDF_FILE, db, persist } from "@/lib/store";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";


const MAX_PDF_BYTES = 20 * 1024 * 1024;

export async function updateSettings(input: SettingsInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return fail("Cài đặt chưa hợp lệ", parsed.error);
  Object.assign(db().settings, parsed.data);
  persist();
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

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(path.join(DATA_DIR, PROFILE_PDF_FILE), bytes);

  const settings = db().settings;
  settings.profilePdfFile = PROFILE_PDF_FILE;
  settings.profilePdfUpdatedAt = new Date().toISOString();
  persist();
  revalidatePath("/admin", "layout");
  return ok({ updatedAt: settings.profilePdfUpdatedAt });
}
