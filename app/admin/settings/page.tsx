import { PageHeader } from "@/components/admin/page-header";
import { ProfilePdfCard } from "@/components/admin/profile-pdf-card";
import { SettingsForm } from "@/components/admin/settings-form";
import { db } from "@/lib/store";

export const metadata = { title: "Cài đặt hệ thống" };

export default function AdminSettingsPage() {
  const { settings, metrics } = db();
  return (
    <>
      <PageHeader title="Cài đặt hệ thống" description="Thông tin liên hệ, số liệu trang chủ và tệp Company Profile." />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <SettingsForm
          defaultValues={{
            hotline: settings.hotline,
            zalo: settings.zalo,
            email: settings.email,
            officeAddress: settings.officeAddress,
            branchAddress: settings.branchAddress,
            mapQuery: settings.mapQuery,
            stats: settings.stats,
          }}
        />
        <div>
          <ProfilePdfCard updatedAt={settings.profilePdfUpdatedAt} isLocal={!!settings.profilePdfFile} downloads={metrics.profileDownloads} />
        </div>
      </div>
    </>
  );
}
