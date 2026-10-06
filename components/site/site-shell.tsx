import { FloatingContact } from "@/components/site/floating-contact";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getHotlines } from "@/lib/phone";
import type { SiteSettings } from "@/lib/types";

/** Khung chung cho trang công khai — luôn hiển thị theme sáng thương hiệu. */
export function SiteShell({
  settings,
  children,
  solidHeader,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
  solidHeader?: boolean;
}) {
  const hotlines = getHotlines(settings);
  return (
    <div className="theme-light overflow-x-clip bg-background text-foreground">
      <SiteHeader hotlines={hotlines} solid={solidHeader} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <FloatingContact hotlines={hotlines} zalo={settings.zalo} />
    </div>
  );
}
