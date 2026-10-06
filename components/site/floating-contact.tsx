"use client";

import { FileText, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { telHref } from "@/lib/phone";
import { cn } from "@/lib/utils";

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path fill="currentColor" d="M24 4C12.4 4 3 12.2 3 22.3c0 5.8 3.1 10.9 7.9 14.3L9.6 44l7.6-4.1c2.1.6 4.4.9 6.8.9 11.6 0 21-8.2 21-18.3S35.6 4 24 4Z" />
      <text x="24" y="27.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#151a2e" fontFamily="Arial, sans-serif">Zalo</text>
    </svg>
  );
}

/** Bảng chọn số khi có nhiều hotline. */
function PhonePicker({ hotlines, onClose, className }: { hotlines: string[]; onClose: () => void; className?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-label="Chọn số điện thoại"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.18 }}
      className={cn("theme-light z-50 w-64 rounded-2xl bg-white p-2 text-navy-900 shadow-[0_20px_60px_-10px_rgba(13,16,32,.5)]", className)}
    >
      <div className="flex items-center justify-between px-3 pt-1 pb-2">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Gọi hotline</p>
        <button type="button" onClick={onClose} aria-label="Đóng" className="grid size-8 place-items-center rounded-full hover:bg-muted">
          <X className="size-4" />
        </button>
      </div>
      {hotlines.map((h) => (
        <a
          key={h}
          href={telHref(h)}
          onClick={onClose}
          className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-lg font-bold tabular-nums transition-colors duration-200 hover:bg-gold-50"
        >
          <span className="grid size-9 place-items-center rounded-full bg-gold-300 text-navy-900">
            <Phone className="size-4" />
          </span>
          {h}
        </a>
      ))}
    </motion.div>
  );
}

/**
 * Di động: thanh 3 nút ghim đáy màn hình (Gọi · Zalo · Báo giá).
 * Desktop: cụm nút tròn nổi góc phải.
 * Có nhiều hotline → nút gọi mở bảng chọn số; chỉ 1 số → gọi thẳng.
 */
export function FloatingContact({ hotlines, zalo }: { hotlines: string[]; zalo: string }) {
  const [picking, setPicking] = useState(false);
  const zaloUrl = `https://zalo.me/${zalo}`;
  const multi = hotlines.length > 1;
  const close = () => setPicking(false);

  const callProps = multi
    ? { href: "#goi-hotline", onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setPicking((p) => !p);
        }, "aria-expanded": picking, "aria-haspopup": "dialog" as const }
    : { href: telHref(hotlines[0]) };

  return (
    <>
      <AnimatePresence>
        {picking && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-[2px]"
              onClick={close}
              aria-hidden
            />
            <PhonePicker
              key="picker"
              hotlines={hotlines}
              onClose={close}
              className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 md:right-24 md:bottom-6 md:left-auto"
            />
          </>
        )}
      </AnimatePresence>

      <nav
        aria-label="Liên hệ nhanh"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-navy-950/95 pb-[env(safe-area-inset-bottom)] text-white backdrop-blur-lg md:hidden"
      >
        <a {...callProps} className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium">
          <span className="relative grid size-8 place-items-center rounded-full bg-gold-300 text-navy-900">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold-300/60" />
            <Phone className="relative size-4" />
          </span>
          Gọi ngay
        </a>
        <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium">
          <ZaloIcon className="size-8 text-[#0068ff]" />
          Chat Zalo
        </a>
        <Link href="/#contact" className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium">
          <span className="grid size-8 place-items-center rounded-full border border-gold-300/60 text-gold-200">
            <FileText className="size-4" />
          </span>
          Báo giá
        </Link>
      </nav>

      <div className="fixed right-6 bottom-6 z-40 hidden flex-col gap-3 md:flex">
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
          title="Chat Zalo"
          className="relative grid size-14 place-items-center overflow-hidden rounded-full bg-white shadow-[0_10px_30px_rgba(13,16,32,.35)] transition-transform hover:scale-110"
        >
          <ZaloIcon className="size-14 text-[#0068ff]" />
        </a>
        <a
          {...callProps}
          aria-label={multi ? "Gọi hotline" : `Gọi ${hotlines[0]}`}
          title={hotlines.join(" · ")}
          className="relative grid size-14 place-items-center overflow-hidden rounded-full bg-gold-300 text-navy-900 shadow-[0_10px_30px_rgba(13,16,32,.35)] transition-transform hover:scale-110"
        >
          <Phone className="size-6" />
        </a>
      </div>
    </>
  );
}
