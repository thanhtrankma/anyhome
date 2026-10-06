import { notFound } from "next/navigation";

import { ContentForm } from "@/components/admin/content-form";
import { PageHeader } from "@/components/admin/page-header";
import { getContentGroup } from "@/lib/content";
import { getSiteContent } from "@/lib/store";

export async function generateMetadata({ params }: PageProps<"/admin/settings/[group]">) {
  return { title: getContentGroup((await params).group)?.label ?? "Giao diện & cài đặt" };
}

export default async function ContentSettingsPage({ params }: PageProps<"/admin/settings/[group]">) {
  const group = getContentGroup((await params).group);
  if (!group) notFound();
  const content = await getSiteContent();

  return (
    <>
      <PageHeader eyebrow="Giao diện & cài đặt" title={group.label} description={group.description} />
      <ContentForm key={group.key} group={group} initial={content[group.key] as unknown as Record<string, unknown>} />
    </>
  );
}
