import { z } from "zod";

import { SLUG_REGEX } from "@/lib/validations/post";

const currentYear = new Date().getFullYear();

export const projectSchema = z
  .object({
    title: z.string().trim().min(5, "Tên dự án tối thiểu 5 ký tự").max(140),
    slug: z.string().trim().regex(SLUG_REGEX, "Slug không hợp lệ"),
    category: z.enum(["residential", "industrial", "interior"], { error: "Chọn loại công trình" }),
    location: z.string().trim().min(3, "Vui lòng nhập địa điểm").max(140),
    scale: z.string().trim().min(2, "Vui lòng nhập quy mô").max(80),
    area: z.number({ error: "Nhập diện tích (m²)" }).int().positive("Diện tích phải lớn hơn 0").max(1_000_000),
    year: z
      .number({ error: "Nhập năm hoàn thành" })
      .int()
      .min(2021, "Anyhome thành lập năm 2021")
      .max(currentYear + 3, `Không quá năm ${currentYear + 3}`),
    client: z.string().trim().max(120).optional(),
    scope: z.array(z.string()).min(1, "Chọn ít nhất 1 hạng mục"),
    summary: z.string().trim().min(20, "Mô tả tối thiểu 20 ký tự").max(500),
    cover: z.string().min(1, "Tải lên ảnh đại diện"),
    gallery: z.array(z.string()).max(24),
    render: z.string().optional(),
    real: z.string().optional(),
    featured: z.boolean(),
    status: z.enum(["draft", "published"]),
  })
  .refine((d) => !d.render === !d.real, {
    path: ["real"],
    message: "Cần đủ cả ảnh 3D và ảnh thực tế để tạo thanh so sánh",
  });

export type ProjectInput = z.infer<typeof projectSchema>;

export const PROJECT_SCOPES = ["Thiết kế", "Sản xuất", "Thi công", "Giám sát"] as const;
