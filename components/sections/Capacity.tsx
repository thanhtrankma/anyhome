"use client";

import { CheckCircle2, ClipboardCheck, DraftingCompass, HardHat, Sofa } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { Reveal, SectionHeading, StaggerGroup, StaggerItem } from "@/components/site/motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deliveryCapabilities, equipmentGroupLabels, img, services, workflow } from "@/lib/data";
import type { Equipment, EquipmentGroup } from "@/lib/types";

const serviceIcons = { drafting: DraftingCompass, sofa: Sofa, hardhat: HardHat, clipboard: ClipboardCheck } as const;

type GroupFilter = EquipmentGroup | "all";

export function Capacity({ equipments }: { equipments: Equipment[] }) {
  const [group, setGroup] = useState<GroupFilter>("all");
  const visible = group === "all" ? equipments : equipments.filter((e) => e.group === group);

  return (
    <section id="capacity" className="relative overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-gold-300)_1px,transparent_1px),linear-gradient(90deg,var(--color-gold-300)_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="light"
          eyebrow="Lĩnh vực & Năng lực"
          title="Một đầu mối — trọn vẹn từ bản vẽ đến bàn giao"
          description="Anyhome sở hữu năng lực triển khai đồng bộ từ thiết kế, thi công phần thô, hoàn thiện kiến trúc đến sản xuất và lắp đặt nội thất — kiểm soát xuyên suốt chất lượng, tiến độ và chi phí."
        />

        {/* Lĩnh vực hoạt động */}
        <StaggerGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => {
            const Icon = serviceIcons[s.icon];
            return (
              <StaggerItem key={s.title} className="group relative bg-navy-950 p-7 transition-colors duration-500 hover:bg-navy-900">
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold-300 transition-transform duration-500 group-hover:scale-x-100" />
                <Icon className="size-10 text-gold-300" strokeWidth={1.3} />
                <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-navy-200">
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* Năng lực triển khai + quy trình */}
        <div className="mt-24 grid gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={img("1541888946425-d81bb19240f5", 1400)} alt="Đội thi công Anyhome tại công trường" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10" />
              <p className="absolute right-6 bottom-6 left-6 font-serif text-xl text-gold-100 italic sm:text-2xl">
                “Vững chắc từ kết cấu, tinh tế trong hoàn thiện.”
              </p>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {deliveryCapabilities.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-navy-100">
                  <CheckCircle2 className="size-5 shrink-0 text-gold-300" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <div>
            <h3 className="text-2xl font-bold">Quy trình Design & Build</h3>
            <p className="mt-2 text-sm text-navy-200">Giám sát chặt chẽ, bảo chứng chất lượng công trình.</p>
            <StaggerGroup className="mt-8 space-y-1" step={0.1}>
              {workflow.map((w) => (
                <StaggerItem key={w.step} className="group flex gap-5 rounded-xl p-4 transition-colors hover:bg-white/5">
                  <span className="font-serif text-3xl leading-none text-gold-300/50 transition-colors group-hover:text-gold-300">{w.step}</span>
                  <div>
                    <h4 className="font-semibold">{w.title}</h4>
                    <p className="mt-1 text-sm text-navy-200">{w.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>

        {/* Danh mục thiết bị */}
        <div className="mt-24">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading tone="light" eyebrow="Máy móc & Thiết bị" title="Hệ thống thiết bị thi công hiện đại" />
            <Tabs value={group} onValueChange={(v) => setGroup(v as GroupFilter)}>
              <TabsList className="flex-wrap justify-start gap-1 rounded-full bg-white/5 p-1 group-data-horizontal/tabs:h-auto">
                {(["all", ...Object.keys(equipmentGroupLabels)] as GroupFilter[]).map((g) => (
                  <TabsTrigger
                    key={g}
                    value={g}
                    className="h-9 flex-none rounded-full px-4 text-navy-100 hover:text-white data-active:bg-gold-300 data-active:text-navy-900"
                  >
                    {g === "all" ? "Tất cả" : equipmentGroupLabels[g]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                    <Image src={e.image} alt={e.name} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
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
        </div>
      </div>
    </section>
  );
}
