/**
 * Kiểu dữ liệu + cấu hình form của "Giao diện & cài đặt" (/admin/settings/<nhóm>).
 * File này không import dữ liệu gốc để form admin (client) dùng được mà không kéo theo lib/data.ts.
 * Giá trị mặc định: lib/content.ts. Lưu trữ: bảng `site_content` (supabase/schema.sql).
 *
 * Thêm trường mới: thêm vào type + `fields` của nhóm ở đây và default ở lib/content.ts — form admin tự hiện.
 */

/* ─────────────────────────── Kiểu dữ liệu ─────────────────────────── */

export type ValueIcon = "users" | "lightbulb" | "ruler" | "handshake" | "leaf";
export type ServiceIcon = "drafting" | "sofa" | "hardhat" | "clipboard";

export interface SiteContent {
  general: {
    brand: string;
    legalName: string;
    shortName: string;
    internationalName: string;
    taxCode: string;
    representative: string;
    representativeRole: string;
    founded: number;
    staff: number;
    slogan: string;
    tagline: string;
    seoTitle: string;
    seoDescription: string;
    ogImage: string;
    favicon: string;
    logo: string;
    logoOnLight: string;
    facebookUrl: string;
    youtubeUrl: string;
    tiktokUrl: string;
  };
  header: {
    navItems: { label: string; href: string }[];
    ctaLabel: string;
  };
  hero: {
    slides: { image: string; eyebrow: string; title: string; caption: string }[];
    videoUrl: string;
  };
  about: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    intro: string;
    image: string;
    foundedCaption: string;
    letter: string;
    vision: string;
    mission: string;
    coreValues: { title: string; icon: ValueIcon }[];
    milestonesTitle: string;
    milestones: { period: string; title: string; items: string[] }[];
    teamTitle: string;
    teamDescription: string;
    leadership: { name: string; role: string }[];
  };
  capacity: {
    eyebrow: string;
    title: string;
    description: string;
    services: { title: string; icon: ServiceIcon; items: string[] }[];
    image: string;
    quote: string;
    deliveryCapabilities: string[];
    workflowTitle: string;
    workflowSubtitle: string;
    workflow: { step: string; title: string; desc: string }[];
    equipmentTitle: string;
  };
  sections: {
    projectsEyebrow: string;
    projectsTitle: string;
    projectsDescription: string;
    partnersEyebrow: string;
    partnersTitle: string;
    partnersDescription: string;
    newsEyebrow: string;
    newsTitle: string;
    contactEyebrow: string;
    contactTitle: string;
    contactDescription: string;
  };
  partners: { items: { name: string; sector: string; logo: string }[] };
  certificates: {
    title: string;
    description: string;
    items: { title: string; issuer: string; image: string }[];
  };
  footer: {
    exploreTitle: string;
    contactTitle: string;
    closing: string;
  };
}

export type ContentKey = keyof SiteContent;

/* ─────────────────────────── Cấu hình form ─────────────────────────── */

export type ContentFieldType = "text" | "textarea" | "number" | "image" | "url" | "select" | "lines" | "list";

export interface ContentField {
  name: string;
  label: string;
  type: ContentFieldType;
  help?: string;
  placeholder?: string;
  /** "half" xếp 2 trường cạnh nhau */
  width?: "half";
  options?: { value: string; label: string }[];
  /** Với `list`: cấu trúc mỗi phần tử + trường dùng làm tiêu đề thẻ */
  fields?: ContentField[];
  itemLabel?: string;
  maxItems?: number;
}

export interface ContentSection {
  title: string;
  description?: string;
  fields: ContentField[];
}

export interface ContentGroup {
  key: ContentKey;
  label: string;
  description: string;
  /** Mục trên website để mở xem nhanh */
  previewHref: string;
  sections: ContentSection[];
}

const VALUE_ICONS = [
  { value: "users", label: "Con người" },
  { value: "lightbulb", label: "Bóng đèn (đổi mới)" },
  { value: "ruler", label: "Thước (chuẩn mực)" },
  { value: "handshake", label: "Bắt tay (tận tâm)" },
  { value: "leaf", label: "Lá cây (bền vững)" },
];

