"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { newId, unwrap } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { equipmentSchema, type EquipmentInput } from "@/lib/validations/settings";

export async function saveEquipment(id: string | null, input: EquipmentInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = equipmentSchema.safeParse(input);
  if (!parsed.success) return fail("Thông tin thiết bị chưa hợp lệ", parsed.error);

  const table = supabase().from("equipments");
  unwrap(
    id ? await table.update(parsed.data).eq("id", id) : await table.insert({ ...parsed.data, id: newId("eq") }),
    "equipments",
  );

  revalidatePath("/", "layout");
  return ok(undefined);
}

export async function deleteEquipment(id: string): Promise<ActionResult> {
  await requireAdmin();
  unwrap(await supabase().from("equipments").delete().eq("id", id), "equipments");
  revalidatePath("/", "layout");
  return ok(undefined);
}
