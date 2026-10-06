"use client";

import { ArrowUpRight, Calendar, Expand, MapPin, Maximize, Plus, Ruler } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

import { RailHint } from "@/components/site/mobile-ui";
import { Reveal, SectionHeading } from "@/components/site/motion";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LightboxGallery } from "@/components/ui/lightbox-gallery";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectCategoryLabels } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategory } from "@/lib/types";

type Filter = ProjectCategory | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  ...(Object.entries(projectCategoryLabels) as [ProjectCategory, string][]).map(([value, label]) => ({ value, label })),
];

const PAGE_SIZE = 9;

/**
 * Khi dự án chưa có ảnh 3D riêng (dữ liệu mẫu dùng chung 1 ảnh), mô phỏng
 * "bản render" bằng filter để thanh so sánh vẫn có ý nghĩa thị giác.
 */
const renderLook = (p: Project) =>
  p.beforeAfter && p.beforeAfter.render === p.beforeAfter.real ? "grayscale-[.85] contrast-125 brightness-110 sepia-[.15]" : undefined;

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState(-1);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, residential: 0, industrial: 0, interior: 0 };
    projects.forEach((p) => c[p.category]++);
    return c;
  }, [projects]);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const showcases = projects.filter((p) => p.beforeAfter && p.featured).slice(0, 4);
  const [showcaseId, setShowcaseId] = useState(showcases[0]?.id);
  const showcase = showcases.find((p) => p.id === showcaseId) ?? showcases[0];

  return (
    <section id="projects" className="bg-[#f7f5ef] py-14 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dự án tiêu biểu"
          title="Hơn 500 công trình trên 20 tỉnh thành"
          description="Từ nhà máy, nhà xưởng công nghiệp quy mô lớn đến biệt thự, căn hộ và không gian thương mại — mỗi công trình là sự kết tinh của sáng tạo, kỹ thuật và tâm huyết."
        />

        {/* Showcase So sánh 3D vs Thực tế */}
        {showcase?.beforeAfter && (
          <Reveal className="mt-8 grid gap-5 rounded-2xl bg-navy-950 p-3 text-white sm:mt-14 sm:gap-8 sm:p-6 lg:grid-cols-[1.7fr_1fr] lg:p-8 [&>*]:min-w-0">
            <BeforeAfterSlider
              key={showcase.id}
              beforeSrc={showcase.beforeAfter.render}
              afterSrc={showcase.beforeAfter.real}
              beforeClassName={renderLook(showcase)}
              alt={showcase.title}
            />
            <div className="flex min-w-0 flex-col px-1 pb-1 sm:px-0 sm:pb-0">
              <p className="text-xs font-semibold tracking-[0.25em] text-gold-300 uppercase">3D Render vs Thực tế</p>
              <h3 className="mt-2 text-xl font-bold sm:mt-3 sm:text-2xl">Thi công đúng như bản vẽ</h3>
              <p className="mt-3 hidden text-sm leading-relaxed text-navy-200 sm:block">
                Kéo thanh trượt để đối chiếu phối cảnh thiết kế với công trình hoàn thiện — minh chứng cho quy trình Design & Build hạn chế tối đa sai lệch.
              </p>
              <ul className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:mt-6 lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:px-0" aria-label="Chọn công trình so sánh">
                {showcases.map((p) => (
                  <li key={p.id} className="w-60 shrink-0 lg:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowcaseId(p.id)}
                      aria-pressed={p.id === showcase.id}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-2 text-left text-sm transition-colors",
                        p.id === showcase.id ? "border-gold-300 bg-white/10" : "border-white/10 hover:border-white/30",
                      )}
                    >
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-md">
                        <Image src={p.cover} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{p.title}</span>
                        <span className="block truncate text-xs text-navy-300">{p.location}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {/* Bộ lọc */}
        <div className="mt-10 -mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-16 sm:px-0">
          <Tabs
            value={filter}
            onValueChange={(v) => {
              setFilter(v as Filter);
              setLimit(PAGE_SIZE);
            }}
          >
            <TabsList className="gap-1 rounded-full border border-navy-100 bg-white p-1 group-data-horizontal/tabs:h-auto">
              {FILTERS.map((f) => (
                <TabsTrigger
                  key={f.value}
                  value={f.value}
                  className="h-10 flex-none rounded-full px-4 text-navy-700 data-active:bg-navy-900 data-active:text-white sm:px-5"
                >
                  {f.label}
                  <span className="ml-1 text-xs opacity-60 tabular-nums">{counts[f.value]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Lưới dự án */}
        {/* Mobile: băng trượt toàn bộ dự án đã lọc · Desktop: lưới phân trang "Xem thêm" */}
        <motion.ul layout className="rail mt-6 sm:mt-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.li
                layout
                key={p.id}
                className={cn(i >= limit && "md:hidden")}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: (i % PAGE_SIZE) * 0.04 }}
              >
                <ProjectCard project={p} onOpen={() => setSelected(p)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <RailHint count={filtered.length} />

        {filtered.length > limit && (
          <div className="mt-12 hidden text-center md:block">
            <Button variant="outline" onClick={() => setLimit((l) => l + PAGE_SIZE)} className="h-12 rounded-full border-navy-900 px-8 text-navy-900 hover:bg-navy-900 hover:text-white">
              <Plus /> Xem thêm {Math.min(PAGE_SIZE, filtered.length - limit)} dự án
            </Button>
          </div>
        )}
      </div>

      {/* Chi tiết dự án */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="theme-light max-h-[92dvh] gap-0 overflow-y-auto p-0 sm:max-w-5xl">
          {selected && (
            <>
              <div className="p-3 sm:p-4">
                {selected.beforeAfter ? (
                  <BeforeAfterSlider
                    beforeSrc={selected.beforeAfter.render}
                    afterSrc={selected.beforeAfter.real}
                    beforeClassName={renderLook(selected)}
                    alt={selected.title}
                    sizes="(min-width:1024px) 960px, 100vw"
                  />
                ) : (
                  <button type="button" onClick={() => setLightbox(0)} className="group relative block aspect-[16/9] w-full overflow-hidden rounded-xl" aria-label="Xem ảnh lớn">
                    <Image src={selected.cover} alt={selected.title} fill sizes="(min-width:1024px) 960px, 100vw" className="object-cover" />
                    <span className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-navy-950/70 px-3 py-1.5 text-xs text-white backdrop-blur">
                      <Expand className="size-3.5" /> Xem ảnh lớn
                    </span>
                  </button>
                )}
              </div>
              <div className="grid gap-8 px-5 pb-7 sm:px-8 lg:grid-cols-[1.5fr_1fr]">
                <div>
                  <Badge className="bg-gold-100 text-gold-800">{projectCategoryLabels[selected.category]}</Badge>
                  <DialogTitle className="mt-3 text-2xl font-bold text-navy-900">{selected.title}</DialogTitle>
                  <DialogDescription className="mt-3 text-sm leading-relaxed">{selected.summary}</DialogDescription>
                  {selected.gallery.length > 1 && (
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      {selected.gallery.map((src, i) => (
                        <button key={src + i} type="button" onClick={() => setLightbox(i)} className="relative aspect-square overflow-hidden rounded-lg" aria-label={`Ảnh ${i + 1}`}>
                          <Image src={src} alt="" fill sizes="160px" className="object-cover transition-transform duration-300 hover:scale-110" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <dl className="space-y-4 rounded-xl bg-muted/70 p-5 text-sm">
                  {[
                    { icon: MapPin, label: "Địa điểm", value: selected.location },
                    { icon: Ruler, label: "Quy mô", value: selected.scale },
                    { icon: Maximize, label: "Diện tích", value: `${selected.area.toLocaleString("vi-VN")} m²` },
                    { icon: Calendar, label: "Hoàn thành", value: String(selected.year) },
                  ].map((row) => (
                    <div key={row.label} className="flex gap-3">
                      <row.icon className="mt-0.5 size-4 shrink-0 text-gold-600" />
                      <div>
                        <dt className="text-xs text-muted-foreground">{row.label}</dt>
                        <dd className="font-medium text-navy-900">{row.value}</dd>
                      </div>
                    </div>
                  ))}
                  {selected.client && (
                    <div className="border-t border-border pt-4">
                      <dt className="text-xs text-muted-foreground">Chủ đầu tư</dt>
                      <dd className="font-medium text-navy-900">{selected.client}</dd>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
                    {selected.scope.map((s) => (
                      <Badge key={s} variant="outline" className="border-navy-200 text-navy-700">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </dl>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {selected && (
        <LightboxGallery
          index={lightbox}
          onClose={() => setLightbox(-1)}
          slides={selected.gallery.map((src) => ({ src, alt: selected.title, title: selected.title, description: selected.location }))}
        />
      )}
    </section>
  );
}

function ProjectCard({ project: p, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_20px_-8px_rgba(21,26,46,.15)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-20px_rgba(21,26,46,.35)] focus-visible:ring-3 focus-visible:ring-gold-300 focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={p.cover}
          alt={p.title}
          fill
          sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/0 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
        <Badge className="absolute top-4 left-4 bg-white/90 text-navy-900 backdrop-blur">{projectCategoryLabels[p.category]}</Badge>
        {p.beforeAfter && (
          <Badge className="absolute bottom-4 left-4 bg-gold-300 text-navy-900">3D ↔ Thực tế</Badge>
        )}
        <span className="absolute right-4 bottom-4 grid size-11 translate-y-3 place-items-center rounded-full bg-gold-300 text-navy-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <div className="p-6">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg leading-snug font-bold text-navy-900 transition-colors group-hover:text-gold-700">
          {p.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-gold-600" />
          <span className="truncate">{p.location}</span>
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-navy-50 pt-4 text-sm">
          <span className="flex items-center gap-1.5 text-navy-700">
            <Ruler className="size-4 text-gold-600" />
            <span className="truncate">{p.scale}</span>
          </span>
          <span className="shrink-0 font-semibold text-navy-900 tabular-nums">{p.year}</span>
        </div>
      </div>
    </button>
  );
}
