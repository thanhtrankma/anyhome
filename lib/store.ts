import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  defaultSettings,
  equipments as seedEquipments,
  leads as seedLeads,
  posts as seedPosts,
  projects as seedProjects,
} from "@/lib/data";
import type { Equipment, Lead, Post, Project, SiteSettings } from "@/lib/types";

/**
 * Kho dữ liệu tạm thời dạng JSON (.data/db.json) để demo đầy đủ luồng
 * CRUD mà không cần database. Thay module này bằng Prisma/Drizzle khi
 * triển khai thật — các Server Actions chỉ phụ thuộc vào API bên dưới.
 */
export interface Database {
  projects: Project[];
  posts: Post[];
  equipments: Equipment[];
  leads: Lead[];
  settings: SiteSettings;
  metrics: { profileDownloads: number };
}

export const DATA_DIR = path.join(process.cwd(), ".data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");
export const PROFILE_PDF_FILE = "profile.pdf";

// structuredClone: không để mutation làm bẩn dữ liệu gốc trong lib/data.ts
const seed = (): Database =>
  structuredClone({
    projects: seedProjects,
    posts: seedPosts,
    equipments: seedEquipments,
    leads: seedLeads,
    settings: defaultSettings,
    metrics: { profileDownloads: 1284 },
  });

function load(): Database {
  if (!existsSync(DB_FILE)) return seed();
  try {
    const base = seed();
    const saved = JSON.parse(readFileSync(DB_FILE, "utf8")) as Partial<Database>;
    // Gộp sâu settings để trường mới thêm sau (vd. hotline2) vẫn có giá trị mặc định
    return { ...base, ...saved, settings: { ...base.settings, ...saved.settings } };
  } catch {
    return seed();
  }
}

// Giữ một instance duy nhất qua các lần HMR ở môi trường dev
const globalForDb = globalThis as unknown as { __anyhomeDb?: Database };

export function db(): Database {
  globalForDb.__anyhomeDb ??= load();
  return globalForDb.__anyhomeDb;
}

export function persist() {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(db(), null, 2));
}

export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

/* ─────────── Truy vấn dùng chung cho Server Components ─────────── */

const byNewest = <T extends { createdAt: string }>(a: T, b: T) => b.createdAt.localeCompare(a.createdAt);

export const getPublishedProjects = () =>
  db().projects.filter((p) => p.status === "published").sort((a, b) => b.year - a.year);

export const getPublishedPosts = () =>
  db()
    .posts.filter((p) => p.status === "published")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

export const getLeads = () => [...db().leads].sort(byNewest);

export const getSettings = () => db().settings;

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getLeadStats() {
  const leads = db().leads;
  const since = Date.now() - WEEK_MS;
  return {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    thisWeek: leads.filter((l) => new Date(l.createdAt).getTime() > since).length,
    conversion: leads.length ? Math.round((leads.filter((l) => l.status === "closed").length / leads.length) * 100) : 0,
  };
}
