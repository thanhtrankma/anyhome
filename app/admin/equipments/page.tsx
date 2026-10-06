import { EquipmentsManager } from "@/components/admin/equipments-manager";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/lib/store";

export const metadata = { title: "Năng lực & Thiết bị" };

export default function AdminEquipmentsPage() {
  const { equipments } = db();
  return (
    <>
      <PageHeader title="Năng lực & Thiết bị" description={`${equipments.length} hạng mục máy móc, cốp pha và thiết bị kỹ thuật.`} />
      <EquipmentsManager equipments={equipments} />
    </>
  );
}
