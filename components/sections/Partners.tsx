"use client";

import Autoplay from "embla-carousel-autoplay";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { SectionHeading } from "@/components/site/motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { SiteContent } from "@/lib/content";

/** Wordmark tạm cho đối tác — thay bằng logo thật (SVG/PNG) khi có. */
function PartnerMark({ name, sector, logo }: { name: string; sector: string; logo: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="group flex h-20 items-center sm:h-28 gap-4 rounded-xl border border-navy-100 bg-white px-5 grayscale transition-all duration-300 hover:border-gold-300 hover:shadow-lg hover:grayscale-0">
      {logo ? (
        <span className="relative size-12 shrink-0">
          <Image src={logo} alt="" fill sizes="48px" className="object-contain" />
        </span>
      ) : (
        <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-navy-900 text-base font-bold text-gold-300 transition-colors group-hover:bg-gold-300 group-hover:text-navy-900">
          {initials}
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-base font-bold tracking-wide text-navy-900 uppercase">{name}</span>
        <span className="block truncate text-xs text-muted-foreground">{sector}</span>
      </span>
    </div>
  );
}

export function Partners({ items, heading }: { items: SiteContent["partners"]["items"]; heading: SiteContent["sections"] }) {
  // ui-ux-pro-max · auto-rotation-controls: dừng khi hover/focus (stopOnFocusIn mặc định),
  // có nút tạm dừng và tắt hẳn khi người dùng bật "giảm chuyển động"
  const reduceMotion = useReducedMotion();
  const [autoplay] = useState(() => Autoplay({ delay: 2600, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [running, setRunning] = useState(true);

  const toggle = () => {
    if (running) autoplay.stop();
    else autoplay.play();
    setRunning(!running);
  };

  return (
    <section id="partners" className="border-y border-navy-50 bg-white py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={heading.partnersEyebrow}
          title={heading.partnersTitle}
          description={heading.partnersDescription}
          align="center"
        />
        <Carousel opts={{ loop: true, align: "start" }} plugins={reduceMotion ? [] : [autoplay]} className="mt-8 px-1 sm:mt-12 sm:px-12">
          <CarouselContent className="-ml-4">
            {items.map((p, i) => (
              <CarouselItem key={`${p.name}-${i}`} className="basis-[72%] pl-4 sm:basis-1/2 lg:basis-1/4">
                <PartnerMark {...p} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex" />
          <CarouselNext className="hidden sm:inline-flex" />
        </Carousel>
        {!reduceMotion && (
          <div className="mt-3 flex justify-center sm:mt-6">
            <button
              type="button"
              onClick={toggle}
              aria-label={running ? "Tạm dừng tự chạy logo đối tác" : "Tiếp tục tự chạy logo đối tác"}
              className="flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground transition-colors duration-200 hover:text-navy-900"
            >
              {running ? <Pause className="size-4" /> : <Play className="size-4" />}
              {running ? "Tạm dừng" : "Tự chạy"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
