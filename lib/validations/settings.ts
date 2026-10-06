import { z } from "zod";

export const equipmentSchema = z.object({
  name: z.string().trim().min(3, "Nhập tên thiết bị").max(100),
  group: z.enum(["machinery", "formwork", "survey", "workshop"]),
  spec: z.string().trim().min(2, "Nhập thông số").max(120),
  quantity: z.number({ error: "Nhập số lượng" }).int().positive("Số lượng phải > 0"),
  unit: z.string().trim().min(1, "Nhập đơn vị").max(12),
  origin: z.string().trim().min(2, "Nhập xuất xứ").max(40),
  image: z.string().min(1, "Tải lên ảnh thiết bị"),
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;

export const settingsSchema = z.object({
  hotline: z.string().trim().min(8, "Hotline không hợp lệ"),
  zalo: z.string().trim().regex(/^\d{9,11}$/, "Chỉ nhập số điện thoại Zalo"),
  email: z.email("Email không hợp lệ"),
  officeAddress: z.string().trim().min(10),
  branchAddress: z.string().trim().min(10),
  mapQuery: z.string().trim().min(5),
  stats: z
    .array(
      z.object({
        label: z.string().trim().min(2),
        value: z.number().nonnegative(),
        suffix: z.string().max(4),
      }),
    )
    .length(4),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
