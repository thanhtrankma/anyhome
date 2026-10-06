"use server";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { UPLOAD_BUCKET, supabase } from "@/lib/supabase";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" } as const;

/** Nhận diện định dạng từ magic bytes — không tin `file.type` do client gửi. */
function detectImage(bytes: Buffer): keyof typeof MIME | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP") return "webp";
  if (bytes.subarray(4, 12).toString() === "ftypavif") return "avif";
  return null;
}

export async function uploadImage(formData: FormData): Promise<ActionResult<{ url: string }>> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return fail("Không nhận được tệp");
  if (file.size > MAX_IMAGE_BYTES) return fail("Ảnh tối đa 8 MB");

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = detectImage(bytes);
  if (!ext) return fail("Chỉ hỗ trợ JPG, PNG, WebP, AVIF");

  const name = `${crypto.randomUUID()}.${ext}`;
  const bucket = supabase().storage.from(UPLOAD_BUCKET);
  const { error } = await bucket.upload(name, bytes, { contentType: MIME[ext], cacheControl: "31536000" });
  if (error) return fail(`Không tải lên được: ${error.message}`);
  return ok({ url: bucket.getPublicUrl(name).data.publicUrl });
}
