import { EquipmentsManager } from "@/components/admin/equipments-manager";
import { PageHeader } from "@/components/admin/page-header";
import { getEquipments } from "@/lib/store";

export const metadata = { title: "Năng lực & Thiết bị" };

export default async function AdminEquipmentsPage() {
  const equipments = await getEquipments();
  return (
    <>
      <PageHeader title="Năng lực & Thiết bị" description={`${equipments.length} hạng mục máy móc, cốp pha và thiết bị kỹ thuật.`} />
      <EquipmentsManager equipments={equipments} />
    </>
  );
}