const SERVICE_ICONS = [
  { value: "drafting", label: "Compa (thiết kế)" },
  { value: "sofa", label: "Sofa (nội thất)" },
  { value: "hardhat", label: "Mũ bảo hộ (thi công)" },
  { value: "clipboard", label: "Bảng kiểm (giám sát)" },
];

export const contentGroups: ContentGroup[] = [
  {
    key: "general",
    label: "Thông tin chung & SEO",
    description: "Tên công ty, pháp lý, slogan, mạng xã hội và SEO mặc định của website.",
    previewHref: "/",
    sections: [
      {
        title: "Doanh nghiệp",
        fields: [
          { name: "brand", label: "Tên thương hiệu", type: "text", width: "half" },
          { name: "shortName", label: "Tên viết tắt", type: "text", width: "half" },
          { name: "legalName", label: "Tên pháp lý", type: "text" },
          { name: "internationalName", label: "Tên quốc tế", type: "text" },
          { name: "taxCode", label: "Mã số thuế", type: "text", width: "half" },
          { name: "founded", label: "Năm thành lập", type: "number", width: "half" },
          { name: "representative", label: "Người đại diện", type: "text", width: "half" },
          { name: "representativeRole", label: "Chức vụ người đại diện", type: "text", width: "half" },
          { name: "staff", label: "Số nhân sự", type: "number", width: "half" },
        ],
      },
      {
        title: "Thông điệp",
        fields: [
          { name: "slogan", label: "Slogan", type: "text" },
          { name: "tagline", label: "Câu giới thiệu ngắn (footer)", type: "textarea" },
        ],
      },
      {
        title: "SEO & chia sẻ",
        description: "Hiển thị trên Google và khi chia sẻ link lên Facebook, Zalo.",
        fields: [
          { name: "seoTitle", label: "Tiêu đề trang chủ (SEO title)", type: "text", help: "Nên dưới 60 ký tự" },
          { name: "seoDescription", label: "Mô tả (SEO description)", type: "textarea", help: "Nên 120–160 ký tự" },
          { name: "ogImage", label: "Ảnh chia sẻ mạng xã hội (OG image)", type: "image", help: "Tỉ lệ 1200 × 630" },
        ],
      },
      {
        title: "Logo",
        description: "Để trống sẽ dùng logo chữ A mặc định. Nên dùng PNG/WebP nền trong suốt, chiều cao tối thiểu 96 px.",
        fields: [
          {
            name: "logo",
            label: "Logo trên nền tối",
            type: "image",
            help: "Dùng ở header, footer, menu điện thoại, trang đăng nhập và khung quản trị (nền xanh navy) — nên là logo chữ sáng màu.",
          },
          {
            name: "logoOnLight",
            label: "Logo trên nền sáng (tuỳ chọn)",
            type: "image",
            help: "Dùng ở trang đăng nhập trên điện thoại. Để trống sẽ dùng logo trên nền tối.",
          },
        ],
      },
      {
        title: "Favicon",
        description: "Biểu tượng nhỏ trên tab trình duyệt, kết quả Google và khi lưu website ra màn hình điện thoại.",
        fields: [
          {
            name: "favicon",
            label: "Ảnh favicon",
            type: "image",
            help: "Ảnh vuông PNG, tối thiểu 192 × 192 px (nên 512 × 512). File .ico/.svg thì dán link. Để trống sẽ dùng /favicon.ico mặc định.",
          },
        ],
      },
      {
        title: "Mạng xã hội",
        description: "Để trống nếu không dùng — biểu tượng sẽ tự ẩn ở footer.",
        fields: [
          { name: "facebookUrl", label: "Facebook", type: "url", placeholder: "https://facebook.com/…", width: "half" },
          { name: "youtubeUrl", label: "YouTube", type: "url", placeholder: "https://youtube.com/@…", width: "half" },
          { name: "tiktokUrl", label: "TikTok", type: "url", placeholder: "https://tiktok.com/@…", width: "half" },
        ],
      },
    ],
  },
  {
    key: "header",
    label: "Header & Menu",
    description: "Menu điều hướng chính (dùng chung cho header và footer) và nút kêu gọi hành động.",
    previewHref: "/",
    sections: [
      {
        title: "Menu chính",
        description: "Link tới một mục trên trang chủ dùng dạng /#about, /#projects…",
        fields: [
          {
            name: "navItems",
            label: "Các mục menu",
            type: "list",
            itemLabel: "label",
            maxItems: 8,
            fields: [
              { name: "label", label: "Nhãn", type: "text", width: "half" },
              { name: "href", label: "Đường dẫn", type: "text", width: "half", placeholder: "/#about" },
            ],
          },
          { name: "ctaLabel", label: "Nút kêu gọi trên header", type: "text", width: "half" },
        ],
      },
    ],
  },
  {
    key: "hero",
    label: "Banner trang chủ",
    description: "Các slide ảnh lớn ở đầu trang chủ. Số liệu nổi bật chỉnh ở mục Liên hệ & số liệu.",
    previewHref: "/",
    sections: [
      {
        title: "Slide",
        fields: [
          {
            name: "slides",
            label: "Danh sách slide",
            type: "list",
            itemLabel: "title",
            maxItems: 6,
            fields: [
              { name: "image", label: "Ảnh nền", type: "image", help: "Ảnh ngang, tối thiểu 2000px" },
              { name: "eyebrow", label: "Dòng nhỏ phía trên", type: "text", width: "half" },
              { name: "caption", label: "Chú thích", type: "text", width: "half" },
              { name: "title", label: "Tiêu đề", type: "text" },
            ],
          },
        ],
      },
      {
        title: "Video nền (tuỳ chọn)",
        fields: [
          {
            name: "videoUrl",
            label: "Link video MP4",
            type: "url",
            help: "Khi có video, banner sẽ phát video thay cho slide ảnh",
          },
        ],
      },
    ],
  },
  {
    key: "about",
    label: "Về Anyhome",
    description: "Giới thiệu, tầm nhìn – sứ mệnh, giá trị cốt lõi, lịch sử và ban lãnh đạo.",
    previewHref: "/#about",
    sections: [
      {
        title: "Giới thiệu",
        fields: [
          { name: "eyebrow", label: "Dòng nhỏ", type: "text", width: "half" },
          { name: "title", label: "Tiêu đề", type: "text", width: "half" },
          { name: "titleHighlight", label: "Tiêu đề – phần màu vàng (dòng 2)", type: "text" },
          { name: "intro", label: "Đoạn giới thiệu", type: "textarea" },
          { name: "image", label: "Ảnh minh hoạ", type: "image" },
          { name: "foundedCaption", label: "Chú thích dưới năm thành lập", type: "text" },
          { name: "letter", label: "Thư ngỏ (trích dẫn)", type: "textarea" },
        ],
      },
      {
        title: "Tầm nhìn – Sứ mệnh – Giá trị",
        fields: [
          { name: "vision", label: "Tầm nhìn", type: "textarea" },
          { name: "mission", label: "Sứ mệnh", type: "textarea" },
          {
            name: "coreValues",
            label: "Giá trị cốt lõi",
            type: "list",
            itemLabel: "title",
            maxItems: 8,
            fields: [
              { name: "title", label: "Nội dung", type: "text", width: "half" },
              { name: "icon", label: "Biểu tượng", type: "select", options: VALUE_ICONS, width: "half" },
            ],
          },
        ],
      },
      {
        title: "Lịch sử hình thành",
        fields: [
          { name: "milestonesTitle", label: "Tiêu đề khối", type: "text" },
          {
            name: "milestones",
            label: "Các mốc",
            type: "list",
            itemLabel: "period",
            maxItems: 8,
            fields: [
              { name: "period", label: "Thời gian", type: "text", width: "half", placeholder: "2025 – Nay" },
              { name: "title", label: "Tiêu đề", type: "text", width: "half" },
              { name: "items", label: "Các ý (mỗi dòng một ý)", type: "lines" },
            ],
          },
        ],
      },
      {
        title: "Nhân sự & Lãnh đạo",
        description: "Sơ đồ tổ chức chi tiết vẫn lấy từ lib/data.ts.",
        fields: [
          { name: "teamTitle", label: "Tiêu đề", type: "text" },
          { name: "teamDescription", label: "Mô tả", type: "textarea" },
          {
            name: "leadership",
            label: "Ban lãnh đạo",
            type: "list",
            itemLabel: "name",
            maxItems: 12,
            fields: [
              { name: "name", label: "Họ tên", type: "text", width: "half" },
              { name: "role", label: "Chức vụ", type: "text", width: "half" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "capacity",
    label: "Lĩnh vực & Năng lực",
    description: "Lĩnh vực hoạt động, năng lực triển khai và quy trình Design & Build.",
    previewHref: "/#capacity",
    sections: [
      {
        title: "Tiêu đề khối",
        fields: [
          { name: "eyebrow", label: "Dòng nhỏ", type: "text", width: "half" },
          { name: "title", label: "Tiêu đề", type: "text", width: "half" },
          { name: "description", label: "Mô tả", type: "textarea" },
        ],
      },
      {
        title: "Lĩnh vực hoạt động",
        fields: [
          {
            name: "services",
            label: "Lĩnh vực",
            type: "list",
            itemLabel: "title",
            maxItems: 8,
            fields: [
              { name: "title", label: "Tên lĩnh vực", type: "text", width: "half" },
              { name: "icon", label: "Biểu tượng", type: "select", options: SERVICE_ICONS, width: "half" },
              { name: "items", label: "Hạng mục (mỗi dòng một mục)", type: "lines" },
            ],
          },
        ],
      },
      {
        title: "Năng lực triển khai",
        fields: [
          { name: "image", label: "Ảnh công trường", type: "image" },
          { name: "quote", label: "Câu trích trên ảnh", type: "text" },
          { name: "deliveryCapabilities", label: "Danh sách năng lực (mỗi dòng một ý)", type: "lines" },
        ],
      },
      {
        title: "Quy trình",
        fields: [
          { name: "workflowTitle", label: "Tiêu đề", type: "text", width: "half" },
          { name: "workflowSubtitle", label: "Mô tả ngắn", type: "text", width: "half" },
          {
            name: "workflow",
            label: "Các bước",
            type: "list",
            itemLabel: "title",
            maxItems: 10,
            fields: [
              { name: "step", label: "Số thứ tự", type: "text", width: "half", placeholder: "01" },
              { name: "title", label: "Tên bước", type: "text", width: "half" },
              { name: "desc", label: "Mô tả", type: "textarea" },
            ],
          },
          { name: "equipmentTitle", label: "Tiêu đề khối thiết bị", type: "text", help: "Danh mục thiết bị quản lý ở mục Năng lực & Thiết bị" },
        ],
      },
    ],
  },
  {
    key: "sections",
    label: "Tiêu đề các khối",
    description: "Dòng nhỏ, tiêu đề và mô tả của các khối Dự án, Đối tác, Tin tức, Liên hệ trên trang chủ.",
    previewHref: "/",
    sections: [
      {
        title: "Dự án",
        fields: [
          { name: "projectsEyebrow", label: "Dòng nhỏ", type: "text", width: "half" },
          { name: "projectsTitle", label: "Tiêu đề", type: "text", width: "half" },
          { name: "projectsDescription", label: "Mô tả", type: "textarea" },
        ],
      },
      {
        title: "Đối tác",
        fields: [
          { name: "partnersEyebrow", label: "Dòng nhỏ", type: "text", width: "half" },
          { name: "partnersTitle", label: "Tiêu đề", type: "text", width: "half" },
          { name: "partnersDescription", label: "Mô tả", type: "textarea" },
        ],
      },
      {
        title: "Tin tức",
        fields: [
          { name: "newsEyebrow", label: "Dòng nhỏ", type: "text", width: "half" },
          { name: "newsTitle", label: "Tiêu đề", type: "text", width: "half" },
        ],
      },
      {
        title: "Liên hệ",
        fields: [
          { name: "contactEyebrow", label: "Dòng nhỏ", type: "text", width: "half" },
          { name: "contactTitle", label: "Tiêu đề", type: "text", width: "half" },
          { name: "contactDescription", label: "Mô tả", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "partners",
    label: "Khách hàng & Đối tác",
    description: "Logo đối tác chạy trên trang chủ. Chưa có logo sẽ hiển thị chữ viết tắt.",
    previewHref: "/#partners",
    sections: [
      {
        title: "Đối tác",
        fields: [
          {
            name: "items",
            label: "Danh sách đối tác",
            type: "list",
            itemLabel: "name",
            maxItems: 40,
            fields: [
              { name: "name", label: "Tên", type: "text", width: "half" },
              { name: "sector", label: "Lĩnh vực", type: "text", width: "half" },
              { name: "logo", label: "Logo (tuỳ chọn)", type: "image", help: "PNG/WebP nền trong suốt" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "certificates",
    label: "Giấy phép & Chứng chỉ",
    description: "Hồ sơ pháp lý hiển thị ở mục Về Anyhome, bấm vào để xem ảnh lớn.",
    previewHref: "/#about",
    sections: [
      {
        title: "Tiêu đề khối",
        fields: [
          { name: "title", label: "Tiêu đề", type: "text" },
          { name: "description", label: "Mô tả", type: "textarea" },
        ],
      },
      {
        title: "Chứng chỉ",
        fields: [
          {
            name: "items",
            label: "Danh sách",
            type: "list",
            itemLabel: "title",
            maxItems: 24,
            fields: [
              { name: "title", label: "Tên giấy tờ", type: "text" },
              { name: "issuer", label: "Cơ quan cấp", type: "text" },
              { name: "image", label: "Ảnh scan", type: "image", help: "Ảnh dọc, chụp rõ nét" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    description: "Tiêu đề các cột và dòng bản quyền ở chân trang.",
    previewHref: "/#contact",
    sections: [
      {
        title: "Chân trang",
        fields: [
          { name: "exploreTitle", label: "Tiêu đề cột menu", type: "text", width: "half" },
          { name: "contactTitle", label: "Tiêu đề cột liên hệ", type: "text", width: "half" },
          { name: "closing", label: "Câu kết sau © bản quyền", type: "text" },
        ],
      },
    ],
  },
];

export const getContentGroup = (key: string) => contentGroups.find((g) => g.key === key);

/* ─────────────────────────── Làm sạch dữ liệu từ form ─────────────────────────── */

const MAX_TEXT = 5000;

const isSafeUrl = (v: string) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v);

function coerceValue(field: ContentField, raw: unknown): unknown {
  switch (field.type) {
    case "number": {
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    }
    case "image":
    case "url": {
      const v = String(raw ?? "").trim();
      if (!isSafeUrl(v)) throw new Error(`“${field.label}”: chỉ chấp nhận link http(s) hoặc đường dẫn bắt đầu bằng /`);
      return v;
    }
    case "select": {
      const v = String(raw ?? "");
      return field.options?.some((o) => o.value === v) ? v : field.options?.[0]?.value;
    }
    case "lines":
      return (Array.isArray(raw) ? raw : String(raw ?? "").split("\n"))
        .map((s) => String(s).trim())
        .filter(Boolean)
        .slice(0, 30)
        .map((s) => s.slice(0, MAX_TEXT));
    case "list":
      return (Array.isArray(raw) ? raw : [])
        .slice(0, field.maxItems ?? 50)
        .map((item) => coerceFields(field.fields ?? [], (item ?? {}) as Record<string, unknown>));
    default:
      return String(raw ?? "").trim().slice(0, MAX_TEXT);
  }
}

function coerceFields(fields: ContentField[], values: Record<string, unknown>) {
  return Object.fromEntries(fields.map((f) => [f.name, coerceValue(f, values[f.name])]));
}

/** Chỉ giữ các trường khai báo trong nhóm và ép đúng kiểu — không tin dữ liệu client gửi lên. */
export function coerceGroup(group: ContentGroup, values: Record<string, unknown>) {
  return coerceFields(
    group.sections.flatMap((s) => s.fields),
    values,
  );
}
