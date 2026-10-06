"use client";

import { FileText, Phone } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path fill="currentColor" d="M24 4C12.4 4 3 12.2 3 22.3c0 5.8 3.1 10.9 7.9 14.3L9.6 44l7.6-4.1c2.1.6 4.4.9 6.8.9 11.6 0 21-8.2 21-18.3S35.6 4 24 4Z" />
      <text x="24" y="27.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#151a2e" fontFamily="Arial, sans-serif">Zalo</text>
    </svg>
  );
}

/**
 * Di động: thanh 3 nút ghim đáy màn hình (Gọi · Zalo · Báo giá).
 * Desktop: cụm nút tròn nổi góc phải.
 */
export function FloatingContact({ hotline, zalo }: { hotline: string; zalo: string }) {
  const tel = `tel:${hotline.replace(/\s/g, "")}`;
  const zaloUrl = `https://zalo.me/${zalo}`;

  return (
    <>
      <nav
        aria-label="Liên hệ nhanh"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-navy-950/95 pb-[env(safe-area-inset-bottom)] text-white backdrop-blur-lg md:hidden"
      >
        <a href={tel} className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium">
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
        {[
          { href: zaloUrl, label: "Chat Zalo", external: true, icon: <ZaloIcon className="size-14 text-[#0068ff]" />, cls: "bg-white" },
          {
            href: tel,
            label: `Gọi ${hotline}`,
            external: false,
            icon: <Phone className="size-6" />,
            cls: "bg-gold-300 text-navy-900",
          },
        ].map((b) => (
          <a
            key={b.label}
            href={b.href}
            aria-label={b.label}
            title={b.label}
            {...(b.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn(
              "relative grid size-14 place-items-center overflow-hidden rounded-full shadow-[0_10px_30px_rgba(13,16,32,.35)] transition-transform hover:scale-110",
              b.cls,
            )}
          >
            {b.icon}
          </a>
        ))}
      </div>
    </>
  );
}
