import { readFile } from "node:fs/promises";
import path from "node:path";

import { DATA_DIR, db, persist } from "@/lib/store";

/** Tải Profile PDF + đếm lượt tải cho Dashboard. */
export async function GET() {
  const store = db();
  store.metrics.profileDownloads += 1;
  persist();

  const { profilePdfFile, profilePdfUrl } = store.settings;
  if (profilePdfFile) {
    try {
      const bytes = await readFile(path.join(DATA_DIR, profilePdfFile));
      return new Response(bytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="Anyhome-Company-Profile.pdf"',
          "Cache-Control": "no-store",
        },
      });
    } catch {
      // Tệp local bị mất → quay về URL mặc định
    }
  }
  return Response.redirect(profilePdfUrl, 302);
}
