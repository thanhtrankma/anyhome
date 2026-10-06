import { cn } from "@/lib/utils";

/** Logo chữ A cách điệu theo nhận diện Anyhome (navy + vàng đồng). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("size-10", className)}>
      <path d="M24 3 44 45H34.5L24 22 13.5 45H4Z" fill="currentColor" />
      <path d="M24 14 37 45h-6.2L24 29.5 17.2 45H11Z" fill="var(--color-gold-300)" />
      <path d="m30 7 9-4-3 9" fill="none" stroke="var(--color-gold-300)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={tone === "light" ? "text-white" : "text-navy-800"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-lg font-extrabold tracking-[0.18em]",
            tone === "light" ? "text-white" : "text-navy-800",
          )}
        >
          ANYHOME
        </span>
        <span className="mt-1 text-[9px] font-medium tracking-[0.2em] text-gold-400 uppercase">
          Thiết kế · Xây dựng · Nội thất
        </span>
      </span>
    </span>
  );
}
