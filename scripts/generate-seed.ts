/**
 * Sinh supabase/seed.sql từ dữ liệu gốc trong lib/data.ts.
 *   node --experimental-strip-types scripts/generate-seed.ts
 */
import { writeFileSync } from "node:fs";

import { defaultSettings, equipments, leads, posts, projects } from "../lib/data.ts";

const lit = (v: unknown): string => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
};
const arr = (xs: string[]) => (xs.length ? `array[${xs.map(lit).join(", ")}]::text[]` : "'{}'::text[]");
const json = (v: unknown) => (v === undefined || v === null ? "null" : `${lit(JSON.stringify(v))}::jsonb`);

function insert(table: string, cols: string[], rows: string[][]) {
  if (!rows.length) return "";
  const updates = cols.filter((c) => c !== "id").map((c) => `${c} = excluded.${c}`);
  return [
    `insert into public.${table} (${cols.join(", ")}) values`,
    rows.map((r) => `  (${r.join(", ")})`).join(",\n"),
    `on conflict (id) do update set ${updates.join(", ")};`,
    "",
  ].join("\n");
}

const base = Date.UTC(2024, 0, 1);

const sql = [
  "-- Dữ liệu gốc Anyhome — sinh tự động bởi scripts/generate-seed.ts, đừng sửa tay.",
  "-- Chạy SAU supabase/schema.sql. Chạy lại sẽ ghi đè các bản ghi mẫu (theo id).",
  "",
  "begin;",
  "",
  insert(
    "projects",
    ["id", "slug", "title", "category", "location", "scale", "area", "year", "client", "scope", "summary", "cover", "gallery", "before_after", "featured", "status", "created_at"],
    projects.map((p) => [
      lit(p.id), lit(p.slug), lit(p.title), lit(p.category), lit(p.location), lit(p.scale), lit(p.area), lit(p.year),
      lit(p.client), arr(p.scope), lit(p.summary), lit(p.cover), arr(p.gallery), json(p.beforeAfter), lit(p.featured),
      lit(p.status), lit(p.createdAt),
    ]),
  ),
  insert(
    "posts",
    ["id", "slug", "title", "excerpt", "content", "cover", "category", "tags", "author", "status", "published_at", "updated_at"],
    posts.map((p) => [
      lit(p.id), lit(p.slug), lit(p.title), lit(p.excerpt), lit(p.content), lit(p.cover), lit(p.category), arr(p.tags),
      lit(p.author), lit(p.status), lit(p.publishedAt), lit(p.updatedAt),
    ]),
  ),
  insert(
    "equipments",
    ["id", "name", '"group"', "spec", "quantity", "unit", "origin", "image", "created_at"],
    equipments.map((e, i) => [
      lit(e.id), lit(e.name), lit(e.group), lit(e.spec), lit(e.quantity), lit(e.unit), lit(e.origin), lit(e.image),
      lit(new Date(base + i * 1000).toISOString()),
    ]),
  ),
  insert(
    "leads",
    ["id", "name", "phone", "email", "project_type", "area", "budget", "message", "status", "created_at"],
    leads.map((l) => [
      lit(l.id), lit(l.name), lit(l.phone), lit(l.email), lit(l.projectType), lit(l.area), lit(l.budget), lit(l.message),
      lit(l.status), lit(l.createdAt),
    ]),
  ),
  // Cài đặt: chỉ tạo nếu chưa có, để chạy lại seed không xoá thay đổi từ /admin/settings
  [
    "insert into public.site_settings (id, hotline, hotline2, zalo, email, website, hq_address, office_address, branch_address, map_query, stats, profile_pdf_url, profile_downloads) values",
    `  (1, ${[
      defaultSettings.hotline, defaultSettings.hotline2, defaultSettings.zalo, defaultSettings.email, defaultSettings.website,
      defaultSettings.hqAddress, defaultSettings.officeAddress, defaultSettings.branchAddress, defaultSettings.mapQuery,
    ].map(lit).join(", ")}, ${json(defaultSettings.stats)}, ${lit(defaultSettings.profilePdfUrl)}, 1284)`,
    "on conflict (id) do nothing;",
    "",
  ].join("\n"),
  "commit;",
  "",
].join("\n");

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log(`seed.sql: ${projects.length} projects, ${posts.length} posts, ${equipments.length} equipments, ${leads.length} leads`);
