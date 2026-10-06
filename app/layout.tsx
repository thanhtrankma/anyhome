import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { company } from "@/lib/data";

import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.anyhome.com.vn"),
  title: {
    default: `${company.brand} – ${company.slogan}`,
    template: `%s | ${company.brand}`,
  },
  description:
    "Anyhome – Tổng thầu Design & Build: thiết kế kiến trúc, nội thất, sản xuất nội thất và thi công xây dựng trọn gói nhà ở cao cấp, biệt thự, nhà xưởng công nghiệp.",
  keywords: ["Anyhome", "thiết kế kiến trúc", "thi công xây dựng", "nội thất", "biệt thự", "nhà xưởng", "Design & Build"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: company.brand,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],
  },
};

export const viewport: Viewport = {
  themeColor: "#151a2e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnam.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-dvh">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
