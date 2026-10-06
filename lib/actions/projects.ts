"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { db, newId, persist } from "@/lib/store";
import type { Project, PublishStatus } from "@/lib/types";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";

const refresh = () => revalidatePath("/", "layout");

export async function saveProject(id: string | null, input: ProjectInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return fail("Vui lòng kiểm tra lại các trường bị lỗi", parsed.error);

  const store = db();
  const { render, real, client, gallery, ...rest } = parsed.data;
  if (store.projects.some((p) => p.slug === rest.slug && p.id !== id)) {
    return { ok: false, error: "Slug đã tồn tại", fieldErrors: { slug: ["Slug đã được dùng"] } };
  }

  const fields: Omit<Project, "id" | "createdAt"> = {
    ...rest,
    client: client || undefined,
    gallery: gallery.length ? gallery : [rest.cover],
    beforeAfter: render && real ? { render, real } : undefined,
  };

  const existing = id ? store.projects.find((p) => p.id === id) : undefined;
  if (existing) Object.assign(existing, fields);
  else store.projects.unshift({ ...fields, id: newId("prj"), createdAt: new Date().toISOString() });

  persist();
  refresh();
  return ok(undefined);
}

export async function setProjectStatus(id: string, status: PublishStatus): Promise<ActionResult> {
  await requireAdmin();
  const project = db().projects.find((p) => p.id === id);
  if (!project) return fail("Không tìm thấy dự án");
  project.status = status;
  persist();
  refresh();
  return ok(undefined);
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  const store = db();
  store.projects = store.projects.filter((p) => p.id !== id);
  persist();
  refresh();
  return ok(undefined);
}
