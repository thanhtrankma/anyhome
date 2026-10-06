"use client";

import { ChevronDown, MoveRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Gợi ý vuốt ngang cho các băng trượt — chỉ hiện trên mobile. */
export function RailHint({ count, className, tone = "dark" }: { count: number; className?: string; tone?: "dark" | "light" }) {
  return (
    <p
      aria-hidden
      className={cn(
        "mt-3 flex items-center justify-end gap-1.5 text-xs md:hidden",
        tone === "dark" ? "text-muted-foreground" : "text-navy-300",
        className,
      )}
    >
      Vuốt để xem {count} mục <MoveRight className="size-3.5 animate-pulse" />
    </p>
  );
}

/**
 * Nội dung phụ: thu gọn sau một nút bấm trên mobile, luôn hiển thị từ md trở lên.
 * Giảm chiều dài trang cho người dùng điện thoại mà không mất thông tin.
 */
export function MobileDisclosure({
  label,
  children,
  className,
  tone = "dark",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 text-sm font-semibold md:hidden",
          tone === "dark" ? "border-navy-100 bg-white text-navy-900" : "border-white/15 bg-white/5 text-white",
        )}
      >
        {label}
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div className={cn(open ? "mt-4" : "max-md:hidden", "md:mt-0")}>{children}</div>
    </div>
  );
}
