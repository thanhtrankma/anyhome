"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { db, newId, persist } from "@/lib/store";
import type { LeadStatus } from "@/lib/types";
import { leadSchema, type LeadFormValues } from "@/lib/validations/lead";

export async function submitLead(values: LeadFormValues): Promise<ActionResult> {
  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) return fail("Thông tin chưa hợp lệ", parsed.error);

  // `website` là honeypot — đã được schema kiểm tra rỗng, không lưu lại
  const { name, phone, projectType, email, area, budget, message } = parsed.data;
  db().leads.unshift({
    name,
    phone,
    projectType,
    id: newId("lead"),
    email: email || undefined,
    area: area || undefined,
    budget: budget || undefined,
    message: message || undefined,
    status: "new",
    createdAt: new Date().toISOString(),
  });
  persist();
  revalidatePath("/admin", "layout");
  return ok(undefined);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<ActionResult> {
  await requireAdmin();
  const lead = db().leads.find((l) => l.id === id);
  if (!lead) return fail("Không tìm thấy khách hàng");
  lead.status = status;
  persist();
  revalidatePath("/admin", "layout");
  return ok(undefined);
}

export async function deleteLead(id: string): Promise<ActionResult> {
  await requireAdmin();
  const store = db();
  store.leads = store.leads.filter((l) => l.id !== id);
  persist();
  revalidatePath("/admin", "layout");
  return ok(undefined);
}
