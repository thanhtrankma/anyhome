"use client";

import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";

import { SectionHeading } from "@/components/site/motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { partners } from "@/lib/data";

/** Wordmark tạm cho đối tác — thay bằng logo thật (SVG/PNG) khi có. */
function PartnerMark({ name, sector }: { name: string; sector: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="group flex h-28 items-center gap-4 rounded-xl border border-navy-100 bg-white px-5 grayscale transition-all duration-500 hover:border-gold-300 hover:shadow-lg hover:grayscale-0">
      <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-navy-900 font-serif text-lg font-bold text-gold-300 transition-colors group-hover:bg-gold-300 group-hover:text-navy-900">
        {initials}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-bold tracking-wide text-navy-900 uppercase">{name}</span>
        <span className="block truncate text-xs text-muted-foreground">{sector}</span>
      </span>
    </div>
  );
}

export function Partners() {
  const [autoplay] = useState(() => Autoplay({ delay: 2600, stopOnInteraction: false, stopOnMouseEnter: true }));

  return (
    <section id="partners" className="border-y border-navy-50 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Khách hàng & Đối tác"
          title="Đồng hành cùng các chủ đầu tư uy tín"
          description="Tận tâm – Minh bạch – Trách nhiệm: nền tảng cho những mối quan hệ hợp tác bền vững."
          align="center"
        />
        <Carousel opts={{ loop: true, align: "start" }} plugins={[autoplay]} className="mt-12 px-1 sm:px-12">
          <CarouselContent className="-ml-4">
            {partners.map((p) => (
              <CarouselItem key={p.name} className="basis-[80%] pl-4 sm:basis-1/2 lg:basis-1/4">
                <PartnerMark {...p} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex" />
          <CarouselNext className="hidden sm:inline-flex" />
        </Carousel>
      </div>
    </section>
  );
}
