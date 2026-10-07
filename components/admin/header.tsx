"use client";

import { Bell, ExternalLink, LogOut, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState, useTransition } from "react";

import { SEGMENT_LABELS, initials } from "@/components/admin/nav";
import { SidebarNav } from "@/components/admin/sidebar";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { logout } from "@/lib/actions/auth";
import { leadProjectTypeLabels } from "@/lib/data";
import type { Lead } from "@/lib/types";

const timeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} phút trước`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.round(hours / 24)} ngày trước`;
};

export function AdminHeader({ newLeads, userName, logo }: { newLeads: Lead[]; userName: string; logo?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, startLogout] = useTransition();

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    href: "/" + segments.slice(0, i + 1).join("/"),
    label: SEGMENT_LABELS[seg] ?? "Chi tiết",
  }));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur-lg sm:gap-3 sm:px-6 lg:px-8">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Mở menu quản trị" />}>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="border-none p-0 data-[side=left]:w-72" showCloseButton={false}>
          <SheetTitle className="sr-only">Menu quản trị</SheetTitle>
          <SidebarNav newLeads={newLeads.length} userName={userName} logo={logo} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          {crumbs.map((c, i) => (
            <Fragment key={c.href}>
              {i > 0 && <BreadcrumbSeparator className={i < crumbs.length - 1 ? "hidden sm:block" : undefined} />}
              <BreadcrumbItem className={i < crumbs.length - 1 ? "hidden sm:inline-flex" : "truncate"}>
                {i === crumbs.length - 1 ? (
                  <BreadcrumbPage className="truncate font-semibold">{c.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={c.href} />}>{c.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" className="relative" aria-label={`Thông báo: ${newLeads.length} báo giá mới`} />}>
          <Bell />
          {newLeads.length > 0 && (
            <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {newLeads.length}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between">
              Yêu cầu báo giá mới
              <span className="text-xs font-normal text-muted-foreground">{newLeads.length} chưa xử lý</span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {newLeads.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Không có yêu cầu mới 🎉</p>
          ) : (
            newLeads.slice(0, 5).map((lead) => (
              <DropdownMenuItem key={lead.id} render={<Link href="/admin/leads" />} className="flex-col items-start gap-0.5 py-2">
                <span className="flex w-full justify-between gap-2 text-sm font-medium">
                  <span className="truncate">{lead.name}</span>
                  <span className="shrink-0 text-xs font-normal text-muted-foreground">{timeAgo(lead.createdAt)}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {leadProjectTypeLabels[lead.projectType]} · {lead.phone}
                </span>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/admin/leads" />} className="justify-center font-medium text-primary">
            Xem tất cả
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 gap-2 rounded-full pr-1 pl-1 sm:pr-3" aria-label="Tài khoản" />}>
          <Avatar className="size-8">
            <AvatarFallback className="bg-navy-900 text-xs font-bold text-gold-300">{initials(userName)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-left text-xs leading-tight sm:block">
            <span className="block font-semibold">{userName}</span>
            <span className="block text-muted-foreground">Quản trị viên</span>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="leading-tight">
              <span className="block text-sm font-semibold text-foreground">{userName}</span>
              <span className="block text-xs font-normal text-muted-foreground">Quản trị viên</span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/admin/settings" />}>
            <Settings /> Giao diện & cài đặt
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/" target="_blank" />}>
            <ExternalLink /> Xem website
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" disabled={loggingOut} onClick={() => startLogout(() => logout())}>
            <LogOut /> Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
