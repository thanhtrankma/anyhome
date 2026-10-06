import { z } from "zod";

// Số di động/cố định Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx, cho phép khoảng trắng/dấu chấm
const VN_PHONE = /^(?:\+?84|0)(?:\d){9,10}$/;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s.-]/g, ""))
    .pipe(z.string().regex(VN_PHONE, "Số điện thoại không hợp lệ")),
  email: z.union([z.literal(""), z.email("Email không hợp lệ")]),
  projectType: z.enum(["residential", "industrial", "interior", "other"], {
    error: "Chọn loại công trình",
  }),
  area: z.string().trim().max(40),
  budget: z.string().max(40),
  message: z.string().trim().max(1000, "Tối đa 1000 ký tự"),
  // Honeypot chống spam: trường ẩn phải để trống
  website: z.string().max(0),
});

export type LeadFormValues = z.input<typeof leadSchema>;
export type LeadInput = z.output<typeof leadSchema>;

export const BUDGET_OPTIONS = ["Dưới 500 triệu", "500 tr – 1 tỷ", "1 – 3 tỷ", "3 – 5 tỷ", "5 – 20 tỷ", "Trên 20 tỷ"];
