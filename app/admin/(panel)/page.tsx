import { ArrowUpRight, Download, FileText, FolderKanban, Inbox, PenSquare, Plus } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/admin/page-header";
import { LeadStatusBadge, PublishBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { leadProjectTypeLabels, projectCategoryLabels } from "@/lib/data";
import { adminName } from "@/lib/auth";
import { getLeadStats, getLeads, getPosts, getProfileDownloads, getProjects } from "@/lib/store";
import type { ProjectCategory } from "@/lib/types";

export const metadata = { title: "Tổng quan" };

const greeting = () => {
  const hour = Number(new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Ho_Chi_Minh" }));
  return hour < 11 ? "Chào buổi sáng" : hour < 14 ? "Chào buổi trưa" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";
};

export default async function DashboardPage() {
  const [projects, posts, leads, profileDownloads] = await Promise.all([
    getProjects(),
    getPosts(),
    getLeads(),
    getProfileDownloads(),
  ]);
  const { new: newLeads, thisWeek: leadsThisWeek, conversion } = getLeadStats(leads);
  const publishedProjects = projects.filter((p) => p.status === "published").length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;

  const metricsCards = [
    { label: "Tổng dự án", value: projects.length, note: `${publishedProjects} đang hiển thị · ${projects.length - publishedProjects} nháp`, icon: FolderKanban, href: "/admin/projects" },
    { label: "Bài viết", value: posts.length, note: `${publishedPosts} đã xuất bản · ${posts.length - publishedPosts} nháp`, icon: FileText, href: "/admin/posts" },
    { label: "Lượt tải Profile PDF", value: profileDownloads, note: "Tổng lượt tải từ website", icon: Download, href: "/admin/settings" },
    { label: "Khách hàng mới", value: newLeads, note: `${leadsThisWeek} yêu cầu trong 7 ngày · chốt ${conversion}%`, icon: Inbox, href: "/admin/leads", highlight: newLeads > 0 },
  ];

  const byCategory = (Object.keys(projectCategoryLabels) as ProjectCategory[]).map((c) => ({
    key: c,
    label: projectCategoryLabels[c],
    count: projects.filter((p) => p.category === c).length,
  }));
  const maxCount = Math.max(...byCategory.map((c) => c.count), 1);
  const totalArea = projects.reduce((sum, p) => sum + p.area, 0);

  const recentPosts = posts.slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" })}
        title={`${greeting()}, ${adminName()}`}
        description="Tổng quan nội dung website và khách hàng tiềm năng của Anyhome."
        actions={
          <>
            <Button variant="outline" nativeButton={false} render={<Link href="/admin/projects?new=1" />}>
              <Plus /> Thêm dự án
            </Button>
            <Button nativeButton={false} render={<Link href="/admin/posts/new" />}>
              <PenSquare /> Viết bài mới
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricsCards.map((m) => (
          <Link key={m.label} href={m.href} className="group">
            <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-1 group-hover:ring-gold-300/60">
              <CardHeader>
                <CardDescription>{m.label}</CardDescription>
                <CardAction>
                  <span className={m.highlight ? "grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground" : "grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground"}>
                    <m.icon className="size-4.5" />
                  </span>
                </CardAction>
                <CardTitle className="text-3xl font-bold tabular-nums">{m.value.toLocaleString("vi-VN")}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">{m.note}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu báo giá gần đây</CardTitle>
            <CardDescription>Khách hàng đăng ký tư vấn từ form website</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/admin/leads" />}>
                Xem tất cả <ArrowUpRight />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {leads.slice(0, 6).map((l) => (
                <li key={l.id} className="flex items-center gap-4 py-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold">
                    {l.name.split(" ").pop()?.[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{l.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {leadProjectTypeLabels[l.projectType]}
                      {l.budget && ` · ${l.budget}`} · {new Date(l.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <LeadStatusBadge status={l.status} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cơ cấu dự án</CardTitle>
              <CardDescription>Tổng {totalArea.toLocaleString("vi-VN")} m² sàn trong danh mục</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {byCategory.map((c) => (
                <div key={c.key}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{c.label}</span>
                    <span className="font-semibold tabular-nums">{c.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(c.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bài viết mới cập nhật</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/admin/posts" />}>
                  Tất cả <ArrowUpRight />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentPosts.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-3">
                    <Link href={`/admin/posts/${p.id}/edit`} className="line-clamp-2 text-sm font-medium hover:underline">
                      {p.title}
                    </Link>
                    <PublishBadge status={p.status} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
