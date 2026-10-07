"use client";

import { CheckCircle2, ClipboardCheck, Construction, DraftingCompass, Factory, HardHat, ScanLine, Sofa, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { RailHint } from "@/components/site/mobile-ui";
import { Reveal, SectionHeading, StaggerGroup, StaggerItem } from "@/components/site/motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SiteContent } from "@/lib/content";
import { equipmentGroupLabels } from "@/lib/data";
import type { Equipment, EquipmentGroup } from "@/lib/types";

const serviceIcons = { drafting: DraftingCompass, sofa: Sofa, hardhat: HardHat, clipboard: ClipboardCheck } as const;

type GroupFilter = EquipmentGroup | "all";

/** Thiết bị chưa có ảnh thật → biểu tượng theo nhóm */
const groupIcons = { machinery: Truck, formwork: Construction, survey: ScanLine, workshop: Factory } as const;

export function Capacity({ equipments, content }: { equipments: Equipment[]; content: SiteContent["capacity"] }) {
  const { services, deliveryCapabilities, workflow } = content;
  const [group, setGroup] = useState<GroupFilter>("all");
  const visible = group === "all" ? equipments : equipments.filter((e) => e.group === group);

  return (
    <section id="capacity" className="relative overflow-hidden bg-navy-950 py-14 text-white sm:py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-gold-300)_1px,transparent_1px),linear-gradient(90deg,var(--color-gold-300)_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="light"
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        {/* Lĩnh vực hoạt động */}
        <StaggerGroup className="rail mt-8 sm:mt-14 md:grid-cols-2 md:gap-px md:overflow-hidden md:rounded-2xl md:bg-white/10 lg:grid-cols-4">
          {services.map((s) => {
            const Icon = serviceIcons[s.icon] ?? DraftingCompass;
            return (
              <StaggerItem key={s.title} className="group relative bg-navy-950 p-6 transition-colors duration-300 hover:bg-navy-900 max-md:rounded-2xl max-md:border max-md:border-white/10 sm:p-7">
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold-300 transition-transform duration-300 group-hover:scale-x-100" />
                <Icon className="size-8 text-gold-300 sm:size-10" strokeWidth={1.3} />
                <h3 className="mt-4 text-lg font-semibold sm:mt-6">{s.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-navy-200">
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
        <RailHint count={services.length} tone="light" />

        {/* Năng lực triển khai + quy trình */}
        <div className="mt-12 grid gap-10 sm:mt-24 sm:gap-14 lg:grid-cols-2">
          <Reveal className="relative min-w-0">
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl sm:block">
              <Image src={content.image} alt="Đội thi công Anyhome tại công trường" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10" />
              <p className="absolute right-6 bottom-6 left-6 text-lg font-medium text-gold-100 sm:text-2xl">
                {content.quote}
              </p>
            </div>
            <h3 className="text-xl font-bold sm:hidden">Năng lực triển khai</h3>
            <ul className="mt-4 grid gap-3 sm:mt-8 sm:grid-cols-2">
              {deliveryCapabilities.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-navy-100">
                  <CheckCircle2 className="size-5 shrink-0 text-gold-300" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="min-w-0">
            <h3 className="text-xl font-bold sm:text-3xl">{content.workflowTitle}</h3>
            <p className="mt-2 text-sm text-navy-200">{content.workflowSubtitle}</p>
            <StaggerGroup className="rail rail-narrow mt-5 sm:mt-8 md:grid-cols-1 md:gap-1" step={0.1}>
              {workflow.map((w) => (
                <StaggerItem key={w.step + w.title} className="group flex gap-4 rounded-xl p-4 transition-colors hover:bg-white/5 max-md:border max-md:border-white/10 sm:gap-5">
                  <span className="text-2xl leading-none font-bold text-gold-300/60 transition-colors group-hover:text-gold-300 sm:text-3xl">{w.step}</span>
                  <div>
                    <h4 className="font-semibold">{w.title}</h4>
                    <p className="mt-1 text-sm text-navy-200">{w.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <RailHint count={workflow.length} tone="light" />
          </div>
        </div>

        {/* Danh mục thiết bị */}
        <div className="mt-14 sm:mt-24">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <SectionHeading compact tone="light" eyebrow="Máy móc & Thiết bị" title={content.equipmentTitle} />
            <Tabs value={group} onValueChange={(v) => setGroup(v as GroupFilter)}>
              <TabsList className="-mx-4 w-[calc(100%+2rem)] justify-start gap-1 overflow-x-auto rounded-none bg-transparent px-4 [scrollbar-width:none] group-data-horizontal/tabs:h-auto sm:mx-0 sm:w-fit sm:flex-wrap sm:rounded-full sm:bg-white/5 sm:p-1">
                {(["all", ...Object.keys(equipmentGroupLabels)] as GroupFilter[]).map((g) => (
                  <TabsTrigger
                    key={g}
                    value={g}
                    className="h-10 flex-none rounded-full border border-white/10 px-4 text-navy-100 hover:text-white data-active:border-gold-300 data-active:bg-gold-300 data-active:text-navy-900 sm:h-9 sm:border-0"
                  >
                    {g === "all" ? "Tất cả" : equipmentGroupLabels[g]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <motion.div layout className="rail rail-narrow mt-6 sm:mt-10 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((e) => (
                <motion.article
                  layout
                  key={e.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35 }}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-navy-900"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {e.image ? (
                      <Image src={e.image} alt={e.name} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <EquipmentPlaceholder group={e.group} />
                    )}
                    <Badge className="absolute top-3 left-3 bg-navy-950/80 text-gold-200 backdrop-blur">{equipmentGroupLabels[e.group]}</Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold">{e.name}</h3>
                    <p className="mt-1 text-sm text-navy-200">{e.spec}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-navy-300">
                      <span>
                        <strong className="text-base text-gold-300">{e.quantity.toLocaleString("vi-VN")}</strong> {e.unit}
                      </span>
                      <span>Xuất xứ: {e.origin}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
          <RailHint count={visible.length} tone="light" />
        </div>
      </div>
    </section>
  );
}

function EquipmentPlaceholder({ group }: { group: EquipmentGroup }) {
  const Icon = groupIcons[group] ?? HardHat;
  return (
    <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-navy-800 to-navy-950">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(var(--color-gold-300)_1px,transparent_1px),linear-gradient(90deg,var(--color-gold-300)_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <Icon className="relative size-14 text-gold-300/80 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.2} />
    </div>
  );
}
