import "server-only";

import { mergeContent, type ContentKey, type SiteContent } from "@/lib/content";
import { defaultSettings } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Equipment, Lead, Post, Project, SiteSettings } from "@/lib/types";

/**
 * Lớp truy cập dữ liệu (Supabase Postgres — schema ở supabase/schema.sql).
 * Cột trong DB dùng snake_case; các hàm map bên dưới chuyển sang kiểu camelCase của lib/types.ts.
 */

type Row = Record<string, unknown>;

/** Ném lỗi kèm ngữ cảnh khi truy vấn Supabase thất bại. */
function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }, what: string): T {
  if (error) throw new Error(`Supabase (${what}): ${error.message}`);
  return data as T;
}

export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

/* ─────────────────────────── Mappers ─────────────────────────── */

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

const toProject = (r: Row): Project => ({
  id: r.id as string,
  slug: r.slug as string,
  title: r.title as string,
  category: r.category as Project["category"],
  location: r.location as string,
  scale: r.scale as string,
  area: r.area as number,
  year: r.year as number,
  client: (r.client as string | null) ?? undefined,
  scope: r.scope as string[],
  summary: r.summary as string,
  cover: r.cover as string,
  gallery: r.gallery as string[],
  beforeAfter: (r.before_after as Project["beforeAfter"] | null) ?? undefined,
  featured: r.featured as boolean,
  status: r.status as Project["status"],
  createdAt: iso(r.created_at)!,
});

export const projectToRow = (p: Partial<Project>): Row => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  category: p.category,
  location: p.location,
  scale: p.scale,
  area: p.area,
  year: p.year,
  client: p.client ?? null,
  scope: p.scope,
  summary: p.summary,
  cover: p.cover,
  gallery: p.gallery,
  before_after: p.beforeAfter ?? null,
  featured: p.featured,
  status: p.status,
  created_at: p.createdAt,
});

const toPost = (r: Row): Post => ({
  id: r.id as string,
  slug: r.slug as string,
  title: r.title as string,
  excerpt: r.excerpt as string,
  content: r.content as string,
  cover: r.cover as string,
  category: r.category as Post["category"],
  tags: r.tags as string[],
  author: r.author as string,
  status: r.status as Post["status"],
  publishedAt: iso(r.published_at),
  updatedAt: iso(r.updated_at)!,
});

export const postToRow = (p: Partial<Post>): Row => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  cover: p.cover,
  category: p.category,
  tags: p.tags,
  author: p.author,
  status: p.status,
  published_at: p.publishedAt,
  updated_at: p.updatedAt,
});

const toEquipment = (r: Row): Equipment => ({
  id: r.id as string,
  name: r.name as string,
  group: r.group as Equipment["group"],
  spec: r.spec as string,
  quantity: r.quantity as number,
  unit: r.unit as string,
  origin: r.origin as string,
  image: r.image as string,
});

const toLead = (r: Row): Lead => ({
  id: r.id as string,
  name: r.name as string,
  phone: r.phone as string,
  email: (r.email as string | null) ?? undefined,
  projectType: r.project_type as Lead["projectType"],
  area: (r.area as string | null) ?? undefined,
  budget: (r.budget as string | null) ?? undefined,
  message: (r.message as string | null) ?? undefined,
  status: r.status as Lead["status"],
  createdAt: iso(r.created_at)!,
});

export const leadToRow = (l: Lead): Row => ({
  id: l.id,
  name: l.name,
  phone: l.phone,
  email: l.email ?? null,
  project_type: l.projectType,
  area: l.area ?? null,
  budget: l.budget ?? null,
  message: l.message ?? null,
  status: l.status,
  created_at: l.createdAt,
});

const toSettings = (r: Row): SiteSettings => ({
  hotline: r.hotline as string,
  hotline2: r.hotline2 as string,
  zalo: r.zalo as string,
  email: r.email as string,
  website: r.website as string,
  hqAddress: r.hq_address as string,
  officeAddress: r.office_address as string,
  branchAddress: r.branch_address as string,
  mapQuery: r.map_query as string,
  stats: r.stats as SiteSettings["stats"],
  profilePdfUrl: r.profile_pdf_url as string,
  profilePdfFile: (r.profile_pdf_file as string | null) ?? null,
  profilePdfUpdatedAt: iso(r.profile_pdf_updated_at),
});

