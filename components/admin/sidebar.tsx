"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAV } from "@/components/admin/nav";
import { LogoMark } from "@/components/site/logo";
import { cn } from "@/lib/utils";

export function SidebarNav({ newLeads, onNavigate }: { newLeads: number; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link href="/admin" onClick={onNavigate} className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <LogoMark className="size-8 text-white" />
        <span className="leading-tight">
          <span className="block text-sm font-extrabold tracking-[0.18em] text-white">ANYHOME</span>
          <span className="block text-[10px] tracking-widest text-sidebar-primary uppercase">Content Studio</span>
        </span>
      </Link>

      <nav aria-label="Quản trị" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.2em] text-sidebar-foreground/50 uppercase">Quản lý</p>
        <ul className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-sidebar-primary" />}
                  <item.icon className={cn("size-4.5", active ? "text-sidebar-primary" : "text-sidebar-foreground/60")} />
                  <span className="flex-1">{item.label}</span>
                  {item.href === "/admin/leads" && newLeads > 0 && (
                    <span className="rounded-full bg-sidebar-primary px-2 py-0.5 text-[10px] font-bold text-sidebar-primary-foreground tabular-nums">
                      {newLeads}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <ExternalLink className="size-4" /> Xem website
        </Link>
      </div>
    </div>
  );
}
