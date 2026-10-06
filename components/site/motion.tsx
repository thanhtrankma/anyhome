"use client";

import { motion, useInView, useMotionValue, useSpring, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Hiện dần khi cuộn tới — dùng cho mọi khối nội dung. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

export function StaggerGroup({ children, className, step = 0.08 }: { children: React.ReactNode; className?: string; step?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger(step)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

/** Số đếm tăng dần khi xuất hiện trong viewport. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2200, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(
    () =>
      spring.on("change", (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("vi-VN");
      }),
    [spring],
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      0
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase",
          tone === "dark" ? "text-gold-600" : "text-gold-300",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-px w-10 bg-current" />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]",
          tone === "dark" ? "text-navy-900" : "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-base leading-relaxed text-pretty", tone === "dark" ? "text-muted-foreground" : "text-navy-100/80")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
