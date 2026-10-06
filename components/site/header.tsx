"use client";

import { Menu, Phone } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/site/logo";
import { NAV_ITEMS } from "@/components/site/nav-items";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SiteHeader({ hotline, solid = false }: { hotline: string; solid?: boolean }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(solid);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(solid || y > 40);
    // Ẩn khi cuộn xuống nhanh, hiện lại khi cuộn lên
    setHidden(y > 600 && y > prev + 4);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
        scrolled ? "bg-navy-950/85 shadow-[0_8px_30px_rgba(0,0,0,.25)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Anyhome – Trang chủ" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
                >
                  {item.label}
                  <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-300 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${hotline.replace(/\s/g, "")}`}
            className="hidden items-center gap-2 text-sm font-semibold text-gold-200 transition-colors hover:text-gold-100 xl:flex"
          >
            <Phone className="size-4" /> {hotline}
          </a>
          <Button
            nativeButton={false}
            render={<Link href="/#contact" />}
            className="hidden h-10 rounded-full bg-gold-300 px-5 font-semibold text-navy-900 hover:bg-gold-200 sm:inline-flex"
          >
            Nhận báo giá
          </Button>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-lg" className="text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="Mở menu" />
              }
            >
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="theme-light border-none bg-navy-950 p-0 text-white data-[side=right]:w-[86vw] data-[side=right]:sm:max-w-sm">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex h-full flex-col p-6">
                <Logo className="mb-10" />
                <AnimatePresence>
                  <ul className="flex flex-col">
                    {NAV_ITEMS.map((item, i) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i + 0.1 }}
                      >
                        <SheetClose
                          nativeButton={false}
                          render={<Link href={item.href} />}
                          className="block border-b border-white/10 py-4 text-lg font-medium text-white/90 hover:text-gold-200"
                        >
                          {item.label}
                        </SheetClose>
                      </motion.li>
                    ))}
                  </ul>
                </AnimatePresence>
                <div className="mt-auto space-y-3">
                  <a href={`tel:${hotline.replace(/\s/g, "")}`} className="flex items-center gap-3 text-gold-200">
                    <Phone className="size-5" /> {hotline}
                  </a>
                  <SheetClose
                    nativeButton={false}
                    render={<Link href="/#contact" />}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-gold-300 font-semibold text-navy-900"
                  >
                    Nhận báo giá miễn phí
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
