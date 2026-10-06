# Anyhome — Website Hồ sơ năng lực & Content Studio

Website giới thiệu năng lực của **Công ty Cổ phần Tư vấn Công nghệ Xây dựng Anyhome** kèm trang quản trị nội dung `/admin`.
Nội dung gốc được trích từ [Company Profile](https://heyzine.com/flip-book/908b044467.html).

## Công nghệ

Next.js 16 (App Router, Server Components, Server Actions, `proxy.ts`) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui (style `base-nova`, chạy trên Base UI) · Framer Motion · Lucide · react-hook-form + Zod 4 ·
TanStack Table · Tiptap 3 · react-dropzone · yet-another-react-lightbox · Embla Carousel.

## Chạy dự án

```bash
npm install
cp .env.example .env.local   # đặt ADMIN_USER / ADMIN_PASSWORD
npm run dev
```

- Website: `http://localhost:3000`
- Quản trị: `http://localhost:3000/admin` (HTTP Basic Auth)

Khi **chưa** đặt `ADMIN_USER`/`ADMIN_PASSWORD`: `/admin` mở tự do ở môi trường dev, và **bị khoá hoàn toàn** ở production.

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
  store.ts                 Kho dữ liệu JSON tạm (.data/db.json)
  actions/                 Server Actions (CRUD, upload, settings) — đều kiểm tra quyền admin
  validations/             Schema Zod (post, project, lead, settings)
proxy.ts                   Chặn /admin bằng Basic Auth
```

## Lưu trữ dữ liệu

`lib/store.ts` lưu vào `.data/db.json` và ảnh vào `.data/uploads/` — đủ để demo đầy đủ luồng CRUD.
Xoá thư mục `.data/` để quay về dữ liệu gốc. Khi triển khai thật (Vercel/serverless có filesystem
chỉ đọc), thay module này bằng database (Postgres + Prisma/Drizzle) và object storage (S3/R2) —
các Server Action chỉ phụ thuộc vào API của `store.ts`.

## Dữ liệu cần thay trước khi go-live

Các mục đánh dấu `// MẪU` trong `lib/data.ts`:

- **Ảnh**: toàn bộ ảnh công trình/thiết bị đang là ảnh minh hoạ Unsplash; ảnh chứng chỉ là SVG giả lập (`public/certificates/`).
- **Ảnh 3D Render vs Thực tế**: dữ liệu mẫu dùng chung 1 ảnh và mô phỏng "bản render" bằng filter — upload cặp ảnh thật trong `/admin/projects`.
- **Số liệu**: tổng m² thi công, quy mô/năm hoàn thành từng dự án, danh mục thiết bị — profile gốc không công bố.
- **Logo đối tác**: đang hiển thị dạng wordmark chữ.
