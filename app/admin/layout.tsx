import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s · Anyhome Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
