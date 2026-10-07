import { FloatingContact } from "@/components/site/floating-contact";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getHotlines } from "@/lib/phone";
import type { SiteContent } from "@/lib/content";
import type { SiteSettings } from "@/lib/types";

/** Khung chung cho trang công khai — luôn hiển thị theme sáng thương hiệu. */
export function SiteShell({
  settings,
  content,
  children,
  solidHeader,
}: {
  settings: SiteSettings;
  content: SiteContent;
  children: React.ReactNode;
  solidHeader?: boolean;
}) {
  const hotlines = getHotlines(settings);
  return (
    <div className="theme-light overflow-x-clip bg-background text-foreground">
      <SiteHeader hotlines={hotlines} navItems={content.header.navItems} ctaLabel={content.header.ctaLabel} logo={content.general.logo} brand={content.general.brand} solid={solidHeader} />
      <main>{children}</main>
      <SiteFooter settings={settings} content={content} />
      <FloatingContact hotlines={hotlines} zalo={settings.zalo} />
    </div>
  );
}
