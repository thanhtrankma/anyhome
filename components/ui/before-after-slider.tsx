"use client";

import { MoveHorizontal } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  /** Ảnh phối cảnh 3D (bên trái) */
  beforeSrc: string;
  /** Ảnh công trình thực tế (bên phải) */
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
  /** Vị trí ban đầu, 0–100 */
  initial?: number;
  className?: string;
  /** Áp thêm hiệu ứng cho ảnh "before" (vd. mô phỏng render khi chưa có ảnh 3D thật) */
  beforeClassName?: string;
  sizes?: string;
  preload?: boolean;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Phối cảnh 3D",
  afterLabel = "Thực tế",
  alt,
  initial = 50,
  className,
  beforeClassName,
  sizes = "(min-width: 1024px) 66vw, 100vw",
  preload,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false);
  const hintTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const markInteracted = () => {
    hintTimers.current.forEach(clearTimeout);
    setHinted(true);
  };

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    markInteracted();
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) updateFromClientX(e.clientX);
  };

  const stopDragging = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    const next =
      e.key === "ArrowLeft" ? position - step
      : e.key === "ArrowRight" ? position + step
      : e.key === "Home" ? 0
      : e.key === "End" ? 100
      : null;
    if (next === null) return;
    e.preventDefault();
    markInteracted();
    setPosition(clamp(next));
  };

  // Gợi ý thao tác: tay nắm "lắc" nhẹ một lần khi người dùng chưa tương tác
  useEffect(() => {
    const el = containerRef.current;
    if (!el || hinted) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const frames = [initial - 12, initial + 10, initial];
        hintTimers.current = frames.map((p, i) => setTimeout(() => setPosition(p), 350 + i * 420));
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hinted, initial]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-[16/10] w-full touch-pan-y overflow-hidden rounded-xl bg-navy-900 select-none",
        dragging ? "cursor-grabbing" : "cursor-ew-resize",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      {/* Ảnh thực tế — lớp dưới */}
      <Image src={afterSrc} alt={`${alt} – ${afterLabel}`} fill sizes={sizes} preload={preload} className="object-cover" draggable={false} />

      {/* Ảnh 3D — lớp trên, cắt theo vị trí tay nắm */}
      <div
        className={cn("absolute inset-0", !dragging && "transition-[clip-path] duration-300 ease-out")}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={`${alt} – ${beforeLabel}`}
          fill
          sizes={sizes}
          preload={preload}
          className={cn("object-cover", beforeClassName)}
          draggable={false}
        />
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-medium tracking-wide text-gold-100 backdrop-blur">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-gold-300/90 px-3 py-1 text-xs font-semibold tracking-wide text-navy-900 backdrop-blur">
        {afterLabel}
      </span>

      {/* Đường chia + tay nắm */}
      <div
        className={cn("pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,.4)]", !dragging && "transition-[left] duration-300 ease-out")}
        style={{ left: `${position}%` }}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Kéo để so sánh ${beforeLabel} và ${afterLabel}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% ${beforeLabel}`}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-navy-900/80 text-white shadow-xl backdrop-blur transition-transform outline-none group-hover:scale-110 focus-visible:ring-4 focus-visible:ring-gold-300/70"
        >
          <MoveHorizontal className="size-5" />
        </div>
      </div>
    </div>
  );
}
