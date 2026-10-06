import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { NAV_ITEMS } from "@/components/site/nav-items";
import { company } from "@/lib/data";
import { getHotlines, telHref } from "@/lib/phone";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative overflow-hidden bg-navy-950 pb-20 text-navy-200 md:pb-0">
      <div className="pointer-events-none absolute -top-40 -right-40 hidden size-[480px] rotate-45 bg-gold-300/5 md:block" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:gap-12 sm:px-6 sm:py-16 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-6 hidden max-w-sm text-sm leading-relaxed text-navy-200/80 sm:block">{company.tagline}</p>
          <dl className="mt-6 space-y-1 text-xs text-navy-300">
            <div>
              <dt className="inline">Tên công ty: </dt>
              <dd className="inline text-navy-100">{company.legalName}</dd>
            </div>
            <div>
              <dt className="inline">Mã số thuế: </dt>
              <dd className="inline text-navy-100">{company.taxCode}</dd>
            </div>
            <div>
              <dt className="inline">Trụ sở: </dt>
              <dd className="inline">{settings.hqAddress}</dd>
            </div>
          </dl>
        </div>

        <nav aria-label="Liên kết chân trang" className="hidden md:block">
          <h3 className="mb-5 text-sm font-semibold tracking-widest text-gold-300 uppercase">Khám phá</h3>
          <ul className="space-y-3 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-gold-200">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="/api/profile" className="transition-colors hover:text-gold-200">
                Tải Company Profile (PDF)
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-5 text-sm font-semibold tracking-widest text-gold-300 uppercase">Liên hệ</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-300" />
              <span>
                <strong className="block font-medium text-white">Văn phòng Hà Nội</strong>
                {settings.officeAddress}
              </span>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-300" />
              <span>
                <strong className="block font-medium text-white">Chi nhánh Hải Phòng</strong>
                {settings.branchAddress}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 shrink-0 text-gold-300" />
              <span className="flex flex-wrap gap-x-3 gap-y-1">
                {getHotlines(settings).map((h, i) => (
                  <span key={h} className="flex gap-3">
                    {i > 0 && <span className="text-navy-400" aria-hidden>·</span>}
                    <a href={telHref(h)} className="hover:text-gold-200">
                      {h}
                    </a>
                  </span>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="size-4 shrink-0 text-gold-300" />
              <a href={`mailto:${settings.email}`} className="hover:text-gold-200">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-navy-300 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {company.shortName} · {company.closing}
        </p>
      </div>
    </footer>
  );
}
