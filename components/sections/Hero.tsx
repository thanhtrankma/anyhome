"use client";

import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CountUp } from "@/components/site/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Stat } from "@/lib/types";

interface HeroSlide {
  image: string;
  eyebrow: string;
  title: string;
  caption: string;
}

const AUTOPLAY_MS = 7000;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ slides, stats, videoUrl }: { slides: HeroSlide[]; stats: Stat[]; videoUrl?: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    if (paused || videoUrl) return;
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, slides.length, videoUrl, active]);

  const slide = slides[active];

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Giới thiệu Anyhome"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Nền: video (nếu có) hoặc slider ảnh Ken Burns */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        {videoUrl ? (
          <video src={videoUrl} autoPlay muted loop playsInline poster={slides[0].image} className="size-full object-cover" />
        ) : (
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt={slide.caption}
                fill
                preload={active === 0}
                sizes="100vw"
                quality={75}
                className="animate-ken-burns object-cover"
              />
            </motion.div>
          </AnimatePresence>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40" />
      </motion.div>

      {/* Khối tam giác vàng — gợi lại bìa profile */}
      <div className="pointer-events-none absolute -right-24 bottom-24 -z-10 hidden h-[420px] w-[420px] rotate-[24deg] border border-gold-300/25 lg:block" />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-28 pb-12 sm:px-6 lg:px-8"
      >
        {/* initial={false}: slide đầu hiển thị ngay từ HTML SSR (tốt cho LCP) */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="max-w-3xl"
          >
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              className="mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-gold-300 uppercase sm:text-sm"
            >
              <span className="h-px w-12 bg-gold-300" />
              {slide.eyebrow}
            </motion.p>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } }}
              className="text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
              className="mt-6 max-w-xl font-serif text-lg text-navy-100/90 italic sm:text-xl"
            >
              {slide.caption}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Button
            nativeButton={false}
            render={<Link href="/#projects" />}
            className="group h-13 rounded-full bg-gold-300 px-8 text-base font-semibold text-navy-900 shadow-[0_10px_40px_-10px_rgba(220,194,126,.7)] hover:bg-gold-200"
          >
            Khám phá dự án
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            nativeButton={false}
            render={<a href="/api/profile" />}
            variant="outline"
            className="h-13 rounded-full border-white/30 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur hover:border-gold-300 hover:bg-white/10 hover:text-gold-100"
          >
            <Download />
            Tải Profile PDF
          </Button>
        </motion.div>

        {/* Điều khiển slider */}
        {!videoUrl && (
          <div className="mt-12 flex items-center gap-3" role="tablist" aria-label="Chọn slide">
            {slides.map((s, i) => (
              <button
                key={s.image}
                role="tab"
                aria-selected={i === active}
                aria-label={`Slide ${i + 1}: ${s.eyebrow}`}
                onClick={() => setActive(i)}
                className="group flex items-center gap-2 py-2"
              >
                <span className="text-xs font-semibold text-white/50 tabular-nums group-aria-selected:text-gold-300">
                  0{i + 1}
                </span>
                <span className="relative h-0.5 w-10 overflow-hidden rounded-full bg-white/20 sm:w-16">
                  {i === active && (
                    <motion.span
                      key={`${active}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-gold-300"
                      initial={{ width: "0%" }}
                      animate={{ width: paused ? "0%" : "100%" }}
                      transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Thống kê */}
      <div className="relative border-t border-white/10 bg-navy-950/60 backdrop-blur-md">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
              className={cn(
                "flex flex-col-reverse gap-1 py-6 sm:py-8",
                i % 2 === 1 && "border-l border-white/10 pl-5 sm:pl-8",
                i >= 2 && "border-t border-white/10 lg:border-t-0",
                i > 0 && "lg:border-l lg:border-white/10 lg:pl-8",
              )}
            >
              <dt className="text-xs tracking-wide text-navy-200 sm:text-sm">{stat.label}</dt>
              <dd className="text-3xl font-bold text-white sm:text-4xl xl:text-5xl">
                <CountUp value={stat.value} />
                <span className="text-gold-300">{stat.suffix}</span>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>

      <Link
        href="/#about"
        aria-label="Cuộn xuống"
        className="absolute right-6 bottom-36 hidden flex-col items-center gap-3 text-[10px] tracking-[0.3em] text-white/60 uppercase [writing-mode:vertical-rl] hover:text-gold-200 lg:flex"
      >
        Cuộn xuống
        <ArrowDown className="size-4 animate-bounce" />
      </Link>
    </section>
  );
}
