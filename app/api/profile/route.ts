import { getSettings, incrementProfileDownloads } from "@/lib/store";
import { DOCUMENT_BUCKET, supabase } from "@/lib/supabase";

/** Tải Profile PDF + đếm lượt tải cho Dashboard. */
export async function GET() {
  const [settings] = await Promise.all([
    getSettings(),
    // Đếm lượt tải không được làm hỏng việc tải file
    incrementProfileDownloads().catch((e) => console.error(e)),
  ]);

  if (settings.profilePdfFile) {
    const { data } = await supabase().storage.from(DOCUMENT_BUCKET).download(settings.profilePdfFile);
    if (data) {
      return new Response(data, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="Anyhome-Company-Profile.pdf"',
          "Cache-Control": "no-store",
        },
      });
    }
    // Tệp trên Storage bị mất → quay về URL mặc định
  }
  return Response.redirect(settings.profilePdfUrl, 302);
}
