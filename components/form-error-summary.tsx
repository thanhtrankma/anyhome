"use client";

import { CircleAlert } from "lucide-react";
import type { FieldErrors, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";

interface FormErrorSummaryProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  /** Tên trường → [nhãn hiển thị, id phần tử cần focus] */
  fields: Partial<Record<keyof T & string, [label: string, id: string]>>;
  className?: string;
}

/**
 * ui-ux-pro-max · error-summary + focus-management (WCAG):
 * tóm tắt lỗi ở đầu form sau khi gửi thất bại, mỗi lỗi là link tới trường tương ứng.
 * Form cha gọi `focusErrorSummary()` khi validate thất bại; lỗi inline ở từng trường vẫn giữ nguyên.
 */
export function FormErrorSummary<T extends FieldValues>({ errors, fields, className }: FormErrorSummaryProps<T>) {
  const items = (Object.keys(fields) as (keyof T & string)[]).flatMap((name) => {
    const message = errors[name]?.message;
    const meta = fields[name];
    return typeof message === "string" && meta ? [{ name, label: meta[0], id: meta[1], message }] : [];
  });

  if (!items.length) return null;

  return (
    <div
      data-error-summary
      role="alert"
      tabIndex={-1}
      aria-labelledby="form-error-summary-title"
      className={cn("rounded-lg border border-destructive/40 bg-destructive/5 p-4 outline-none focus-visible:ring-3 focus-visible:ring-destructive/30", className)}
    >
      <p id="form-error-summary-title" className="flex items-center gap-2 text-sm font-semibold text-destructive">
        <CircleAlert className="size-4" />
        Vui lòng kiểm tra {items.length} mục chưa hợp lệ
      </p>
      <ul className="mt-2 space-y-1 pl-6 text-sm">
        {items.map((item) => (
          <li key={item.name} className="list-disc text-destructive">
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                el?.scrollIntoView({ block: "center", inline: "nearest" });
                el?.focus({ preventScroll: true });
              }}
              className="underline underline-offset-2 hover:no-underline"
            >
              {item.label}: {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Chuyển focus vào bảng tóm tắt lỗi. Lỗi được render bất đồng bộ sau khi validate,
 * nên thử lại vài lần (setTimeout thay vì rAF — rAF không chạy khi tab bị ẩn).
 */
export function focusErrorSummary(scope?: EventTarget | null, attempts = 20) {
  const root = scope instanceof HTMLElement ? scope : document;
  const el = root.querySelector<HTMLElement>("[data-error-summary]");
  if (el) {
    el.focus();
    el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
  } else if (attempts > 0) {
    setTimeout(() => focusErrorSummary(scope, attempts - 1), 16);
  }
}
