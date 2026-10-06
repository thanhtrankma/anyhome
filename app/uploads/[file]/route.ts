import { readFile } from "node:fs/promises";
import path from "node:path";

import { UPLOAD_DIR } from "@/lib/store";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

export async function GET(_req: Request, ctx: RouteContext<"/uploads/[file]">) {
  const { file } = await ctx.params;
  // Chỉ chấp nhận tên do uploadImage sinh ra → chặn path traversal
  const match = /^[a-f0-9-]{36}\.(jpg|png|webp|avif)$/.exec(file);
  if (!match) return new Response("Not found", { status: 404 });

  try {
    const bytes = await readFile(path.join(UPLOAD_DIR, file));
    return new Response(bytes, {
      headers: {
        "Content-Type": MIME[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
