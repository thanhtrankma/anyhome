"use client";

import { Download, FileText, Loader2, Upload } from "lucide-react";
import { useTransition } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadProfilePdf } from "@/lib/actions/settings";
import { cn } from "@/lib/utils";

export function ProfilePdfCard({
  updatedAt,
  isLocal,
  downloads,
}: {
  updatedAt: string | null;
  isLocal: boolean;
  downloads: number;
}) {
  const [pending, startTransition] = useTransition();

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
    noClick: true,
    onDropRejected: () => toast.error("Chỉ nhận 1 tệp PDF, tối đa 20 MB"),
    onDropAccepted: ([file]) =>
      startTransition(async () => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await uploadProfilePdf(fd);
        if (res.ok) toast.success(`Đã thay Profile PDF: ${file.name}`);
        else toast.error(res.error);
      }),
  });

  return (
    <Card {...getRootProps()} className={cn("transition-colors", isDragActive && "ring-2 ring-primary")}>
      <input {...getInputProps()} />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4.5 text-primary" /> Company Profile PDF
        </CardTitle>
        <CardDescription>Tệp khách hàng tải về từ nút “Tải Profile PDF” trên website.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="/api/profile" target="_blank" rel="noreferrer" />}>
            <Download /> Xem
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted p-3">
            <dt className="text-xs text-muted-foreground">Nguồn hiện tại</dt>
            <dd className="mt-0.5 font-medium">{isLocal ? "Tệp đã upload" : "Bản gốc (Heyzine)"}</dd>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <dt className="text-xs text-muted-foreground">Lượt tải</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{downloads.toLocaleString("vi-VN")}</dd>
          </div>
        </dl>
        <div className={cn("flex flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center", isDragActive ? "border-primary bg-primary/5" : "border-input")}>
          {pending ? <Loader2 className="size-6 animate-spin text-primary" /> : <Upload className="size-6 text-muted-foreground" />}
          <p className="text-sm font-medium">{pending ? "Đang tải lên…" : "Kéo thả tệp PDF mới vào đây"}</p>
          <Button type="button" variant="outline" size="sm" onClick={open} disabled={pending}>
            Chọn tệp PDF
          </Button>
          <p className="text-xs text-muted-foreground">
            Tối đa 20 MB{updatedAt && ` · Cập nhật lần cuối ${new Date(updatedAt).toLocaleString("vi-VN")}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
