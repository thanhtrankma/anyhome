"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { uploadImage } from "@/lib/actions/upload";
import { cn } from "@/lib/utils";

const ACCEPT = { "image/jpeg": [], "image/png": [], "image/webp": [], "image/avif": [] };
const MAX_SIZE = 8 * 1024 * 1024;

async function upload(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await uploadImage(fd);
  if (!res.ok) throw new Error(res.error);
  return res.data.url;
}

type Props = {
  label?: string;
  hint?: string;
  invalid?: boolean;
  className?: string;
  aspect?: string;
} & (
  | { multiple?: false; value: string; onChange: (value: string) => void }
  | { multiple: true; value: string[]; onChange: (value: string[]) => void }
);

/** Upload ảnh kéo-thả (1 ảnh hoặc nhiều ảnh), xem trước và xoá. */
export function ImageDropzone(props: Props) {
  const { label = "Kéo thả ảnh vào đây", hint = "JPG, PNG, WebP, AVIF · tối đa 8 MB", invalid, className, aspect = "aspect-video" } = props;
  const [uploading, setUploading] = useState(0);
  const images = props.multiple ? props.value : props.value ? [props.value] : [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    multiple: !!props.multiple,
    onDropRejected: (rejections) =>
      rejections.forEach((r) => toast.error(`${r.file.name}: ${r.errors[0]?.code === "file-too-large" ? "vượt quá 8 MB" : "định dạng không hỗ trợ"}`)),
    onDropAccepted: async (files) => {
      setUploading(files.length);
      const results = await Promise.allSettled(files.map(upload));
      setUploading(0);
      const urls = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
      results.forEach((r) => r.status === "rejected" && toast.error((r.reason as Error).message));
      if (!urls.length) return;
      if (props.multiple) props.onChange([...props.value, ...urls]);
      else props.onChange(urls[0]);
    },
  });

  const remove = (url: string) => {
    if (props.multiple) props.onChange(props.value.filter((u) => u !== url));
    else props.onChange("");
  };

  const showDropzone = props.multiple || images.length === 0;

  return (
    <div className={cn("space-y-3", className)}>
      {images.length > 0 && (
        <ul className={cn("grid gap-3", props.multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1")}>
          {images.map((url) => (
            <li key={url} className={cn("group relative overflow-hidden rounded-lg border bg-muted", props.multiple ? "aspect-square" : aspect)}>
              <Image src={url} alt="" fill sizes="320px" className="object-cover" unoptimized={url.startsWith("/uploads/")} />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/60 text-white opacity-100 transition-opacity hover:bg-destructive sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Xoá ảnh"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {showDropzone && (
        <div
          {...getRootProps()}
          aria-invalid={invalid}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-input hover:border-primary/50 hover:bg-muted/50",
            invalid && "border-destructive",
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="size-7 animate-spin text-primary" />
          ) : (
            <ImagePlus className={cn("size-7", isDragActive ? "text-primary" : "text-muted-foreground")} />
          )}
          <p className="text-sm font-medium">{uploading ? `Đang tải lên ${uploading} ảnh…` : isDragActive ? "Thả ảnh để tải lên" : label}</p>
          <p className="text-xs text-muted-foreground">hoặc bấm để chọn tệp · {hint}</p>
        </div>
      )}
    </div>
  );
}
