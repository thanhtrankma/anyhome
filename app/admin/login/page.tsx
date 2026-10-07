import { ArrowLeft, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";
import { Logo, LogoImage, LogoMark } from "@/components/site/logo";
import { isAuthConfigured } from "@/lib/auth";
import { photo } from "@/lib/data";
import { getSiteContent } from "@/lib/store";

export const metadata = { title: "Đăng nhập" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  const configured = isAuthConfigured();
  const { general } = await getSiteContent();
  const lightLogo = general.logoOnLight || general.logo;

  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[1.1fr_1fr]">
      {/* Panel thương hiệu — chỉ hiện từ lg */}
      <aside className="relative hidden overflow-hidden bg-navy-900 lg:block">
        <Image
          src={photo("09")}
          alt=""
          fill
          preload
          sizes="55vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-900/70 to-navy-900/30" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo src={general.logo} alt={general.brand} markClassName="h-14" />
          <div className="max-w-md">
            <p className="text-xs font-semibold tracking-[0.25em] text-gold-300 uppercase">Content Studio</p>
            <h2 className="mt-4 text-4xl leading-tight font-bold tracking-tight text-balance">
              Quản lý dự án, bài viết và khách hàng ở một nơi.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Cập nhật danh mục công trình, đăng tin tức và theo dõi yêu cầu báo giá từ website Anyhome.
            </p>
          </div>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Anyhome — Kiến tạo những công trình bền vững</p>
        </div>
      </aside>

      <main className="flex flex-col px-4 py-8 sm:px-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Về trang chủ
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          {lightLogo ? (
            <LogoImage src={lightLogo} alt={general.brand} className="h-20 lg:hidden" />
          ) : (
            <LogoMark className="size-12 text-navy-800 lg:hidden dark:text-white" />
          )}
          <h1 className="mt-6 text-3xl font-bold tracking-tight lg:mt-0">Đăng nhập quản trị</h1>
          <p className="mt-2 text-sm text-muted-foreground">Chào mừng trở lại. Nhập tài khoản để tiếp tục.</p>

          {!configured && (
            <p className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              Chưa đặt <code className="font-semibold">ADMIN_USER</code> / <code className="font-semibold">ADMIN_PASSWORD</code>{" "}
              trên máy chủ nên chưa thể đăng nhập.
            </p>
          )}

          <LoginForm next={typeof next === "string" ? next : undefined} />

          <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-gold-600" /> Phiên đăng nhập được mã hoá và tự hết hạn.
          </p>
        </div>
      </main>
    </div>
  );
}
