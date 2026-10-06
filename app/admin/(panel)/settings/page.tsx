import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/admin/page-header";
import { ProfilePdfCard } from "@/components/admin/profile-pdf-card";
import { SettingsForm } from "@/components/admin/settings-form";
import { contentGroups } from "@/lib/content-schema";
import { getProfileDownloads, getSettings } from "@/lib/store";

export const metadata = { title: "Liên hệ & số liệu" };

export default async function AdminSettingsPage() {
  const [settings, profileDownloads] = await Promise.all([getSettings(), getProfileDownloads()]);
  return (
    <>
      <PageHeader
        eyebrow="Giao diện & cài đặt"
        title="Liên hệ & số liệu"
        description="Hotline, địa chỉ, số liệu nổi bật trên banner và tệp Company Profile."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <SettingsForm
          defaultValues={{
            hotline: settings.hotline,
            hotline2: settings.hotline2 ?? "",
            zalo: settings.zalo,
            email: settings.email,
            officeAddress: settings.officeAddress,
            branchAddress: settings.branchAddress,
            mapQuery: settings.mapQuery,
            stats: settings.stats,
          }}
        />
        <div className="space-y-6">
          <nav aria-label="Các nhóm cài đặt khác" className="rounded-xl border bg-card p-2">
            <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Nội dung website</p>
            <ul>
              {contentGroups.map((g) => (
                <li key={g.key}>
                  <Link
                    href={`/admin/settings/${g.key}`}
                    className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{g.label}</span>
                      <span className="line-clamp-1 block text-xs text-muted-foreground">{g.description}</span>
                    </span>
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ProfilePdfCard updatedAt={settings.profilePdfUpdatedAt} isLocal={!!settings.profilePdfFile} downloads={profileDownloads} />
        </div>
      </div>
    </>
  );
}
