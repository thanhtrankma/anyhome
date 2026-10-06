"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/actions/guard";
import { db, newId, persist } from "@/lib/store";
import { equipmentSchema, type EquipmentInput } from "@/lib/validations/settings";

export async function saveEquipment(id: string | null, input: EquipmentInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = equipmentSchema.safeParse(input);
  if (!parsed.success) return fail("Thông tin thiết bị chưa hợp lệ", parsed.error);

  const store = db();
  const existing = id ? store.equipments.find((e) => e.id === id) : undefined;
  if (existing) Object.assign(existing, parsed.data);
  else store.equipments.push({ ...parsed.data, id: newId("eq") });

  persist();
  revalidatePath("/", "layout");
  return ok(undefined);
}

export async function deleteEquipment(id: string): Promise<ActionResult> {
  await requireAdmin();
  const store = db();
  store.equipments = store.equipments.filter((e) => e.id !== id);
  persist();
  revalidatePath("/", "layout");
  return ok(undefined);
}
