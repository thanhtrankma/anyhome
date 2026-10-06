import { z } from "zod";

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Nội dung rỗng của Tiptap là "<p></p>" — loại bỏ thẻ để đếm chữ thật. */
const plainText = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const postSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(10, "Tiêu đề tối thiểu 10 ký tự")
      .max(160, "Tiêu đề tối đa 160 ký tự"),
    slug: z
      .string()
      .trim()
      .min(3, "Slug tối thiểu 3 ký tự")
      .max(120, "Slug tối đa 120 ký tự")
      .regex(SLUG_REGEX, "Chỉ dùng chữ thường không dấu, số và dấu gạch ngang"),
    excerpt: z
      .string()
      .trim()
      .min(30, "Mô tả ngắn tối thiểu 30 ký tự")
      .max(300, "Mô tả ngắn tối đa 300 ký tự"),
    category: z.enum(["news", "knowledge", "construction-log", "recruitment"], {
      error: "Vui lòng chọn chuyên mục",
    }),
    cover: z.string().min(1, "Vui lòng tải lên ảnh đại diện"),
    content: z
      .string()
      .refine((html) => plainText(html).length >= 50, "Nội dung bài viết tối thiểu 50 ký tự"),
    tags: z
      .array(z.string().trim().min(1).max(30))
      .max(8, "Tối đa 8 thẻ"),
    author: z.string().trim().min(2, "Vui lòng nhập tác giả").max(60),
    status: z.enum(["draft", "published"]),
  })
  .superRefine((data, ctx) => {
    if (data.status === "published" && data.tags.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["tags"],
        message: "Bài viết xuất bản cần ít nhất 1 thẻ (tốt cho SEO)",
      });
    }
  });

export type PostInput = z.infer<typeof postSchema>;

export const postDefaults: PostInput = {
  title: "",
  slug: "",
  excerpt: "",
  category: "news",
  cover: "",
  content: "",
  tags: [],
  author: "Anyhome",
  status: "draft",
};
