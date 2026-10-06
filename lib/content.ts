/**
 * Giá trị mặc định của "Giao diện & cài đặt" — lấy từ lib/data.ts, nên trường chưa lưu
 * trong bảng `site_content` vẫn hiển thị nội dung gốc. Kiểu + cấu hình form: lib/content-schema.ts.
 */
import {
  certificates,
  company,
  coreValues,
  deliveryCapabilities,
  heroSlides,
  img,
  leadership,
  milestones,
  mission,
  partners,
  services,
  vision,
  workflow,
} from "@/lib/data";
import type { ContentKey, SiteContent } from "@/lib/content-schema";

export * from "@/lib/content-schema";

/* ─────────────────────────── Mặc định ─────────────────────────── */

export const defaultContent: SiteContent = {
  general: {
    brand: company.brand,
    legalName: company.legalName,
    shortName: company.shortName,
    internationalName: company.internationalName,
    taxCode: company.taxCode,
    representative: company.representative,
    representativeRole: "Chủ tịch HĐQT",
    founded: company.founded,
    staff: company.staff,
    slogan: company.slogan,
    tagline: company.tagline,
    seoTitle: `${company.brand} – ${company.slogan}`,
    seoDescription:
      "Anyhome – Tổng thầu Design & Build: thiết kế kiến trúc, nội thất, sản xuất nội thất và thi công xây dựng trọn gói nhà ở cao cấp, biệt thự, nhà xưởng công nghiệp.",
    ogImage: img("1600585154340-be6161a56a0c", 1200),
    facebookUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
  },
  header: {
    navItems: [
      { href: "/#about", label: "Về Anyhome" },
      { href: "/#capacity", label: "Năng lực" },
      { href: "/#projects", label: "Dự án" },
      { href: "/#news", label: "Tin tức" },
      { href: "/#contact", label: "Liên hệ" },
    ],
    ctaLabel: "Nhận báo giá",
  },
  hero: {
    slides: heroSlides.map((s) => ({ ...s })),
    videoUrl: "",
  },
  about: {
    eyebrow: "Về Anyhome",
    title: "Nâng niu công trình,",
    titleHighlight: "kiến tạo vượt thời gian",
    intro: company.intro,
    image: img("1600607687939-ce8a6c25118c", 1400),
    foundedCaption: "Năm thành lập · Mô hình tổng thầu Design & Build",
    letter: company.letter,
    vision,
    mission,
    coreValues: coreValues.map((v) => ({ ...v })),
    milestonesTitle: "Lịch sử hình thành",
    milestones: milestones.map((m) => ({ ...m, items: [...m.items] })),
    teamTitle: "Tổ chức tinh gọn, vận hành đồng bộ",
    teamDescription: `Khoảng ${company.staff} nhân sự gồm kiến trúc sư, kỹ sư xây dựng, nhà thiết kế nội thất, cán bộ kỹ thuật, quản lý dự án và đội thi công giàu kinh nghiệm — phối hợp xuyên suốt từ khảo sát, thiết kế, dự toán đến thi công và hoàn thiện.`,
    leadership: leadership.map((p) => ({ ...p })),
  },
  capacity: {
    eyebrow: "Lĩnh vực & Năng lực",
    title: "Một đầu mối — trọn vẹn từ bản vẽ đến bàn giao",
    description:
      "Anyhome sở hữu năng lực triển khai đồng bộ từ thiết kế, thi công phần thô, hoàn thiện kiến trúc đến sản xuất và lắp đặt nội thất — kiểm soát xuyên suốt chất lượng, tiến độ và chi phí.",
    services: services.map((s) => ({ ...s, items: [...s.items] })),
    image: img("1541888946425-d81bb19240f5", 1400),
    quote: "“Vững chắc từ kết cấu, tinh tế trong hoàn thiện.”",
    deliveryCapabilities: [...deliveryCapabilities],
    workflowTitle: "Quy trình Design & Build",
    workflowSubtitle: "Giám sát chặt chẽ, bảo chứng chất lượng công trình.",
    workflow: workflow.map((w) => ({ ...w })),
    equipmentTitle: "Hệ thống thiết bị thi công hiện đại",
  },
  sections: {
    projectsEyebrow: "Dự án tiêu biểu",
    projectsTitle: "Hơn 500 công trình trên 20 tỉnh thành",
    projectsDescription:
      "Từ nhà máy, nhà xưởng công nghiệp quy mô lớn đến biệt thự, căn hộ và không gian thương mại — mỗi công trình là sự kết tinh của sáng tạo, kỹ thuật và tâm huyết.",
    partnersEyebrow: "Khách hàng & Đối tác",
    partnersTitle: "Đồng hành cùng các chủ đầu tư uy tín",
    partnersDescription: "Tận tâm – Minh bạch – Trách nhiệm: nền tảng cho những mối quan hệ hợp tác bền vững.",
    newsEyebrow: "Tin tức & Kiến thức",
    newsTitle: "Câu chuyện từ công trường",
    contactEyebrow: "Liên hệ & Báo giá",
    contactTitle: "Bắt đầu công trình mang “chất riêng” của bạn",
    contactDescription:
      "Để lại thông tin — kiến trúc sư Anyhome sẽ tư vấn phương án và gửi báo giá sơ bộ miễn phí trong vòng 24 giờ làm việc.",
  },
  partners: { items: partners.map((p) => ({ ...p, logo: "" })) },
  certificates: {
    title: "Giấy phép & Chứng chỉ năng lực",
    description: "Hồ sơ pháp lý đầy đủ, minh bạch — bấm vào từng chứng chỉ để xem bản độ phân giải cao.",
    items: certificates.map(({ title, issuer, image }) => ({ title, issuer, image })),
  },
  footer: {
    exploreTitle: "Khám phá",
    contactTitle: "Liên hệ",
    closing: company.closing,
  },
};

/** Gộp nội dung đã lưu với mặc định theo từng nhóm. */
export function mergeContent(saved: Partial<Record<ContentKey, Record<string, unknown>>>): SiteContent {
  const out = structuredClone(defaultContent) as unknown as Record<ContentKey, Record<string, unknown>>;
  for (const key of Object.keys(out) as ContentKey[]) {
    if (saved[key]) out[key] = { ...out[key], ...saved[key] };
  }
  return out as unknown as SiteContent;
}