export const settingsToRow = (s: Partial<SiteSettings>): Row => {
  const map: Record<keyof SiteSettings, string> = {
    hotline: "hotline",
    hotline2: "hotline2",
    zalo: "zalo",
    email: "email",
    website: "website",
    hqAddress: "hq_address",
    officeAddress: "office_address",
    branchAddress: "branch_address",
    mapQuery: "map_query",
    stats: "stats",
    profilePdfUrl: "profile_pdf_url",
    profilePdfFile: "profile_pdf_file",
    profilePdfUpdatedAt: "profile_pdf_updated_at",
  };
  return Object.fromEntries(
    Object.entries(s).map(([k, v]) => [map[k as keyof SiteSettings], v]),
  );
};

/* ─────────────────────────── Truy vấn ─────────────────────────── */

export async function getProjects(): Promise<Project[]> {
  const res = await supabase().from("projects").select("*").order("created_at", { ascending: false });
  return unwrap(res, "projects").map(toProject);
}

export async function getPublishedProjects(): Promise<Project[]> {
  const res = await supabase()
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });
  return unwrap(res, "projects").map(toProject);
}

export async function getPosts(): Promise<Post[]> {
  const res = await supabase().from("posts").select("*").order("updated_at", { ascending: false });
  return unwrap(res, "posts").map(toPost);
}

export async function getPublishedPosts(): Promise<Post[]> {
  const res = await supabase()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return unwrap(res, "posts").map(toPost);
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const res = await supabase().from("posts").select("*").eq("status", "published").eq("slug", slug).maybeSingle();
  const row = unwrap(res, "posts");
  return row ? toPost(row) : null;
}

export async function getPostById(id: string): Promise<Post | null> {
  const res = await supabase().from("posts").select("*").eq("id", id).maybeSingle();
  const row = unwrap(res, "posts");
  return row ? toPost(row) : null;
}

export async function getEquipments(): Promise<Equipment[]> {
  const res = await supabase().from("equipments").select("*").order("created_at", { ascending: true });
  return unwrap(res, "equipments").map(toEquipment);
}

export async function getLeads(): Promise<Lead[]> {
  const res = await supabase().from("leads").select("*").order("created_at", { ascending: false });
  return unwrap(res, "leads").map(toLead);
}

async function getSettingsRow(): Promise<Row | null> {
  const res = await supabase().from("site_settings").select("*").eq("id", 1).maybeSingle();
  return unwrap(res, "site_settings");
}

/** Chưa chạy seed → dùng giá trị mặc định trong lib/data.ts để site vẫn hiển thị. */
export async function getSettings(): Promise<SiteSettings> {
  const row = await getSettingsRow();
  return row ? { ...defaultSettings, ...toSettings(row) } : defaultSettings;
}

export async function getProfileDownloads(): Promise<number> {
  return ((await getSettingsRow())?.profile_downloads as number | undefined) ?? 0;
}

export async function incrementProfileDownloads() {
  unwrap(await supabase().rpc("increment_profile_downloads"), "increment_profile_downloads");
}

export async function saveSettings(patch: Partial<SiteSettings>) {
  const res = await supabase()
    .from("site_settings")
    .upsert({ id: 1, ...settingsToRow(patch) });
  unwrap(res, "site_settings");
}

/** Nội dung "Giao diện & cài đặt". Chưa tạo bảng site_content → dùng mặc định để site vẫn chạy. */
export async function getSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase().from("site_content").select("key, data");
  if (error) {
    console.error(`Supabase (site_content): ${error.message}`);
    return mergeContent({});
  }
  return mergeContent(Object.fromEntries((data ?? []).map((r) => [r.key, r.data])));
}

export async function saveSiteContent(key: ContentKey, data: Record<string, unknown>) {
  unwrap(
    await supabase().from("site_content").upsert({ key, data, updated_at: new Date().toISOString() }),
    "site_content",
  );
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getLeadStats(leads: Lead[]) {
  const since = Date.now() - WEEK_MS;
  return {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    thisWeek: leads.filter((l) => new Date(l.createdAt).getTime() > since).length,
    conversion: leads.length ? Math.round((leads.filter((l) => l.status === "closed").length / leads.length) * 100) : 0,
  };
}

export { unwrap };
