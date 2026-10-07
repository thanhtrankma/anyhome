"use client";

import { Menu, Phone } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { telHref } from "@/lib/phone";
import { cn } from "@/lib/utils";

export function SiteHeader({
  hotlines,
  navItems,
  ctaLabel,
  logo,
  brand,
  solid = false,
}: {
  hotlines: string[];
  navItems: { label: string; href: string }[];
  ctaLabel: string;
  logo?: string;
  brand: string;
  solid?: boolean;
}) {
  const [hotline] = hotlines;
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(solid);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(solid || y > 40);
    setPastHero(y > window.innerHeight * 0.6);
    // Desktop: ẩn khi cuộn xuống nhanh. Mobile: luôn hiện vì chứa thanh mục lục nhanh
    setHidden(window.innerWidth >= 1024 && y > 600 && y > prev + 4);
  });

  // Scrollspy: đánh dấu mục đang nằm giữa màn hình
  useEffect(() => {
    const sections = navItems.map((n) => document.getElementById(n.href.split("#")[1])).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [navItems]);

  // Giữ chip đang active ở giữa hàng chip. KHÔNG dùng scrollIntoView: nó cuộn cả các
  // vùng cuộn cha, kể cả visual viewport của trình duyệt → header/bottom bar bị lệch, khuyết.
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!row || !chip) return;
    row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [activeId]);

  return (
    <header
      className={cn(
        // Không dùng transform thường trực: trên Safari/Chrome di động, phần tử fixed có transform
        // dễ bị lệch/khuyết khi thanh địa chỉ co giãn lúc cuộn. Chỉ trượt ẩn trên desktop.
        "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,backdrop-filter,translate] duration-300",
        hidden && "-translate-y-full",
        scrolled ? "bg-navy-950/85 shadow-[0_8px_30px_rgba(0,0,0,.25)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={`${brand} – Trang chủ`} className="shrink-0">
          <Logo src={logo} alt={brand} />
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
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
            href={telHref(hotline)}
            className="hidden items-center gap-2 text-sm font-semibold text-gold-200 transition-colors hover:text-gold-100 xl:flex"
          >
            <Phone className="size-4" /> {hotline}
          </a>
          <Button
            nativeButton={false}
            render={<Link href="/#contact" />}
            className="hidden h-10 rounded-full bg-gold-300 px-5 font-semibold text-navy-900 hover:bg-gold-200 sm:inline-flex"
          >
            {ctaLabel}
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
                <Logo src={logo} alt={brand} className="mb-10" />
                <AnimatePresence>
                  <ul className="flex flex-col">
                    {navItems.map((item, i) => (
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
                  {hotlines.map((h) => (
                    <a key={h} href={telHref(h)} className="flex min-h-11 items-center gap-3 text-gold-200">
                      <Phone className="size-5" /> {h}
                    </a>
                  ))}
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

      {/* Mobile: mục lục nhanh — nhảy giữa các phần thay vì cuộn dài */}
      <AnimatePresence initial={false}>
        {pastHero && (
          <motion.nav
            aria-label="Mục lục trang"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div ref={chipsRef} className="relative flex gap-2 overflow-x-auto overscroll-x-contain px-4 py-2 [scrollbar-width:none]">
              {navItems.map((item) => {
                const active = item.href.endsWith(`#${activeId}`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-medium transition-colors duration-200",
                      active ? "bg-gold-300 text-navy-900" : "bg-white/10 text-white/85",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
