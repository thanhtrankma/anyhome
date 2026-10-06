# Anyhome — Website Hồ sơ năng lực & Content Studio

Website giới thiệu năng lực của **Công ty Cổ phần Tư vấn Công nghệ Xây dựng Anyhome** kèm trang quản trị nội dung `/admin`.
Nội dung gốc được trích từ [Company Profile](https://heyzine.com/flip-book/908b044467.html).

## Công nghệ

Next.js 16 (App Router, Server Components, Server Actions, `proxy.ts`) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui (style `base-nova`, chạy trên Base UI) · Framer Motion · Lucide · react-hook-form + Zod 4 ·
TanStack Table · Tiptap 3 · react-dropzone · yet-another-react-lightbox · Embla Carousel.

## Design System (ui-ux-pro-max)

Giao diện tuân theo skill [`ui-ux-pro-max`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
(cài tại `~/.claude/skills/ui-ux-pro-max`). Nguồn quy chuẩn: [`design-system/anyhome/MASTER.md`](design-system/anyhome/MASTER.md)
— mục **Anyhome Brand Adaptation** ở đầu file ghi đè đề xuất mặc định của skill (màu thương hiệu navy/vàng,
font Be Vietnam Pro vì Cinzel không hỗ trợ tiếng Việt) và quy tắc tối ưu mobile.

## Chạy dự án

```bash
npm install
cp .env.example .env.local   # điền key Supabase + ADMIN_USER / ADMIN_PASSWORD
npm run dev
```

- Website: `http://localhost:3000`
- Quản trị: `http://localhost:3000/admin` → đăng nhập tại `/admin/login`

Khi **chưa** đặt `ADMIN_USER`/`ADMIN_PASSWORD`: `/admin` mở tự do ở môi trường dev, và **bị khoá hoàn toàn** ở production.

Phiên đăng nhập là cookie httpOnly ký HMAC (`lib/auth.ts`), hết hạn sau 12 giờ hoặc 30 ngày nếu chọn "Ghi nhớ".
Khoá ký lấy từ `AUTH_SECRET` (tuỳ chọn); đổi `ADMIN_PASSWORD` sẽ đăng xuất mọi phiên cũ. Sai mật khẩu 5 lần/15 phút sẽ bị chặn tạm.

## Cấu trúc chính

```
app/
  page.tsx                 Trang chủ (Hero → Về Anyhome → Năng lực → Dự án → Đối tác → Tin tức → Liên hệ)
  tin-tuc/[slug]/          Trang bài viết
  api/profile/             Tải Profile PDF + đếm lượt tải
  uploads/[file]/          Phục vụ ảnh đã upload
  admin/                   Layout (sidebar + header), Dashboard, projects, posts(/new, /[id]/edit),
                           equipments, leads (+ /export CSV), settings
components/
  sections/                Hero, About, OrgChart, Certificates, Capacity, Projects, Partners, News, Contact
  site/                    Header, Footer, FloatingContact (Gọi/Zalo ghim di động), motion helpers, Logo
  admin/                   DataTable, RichTextEditor (Tiptap), ImageDropzone, PostForm, ProjectForm, …
  ui/before-after-slider.tsx   Thanh trượt so sánh 3D vs Thực tế (chuột, cảm ứng, bàn phím)
  ui/lightbox-gallery.tsx      Xem ảnh high-res (zoom, vuốt)
lib/
  data.ts                  Dữ liệu gốc từ profile (seed)
  supabase.ts              Client Supabase (secret key, server-only)
  store.ts                 Truy vấn Supabase + map dữ liệu
  actions/                 Server Actions (CRUD, upload, settings) — đều kiểm tra quyền admin
  validations/             Schema Zod (post, project, lead, settings)
proxy.ts                   Chuyển /admin về trang đăng nhập khi chưa có phiên hợp lệ
```

## Lưu trữ dữ liệu (Supabase)

- **Database**: Supabase Postgres. Schema ở `supabase/schema.sql`, dữ liệu gốc ở `supabase/seed.sql`
  (sinh từ `lib/data.ts` bằng `npm run db:seed-sql`). Chạy lần lượt 2 file trong Supabase → SQL Editor.
  Database đã tạo từ trước khi có mục "Giao diện & cài đặt" thì chạy thêm `supabase/002_site_content.sql`.
- **Giao diện & cài đặt** (`/admin/settings/<nhóm>`): nội dung website (thông tin chung & SEO, menu, banner,
  Về Anyhome, Năng lực, tiêu đề các khối, đối tác, chứng chỉ, footer) lưu dạng JSONB trong bảng `site_content`.
  Cấu hình form ở `lib/content-schema.ts`, mặc định ở `lib/content.ts` — thêm trường vào đó là form tự hiện.
- **Ảnh upload**: bucket public `uploads`. **Profile PDF**: bucket private `documents`.
- Server truy cập bằng `SUPABASE_SECRET_KEY` (`lib/supabase.ts`, chỉ chạy phía server). Các bảng bật RLS
  và không có policy, nên publishable key không đọc/ghi được dữ liệu.
- `lib/store.ts` là lớp truy vấn + map snake_case ↔ camelCase; Server Actions ghi thẳng qua client Supabase.

## Dữ liệu cần thay trước khi go-live

Các mục đánh dấu `// MẪU` trong `lib/data.ts`:

- **Ảnh**: toàn bộ ảnh công trình/thiết bị đang là ảnh minh hoạ Unsplash; ảnh chứng chỉ là SVG giả lập (`public/certificates/`).
- **Ảnh 3D Render vs Thực tế**: dữ liệu mẫu dùng chung 1 ảnh và mô phỏng "bản render" bằng filter — upload cặp ảnh thật trong `/admin/projects`.
- **Số liệu**: tổng m² thi công, quy mô/năm hoàn thành từng dự án, danh mục thiết bị — profile gốc không công bố.
- **Logo đối tác**: đang hiển thị dạng wordmark chữ.
