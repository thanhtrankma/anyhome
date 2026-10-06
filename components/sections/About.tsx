import { Compass, Handshake, Leaf, Lightbulb, Quote, Ruler, Target, Users } from "lucide-react";
import Image from "next/image";

import { Certificates } from "@/components/sections/Certificates";
import { OrgChart } from "@/components/sections/OrgChart";
import { MobileDisclosure, RailHint } from "@/components/site/mobile-ui";
import { Reveal, SectionHeading, StaggerGroup, StaggerItem } from "@/components/site/motion";
import type { SiteContent } from "@/lib/content";
import { orgChart } from "@/lib/data";

const valueIcons = { users: Users, lightbulb: Lightbulb, ruler: Ruler, handshake: Handshake, leaf: Leaf } as const;

export function About({ content }: { content: SiteContent }) {
  const { about, general, certificates } = content;
  return (
    <section id="about" className="relative overflow-hidden bg-white py-14 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Giới thiệu chung */}
        <div className="grid items-center gap-8 sm:gap-14 lg:grid-cols-2 [&>*]:min-w-0">
          <Reveal className="relative order-2 lg:order-none">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[4/5]">
              <Image src={about.image} alt="Không gian nội thất do Anyhome thiết kế" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute bottom-3 left-3 w-44 rounded-xl bg-navy-900/95 p-4 text-white shadow-2xl sm:-right-8 sm:-bottom-8 sm:left-auto sm:w-64 sm:p-6">
              <p className="text-4xl font-bold tracking-tight text-gold-300 sm:text-6xl">{general.founded}</p>
              <p className="mt-1 text-xs text-navy-100 sm:mt-2 sm:text-sm">{about.foundedCaption}</p>
            </div>
            <div className="absolute -top-6 -left-6 -z-10 hidden size-40 bg-gold-100 sm:block" aria-hidden />
          </Reveal>

          <div>
            <SectionHeading
              eyebrow={about.eyebrow}
              title={
                <>
                  {about.title}
                  {about.titleHighlight && (
                    <>
                      <br />
                      <span className="text-gold-600">{about.titleHighlight}</span>
                    </>
                  )}
                </>
              }
              description={about.intro}
            />
            <Reveal delay={0.1} className="hidden sm:block">
              <figure className="mt-8 border-l-2 border-gold-400 pl-6">
                <Quote className="mb-2 size-6 text-gold-400" />
                <blockquote className="text-lg leading-relaxed text-navy-800">{about.letter}</blockquote>
                <figcaption className="mt-3 text-sm font-semibold text-navy-900">
                  {general.representative} <span className="font-normal text-muted-foreground">— {general.representativeRole}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        {/* Tầm nhìn – Sứ mệnh – Giá trị cốt lõi */}
        <div className="rail mt-12 sm:mt-28 md:grid-cols-3 md:gap-6">
          {[
            { icon: Compass, title: "Tầm nhìn", body: about.vision },
            { icon: Target, title: "Sứ mệnh", body: about.mission },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} className="group rounded-2xl border border-navy-100 bg-gold-50/40 p-6 transition-colors sm:p-8 duration-300 hover:border-gold-300 hover:bg-gold-50">
              <item.icon className="size-8 text-gold-600 sm:size-10 transition-transform duration-300 group-hover:rotate-12" strokeWidth={1.4} />
              <h3 className="mt-4 text-xl font-bold text-navy-900 sm:mt-6">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
          <Reveal delay={0.2} className="rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
            <h3 className="text-xl font-bold">Giá trị cốt lõi</h3>
            <ul className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
              {about.coreValues.map((v) => {
                const Icon = valueIcons[v.icon] ?? Users;
                return (
                  <li key={v.title} className="flex items-center gap-4 text-sm">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-300/15 text-gold-300">
                      <Icon className="size-4" />
                    </span>
                    {v.title}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
        <RailHint count={3} />

        {/* Lịch sử */}
        <div className="mt-14 sm:mt-28">
          <SectionHeading compact eyebrow="Hành trình phát triển" title={about.milestonesTitle} align="center" />
          <StaggerGroup className="rail rail-narrow relative mt-8 sm:mt-14 md:grid-cols-3 md:gap-8" step={0.15}>
            <div className="absolute top-[22px] right-0 left-0 hidden h-px bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200 md:block" aria-hidden />
            {about.milestones.map((m) => (
              <StaggerItem key={m.period + m.title} className="relative max-md:rounded-2xl max-md:border max-md:border-navy-100 max-md:p-5">
                <span className="relative z-10 inline-flex h-9 items-center rounded-full border-2 border-gold-400 bg-white px-4 text-sm font-bold sm:h-11 sm:px-5 text-navy-900">
                  {m.period}
                </span>
                <h3 className="mt-3 text-base font-bold text-navy-900 sm:mt-5 sm:text-lg">{m.title}</h3>
                <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground sm:mt-3 sm:space-y-2 sm:text-sm">
                  {m.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold-400" />
                      {it}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <RailHint count={about.milestones.length} />
        </div>

        {/* Nhân sự & Sơ đồ tổ chức */}
        <div className="mt-14 grid gap-8 sm:mt-28 sm:gap-12 lg:grid-cols-[1fr_1.6fr] [&>*]:min-w-0">
          <div>
            <SectionHeading
              compact
              eyebrow="Năng lực nhân sự"
              title={about.teamTitle}
              description={about.teamDescription}
            />
            <StaggerGroup className="mt-6 space-y-3 sm:mt-8">
              {about.leadership.map((p) => (
                <StaggerItem key={p.name + p.role} className="flex items-center justify-between gap-4 border-b border-navy-100 pb-3">
                  <span className="font-semibold text-navy-900">{p.name}</span>
                  <span className="text-right text-sm text-gold-700">{p.role}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
          <MobileDisclosure label="Xem sơ đồ tổ chức">
            <Reveal>
              <OrgChart root={orgChart} />
            </Reveal>
          </MobileDisclosure>
        </div>

        {/* Pháp lý */}
        <div className="mt-14 sm:mt-28">
          <SectionHeading
            compact
            eyebrow="Thông tin pháp lý"
            title={certificates.title}
            description={certificates.description}
          />
          <div className="mt-8 sm:mt-12">
            <Certificates items={certificates.items.map((c, i) => ({ ...c, id: `cert-${i}` }))} />
          </div>
        </div>
      </div>
    </section>
  );
}
