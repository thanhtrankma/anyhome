export type PublishStatus = "draft" | "published";

export type ProjectCategory = "residential" | "industrial" | "interior";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  /** Mô tả quy mô hiển thị, ví dụ "3 tầng · 450 m²" */
  scale: string;
  /** Diện tích sàn (m²) — dùng để cộng dồn thống kê */
  area: number;
  year: number;
  client?: string;
  /** Phạm vi Anyhome thực hiện: Thiết kế, Thi công, Giám sát… */
  scope: string[];
  summary: string;
  cover: string;
  gallery: string[];
  /** Ảnh phối cảnh 3D và ảnh thực tế cho thanh trượt so sánh */
  beforeAfter?: { render: string; real: string };
  featured: boolean;
  status: PublishStatus;
  createdAt: string;
}

export type PostCategory = "news" | "knowledge" | "construction-log" | "recruitment";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** HTML sinh ra từ Tiptap */
  content: string;
  cover: string;
  category: PostCategory;
  tags: string[];
  author: string;
  status: PublishStatus;
  publishedAt: string | null;
  updatedAt: string;
}

export type EquipmentGroup = "machinery" | "formwork" | "survey" | "workshop";

export interface Equipment {
  id: string;
  name: string;
  group: EquipmentGroup;
  spec: string;
  quantity: number;
  unit: string;
  origin: string;
  image: string;
}

export type LeadStatus = "new" | "contacted" | "quoted" | "closed";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  projectType: ProjectCategory | "other";
  area?: string;
  budget?: string;
  message?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

export interface SiteSettings {
  hotline: string;
  /** Số hotline phụ — để trống nếu không dùng */
  hotline2: string;
  zalo: string;
  email: string;
  website: string;
  hqAddress: string;
  officeAddress: string;
  branchAddress: string;
  mapQuery: string;
  stats: Stat[];
  /** URL của Profile PDF khi chưa upload bản local */
  profilePdfUrl: string;
  /** Tên tệp PDF đã upload (lưu trong .data/) */
  profilePdfFile: string | null;
  profilePdfUpdatedAt: string | null;
}

export interface OrgNode {
  id: string;
  title: string;
  person?: string;
  children?: OrgNode[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  image: string;
}
