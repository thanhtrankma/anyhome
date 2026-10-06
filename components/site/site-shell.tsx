import { FloatingContact } from "@/components/site/floating-contact";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
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
  return (
    <div className="theme-light overflow-x-clip bg-background text-foreground">
      <SiteHeader hotline={settings.hotline} solid={solidHeader} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <FloatingContact hotline={settings.hotline} zalo={settings.zalo} />
    </div>
  );
}
