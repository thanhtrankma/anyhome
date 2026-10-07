"use client";

import { ChevronDown, ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";

import { ADMIN_NAV, activeNavHref, initials } from "@/components/admin/nav";
import { LogoImage, LogoMark } from "@/components/site/logo";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function SidebarNav({
  newLeads,
  userName,
  logo,
  onNavigate,
}: {
  newLeads: number;
  userName: string;
  logo?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeHref = activeNavHref(pathname);
  const [pending, startTransition] = useTransition();
  // Nhóm người dùng tự mở/đóng; nhóm chưa đụng tới chỉ mở khi chứa trang hiện tại
  const [manual, setManual] = useState<Record<string, boolean>>({});

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link href="/admin" onClick={onNavigate} className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
        {logo ? (
          <span className="min-w-0 leading-tight">
            <LogoImage src={logo} alt="Trang quản trị" className="h-8 max-w-40" />
            <span className="mt-1 block text-[10px] tracking-widest text-sidebar-primary uppercase">Content Studio</span>
          </span>
        ) : (
          <>
            <LogoMark className="size-8 text-white" />
            <span className="leading-tight">
              <span className="block text-sm font-extrabold tracking-[0.18em] text-white">ANYHOME</span>
              <span className="block text-[10px] tracking-widest text-sidebar-primary uppercase">Content Studio</span>
            </span>
          </>
        )}
      </Link>

      <nav aria-label="Quản trị" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {ADMIN_NAV.map((group) => {
          const hasActive = group.items.some((i) => i.href === activeHref);
          const open = !group.collapsible || (manual[group.label] ?? hasActive);
          const listId = `nav-${group.label}`;
          return (
            <div key={group.label}>
              {group.collapsible ? (
                <button
                  type="button"
                  onClick={() => setManual((m) => ({ ...m, [group.label]: !open }))}
                  aria-expanded={open}
                  aria-controls={listId}
                  className={cn(
                    "mb-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200",
                    hasActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  {group.icon && <group.icon className={cn("size-4.5", hasActive ? "text-sidebar-primary" : "text-sidebar-foreground/55")} />}
                  <span className="flex-1">{group.label}</span>
                  {!open && hasActive && <span className="size-1.5 rounded-full bg-sidebar-primary" aria-hidden />}
                  <ChevronDown className={cn("size-4 text-sidebar-foreground/45 transition-transform duration-200", open && "rotate-180")} />
                </button>
              ) : (
                <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.2em] text-sidebar-foreground/45 uppercase">{group.label}</p>
              )}
              <ul
                id={listId}
                hidden={!open}
                className={cn("space-y-0.5", group.collapsible && "ml-5 border-l border-sidebar-border pl-2")}
              >
                {group.items.map((item) => {
                  const active = item.href === activeHref;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-200",
                          item.icon ? "py-2.5 font-medium" : "py-2",
                          active
                            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        {active && item.icon && <span className="absolute inset-y-2 left-0 w-0.75 rounded-full bg-sidebar-primary" />}
                        {item.icon && (
                          <item.icon
                            className={cn(
                              "size-4.5 transition-colors",
                              active ? "text-sidebar-primary" : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground/80",
                            )}
                          />
                        )}
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
            </div>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <ExternalLink className="size-4" /> Xem website
        </Link>
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            {initials(userName)}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold text-white">{userName}</span>
            <span className="block text-xs text-sidebar-foreground/55">Quản trị viên</span>
          </span>
          <button
            type="button"
            onClick={() => startTransition(() => logout())}
            disabled={pending}
            aria-label="Đăng xuất"
            title="Đăng xuất"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none disabled:opacity-50"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
