"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { RailHint } from "@/components/site/mobile-ui";
import { StaggerGroup, StaggerItem } from "@/components/site/motion";
import { LightboxGallery } from "@/components/ui/lightbox-gallery";
import type { Certificate } from "@/lib/types";

export function Certificates({ items }: { items: Certificate[] }) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <StaggerGroup className="rail rail-xs md:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {items.map((cert, i) => (
          <StaggerItem key={cert.id}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group block w-full text-left focus-visible:outline-none"
              aria-label={`Phóng to ${cert.title}`}
            >
              <div className="relative aspect-[5/7] overflow-hidden rounded-lg border border-gold-200 bg-gold-50 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-focus-visible:ring-3 group-focus-visible:ring-gold-300">
                <Image src={cert.image} alt={cert.title} fill sizes="(min-width:1024px) 16vw, 45vw" className="object-cover" />
                <div className="absolute inset-0 grid place-items-center bg-navy-950/0 transition-colors duration-300 group-hover:bg-navy-950/50">
                  <ZoomIn className="size-8 scale-75 text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-snug font-medium text-navy-900">{cert.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{cert.issuer}</p>
            </button>
          </StaggerItem>
        ))}
      </StaggerGroup>
      <RailHint count={items.length} />

      <LightboxGallery
        index={index}
        onClose={() => setIndex(-1)}
        slides={items.map((c) => ({ src: c.image, alt: c.title, title: c.title, description: c.issuer }))}
      />
    </>
  );
}
