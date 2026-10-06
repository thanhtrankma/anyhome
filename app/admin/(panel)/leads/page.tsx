import { LeadsTable } from "@/components/admin/leads-table";
import { PageHeader } from "@/components/admin/page-header";
import { ProfilePdfCard } from "@/components/admin/profile-pdf-card";
import { LeadStatusBadge } from "@/components/admin/status-badge";
import { getLeads, getProfileDownloads, getSettings } from "@/lib/store";
import type { LeadStatus } from "@/lib/types";

export const metadata = { title: "Báo giá / Leads" };

export default async function AdminLeadsPage() {
  const [leads, settings, profileDownloads] = await Promise.all([getLeads(), getSettings(), getProfileDownloads()]);
  const counts = (["new", "contacted", "quoted", "closed"] as LeadStatus[]).map((s) => ({
    status: s,
    count: leads.filter((l) => l.status === s).length,
  }));

  return (
    <>
      <PageHeader title="Báo giá & Khách hàng" description="Danh sách khách hàng đăng ký tư vấn qua form website." />
      <div className="grid gap-6 2xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap gap-2">
            {counts.map((c) => (
              <span key={c.status} className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
                <LeadStatusBadge status={c.status} />
                <strong className="tabular-nums">{c.count}</strong>
              </span>
            ))}
          </div>
          <LeadsTable leads={leads} />
        </div>
        <div>
          <ProfilePdfCard
            updatedAt={settings.profilePdfUpdatedAt}
            isLocal={!!settings.profilePdfFile}
            downloads={profileDownloads}
          />
        </div>
      </div>
    </>
  );
}
