import { leadProjectTypeLabels, leadStatusLabels } from "@/lib/data";
import { getLeads } from "@/lib/store";

const escape = (value: string | undefined) => {
  const v = (value ?? "").replace(/"/g, '""');
  // Chặn CSV/Formula injection khi mở bằng Excel
  return `"${/^[=+\-@\t\r]/.test(v) ? `'${v}` : v}"`;
};

export async function GET() {
  const header = ["Mã", "Họ tên", "Điện thoại", "Email", "Loại công trình", "Diện tích", "Ngân sách", "Nội dung", "Trạng thái", "Ngày gửi"];
  const rows = getLeads().map((l) =>
    [
      l.id,
      l.name,
      l.phone,
      l.email,
      leadProjectTypeLabels[l.projectType],
      l.area,
      l.budget,
      l.message,
      leadStatusLabels[l.status],
      new Date(l.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    ]
      .map(escape)
      .join(","),
  );

  const date = new Date().toISOString().slice(0, 10);
  // BOM để Excel hiển thị đúng tiếng Việt
  return new Response("﻿" + [header.map(escape).join(","), ...rows].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="anyhome-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
