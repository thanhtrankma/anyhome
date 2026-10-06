import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSiteContent } from "@/lib/store";

import "./globals.css";

// ui-ux-pro-max · pairing "Vietnamese Friendly": Be Vietnam Pro được thiết kế riêng cho dấu tiếng Việt
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  // Tiêu đề, mô tả và ảnh chia sẻ chỉnh trong /admin/settings/general
  const { general } = await getSiteContent();
  return {
    metadataBase: new URL("https://www.anyhome.com.vn"),
    title: { default: general.seoTitle, template: `%s | ${general.brand}` },
    description: general.seoDescription,
    keywords: [general.brand, "thiết kế kiến trúc", "thi công xây dựng", "nội thất", "biệt thự", "nhà xưởng", "Design & Build"],
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: general.brand,
      images: general.ogImage ? [general.ogImage] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#151a2e",
  // Cho phép dùng env(safe-area-inset-*) để header/bottom bar không bị tai thỏ & home indicator che
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnam.variable} antialiased`}>
      <body className="min-h-dvh">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <MotionProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </MotionProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
