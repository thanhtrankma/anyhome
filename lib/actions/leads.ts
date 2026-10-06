"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { leadToRow, newId, unwrap } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import type { LeadStatus } from "@/lib/types";
import { leadSchema, type LeadFormValues } from "@/lib/validations/lead";

export async function submitLead(values: LeadFormValues): Promise<ActionResult> {
  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) return fail("Thông tin chưa hợp lệ", parsed.error);

  // `website` là honeypot — đã được schema kiểm tra rỗng, không lưu lại
  const { name, phone, projectType, email, area, budget, message } = parsed.data;
  const { error } = await supabase()
    .from("leads")
    .insert(
      leadToRow({
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
      }),
    );
  if (error) return fail("Không gửi được yêu cầu, vui lòng thử lại hoặc gọi hotline");
  revalidatePath("/admin", "layout");
  return ok(undefined);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<ActionResult> {
  await requireAdmin();
  const rows = unwrap(await supabase().from("leads").update({ status }).eq("id", id).select("id"), "leads");
  if (!rows.length) return fail("Không tìm thấy khách hàng");
  revalidatePath("/admin", "layout");
  return ok(undefined);
}

export async function deleteLead(id: string): Promise<ActionResult> {
  await requireAdmin();
  unwrap(await supabase().from("leads").delete().eq("id", id), "leads");
  revalidatePath("/admin", "layout");
  return ok(undefined);
}
