"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { newId, projectToRow, unwrap } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import type { Project, PublishStatus } from "@/lib/types";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";

const refresh = () => revalidatePath("/", "layout");

export async function saveProject(id: string | null, input: ProjectInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return fail("Vui lòng kiểm tra lại các trường bị lỗi", parsed.error);

  const { render, real, client, gallery, ...rest } = parsed.data;
  const dup = unwrap(
    await supabase().from("projects").select("id").eq("slug", rest.slug).neq("id", id ?? "").limit(1),
    "projects",
  );
  if (dup.length) {
    return { ok: false, error: "Slug đã tồn tại", fieldErrors: { slug: ["Slug đã được dùng"] } };
  }

  const fields: Omit<Project, "id" | "createdAt"> = {
    ...rest,
    client: client || undefined,
    gallery: gallery.length ? gallery : [rest.cover],
    beforeAfter: render && real ? { render, real } : undefined,
  };

  const table = supabase().from("projects");
  unwrap(
    id
      ? await table.update(projectToRow(fields)).eq("id", id)
      : await table.insert(projectToRow({ ...fields, id: newId("prj"), createdAt: new Date().toISOString() })),
    "projects",
  );

  refresh();
  return ok(undefined);
}

export async function setProjectStatus(id: string, status: PublishStatus): Promise<ActionResult> {
  await requireAdmin();
  const rows = unwrap(await supabase().from("projects").update({ status }).eq("id", id).select("id"), "projects");
  if (!rows.length) return fail("Không tìm thấy dự án");
  refresh();
  return ok(undefined);
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  unwrap(await supabase().from("projects").delete().eq("id", id), "projects");
  refresh();
  return ok(undefined);
}
