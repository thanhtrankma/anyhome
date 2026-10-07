/**
 * Dữ liệu gốc của website — trích từ "Company Profile Anyhome" (40 trang).
 *
 * Nguồn: https://heyzine.com/flip-book/908b044467.html
 * Những trường KHÔNG có trong profile được đánh dấu `// MẪU` và cần
 * thay bằng số liệu thật trước khi đưa lên production
 * (diện tích, năm hoàn thành từng dự án, danh mục thiết bị, ảnh).
 */
import type {
  Certificate,
  Equipment,
  EquipmentGroup,
  Lead,
  LeadStatus,
  OrgNode,
  Post,
  PostCategory,
  Project,
  ProjectCategory,
  SiteSettings,
} from "@/lib/types";

/**
 * Ảnh công trình của Anyhome trên Supabase Storage (bucket "uploads", thư mục anyhome/).
 * Đánh số theo thứ tự tên file trong bộ ảnh gốc; đã nén tối đa 2000–2400px và xoá EXIF.
 */
export const photo = (n: string) =>
  `https://xezsyblbczsbxzvrffut.supabase.co/storage/v1/object/public/uploads/anyhome/${n}.jpg`;

/** Ảnh minh hoạ tạm (Unsplash) — next/image tự chuyển sang AVIF/WebP. */
export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ───────────────────────────── Công ty ───────────────────────────── */

export const company = {
  brand: "Anyhome",
  legalName: "Công ty Cổ phần Tư vấn Công nghệ Xây dựng Anyhome",
  internationalName: "Anyhome Construction Technology Consulting Joint Stock Company",
  shortName: "ANYHOME., JSC",
  taxCode: "0109533694",
  representative: "Bùi Anh Thư",
  founded: 2021,
  staff: 50,
  slogan: "Kiến tạo những công trình bền vững",
  tagline: "Anyhome, kiến tạo nên công trình đẹp thể hiện “chất riêng” của chính bạn.",
  closing: "Anyhome – Thành công để vươn xa",
  intro:
    "Được thành lập năm 2021, Anyhome hoạt động trong lĩnh vực thiết kế kiến trúc, thiết kế nội thất, sản xuất nội thất và thi công xây dựng trọn gói. Ngay từ những ngày đầu, chúng tôi định hướng phát triển theo mô hình Design & Build — cung cấp giải pháp đồng bộ từ ý tưởng, tư vấn, sản xuất đến thi công và hoàn thiện công trình.",
  letter:
    "Chúng tôi tin rằng mỗi công trình không chỉ là một sản phẩm xây dựng mà còn là sự kết tinh của sáng tạo, kỹ thuật và tâm huyết. Anyhome luôn lấy khách hàng làm trung tâm, đặt chất lượng làm nền tảng và xem sự hài lòng của khách hàng là thước đo cho mọi giá trị.",
} as const;

export const defaultSettings: SiteSettings = {
  hotline: "0912 623 887",
  hotline2: "0931 421 989",
  zalo: "0912623887",
  email: "thietkeanyhome@gmail.com",
  website: "www.anyhome.com.vn",
  hqAddress: "Số 5, ngõ 45/52, đường Cầu Cốc, Phường Tây Mỗ, TP Hà Nội",
  officeAddress: "Tầng 2, Tòa nhà số 385 Trần Đại Nghĩa, Hà Nội",
  branchAddress: "Vinhomes Royal Island, Đảo Hoàng Gia, Phường Thuỷ Nguyên, Hải Phòng",
  mapQuery: "385 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội",
  stats: [
    { label: "Năm kinh nghiệm", value: new Date().getFullYear() - 2021, suffix: "+" },
    { label: "Công trình hoàn thành", value: 500, suffix: "+" },
    { label: "Tỉnh thành phủ sóng", value: 20, suffix: "" },
    // MẪU — profile không công bố tổng diện tích thi công
    { label: "m² sàn đã thi công", value: 250000, suffix: "+" },
  ],
  profilePdfUrl:
    "https://cdnm.heyzine.com/files/uploaded/v3/908b04446750c12b1e752a3ad0883d7ee4564355.pdf",
  profilePdfFile: null,
  profilePdfUpdatedAt: null,
};

export const heroSlides = [
  {
    image: photo("07"),
    eyebrow: "Design & Build",
    title: "Kiến tạo những công trình bền vững",
    caption: "Biệt thự · Nhà phố · Căn hộ cao cấp",
  },
  {
    image: photo("11"),
    eyebrow: "Công trình công nghiệp",
    title: "Vững chắc từ kết cấu, tinh tế trong hoàn thiện",
    caption: "Nhà máy · Nhà xưởng · Showroom",
  },
  {
    image: photo("29"),
    eyebrow: "Thiết kế & Thi công nội thất",
    title: "Không gian mang “chất riêng” của chính bạn",
    caption: "Sản xuất nội thất theo thiết kế riêng",
  },
];

/* ───────────────────────── Về Anyhome ───────────────────────── */

export const vision =
  "Trở thành đơn vị tư vấn – thiết kế kiến trúc, nội thất và thi công xây dựng hàng đầu với trình độ và năng lực chuyên môn cao. Phát triển mạnh mẽ trên khắp đất nước và định hướng xuất khẩu thiết kế đến các quốc gia phát triển trên thế giới.";

export const mission =
  "Luôn đi đầu cập nhật xu hướng thiết kế, phần mềm, công nghệ thi công và vật liệu hoàn thiện mới — cung cấp giải pháp đồng bộ từ Thiết kế tới Thi công giúp khách hàng tiết kiệm thời gian, tối ưu chi phí, kiểm soát chất lượng và tiến độ công trình.";

export const coreValues = [
  { title: "Lấy con người làm trung tâm", icon: "users" },
  { title: "Đổi mới trong tư duy thiết kế", icon: "lightbulb" },
  { title: "Chuẩn mực trong từng chi tiết", icon: "ruler" },
  { title: "Minh bạch & tận tâm", icon: "handshake" },
  { title: "Phát triển xanh bền vững", icon: "leaf" },
] as const;

export const milestones = [
  {
    period: "2021",
    title: "Thành lập công ty",
    items: [
      "Thành lập Công ty Cổ phần Tư vấn Công nghệ Xây dựng Anyhome.",
      "Hoạt động trong lĩnh vực xây dựng, thiết kế kiến trúc và nội thất.",
    ],
  },
  {
    period: "2022 – 2024",
    title: "Mở rộng Design & Build",
    items: [
      "Mở rộng dịch vụ thi công trọn gói.",
      "Hoàn thiện quy trình thiết kế – sản xuất – thi công đồng bộ.",
      "Thực hiện nhiều công trình nhà ở cao cấp tại Hà Nội và các tỉnh lân cận.",
    ],
  },
  {
    period: "2025 – Nay",
    title: "Khẳng định thương hiệu",
    items: [
      "Mở rộng quy mô nhân sự, mở chi nhánh Hải Phòng.",
      "Khẳng định thương hiệu trong thiết kế & thi công công trình công nghiệp và dân dụng.",
      "Hoạt động giám sát và tư vấn kỹ thuật xây dựng.",
      "Hướng tới phát triển bền vững với giải pháp kiến trúc hiện đại.",
    ],
  },
];

export const services = [
  {
    title: "Thiết kế kiến trúc – xây dựng",
    icon: "drafting",
    items: ["Văn phòng, nhà máy", "Công trình thương mại", "Biệt thự, nhà phố", "Nhà chung cư", "Khách sạn, villa nghỉ dưỡng"],
  },
  {
    title: "Thiết kế nội thất",
    icon: "sofa",
    items: ["Nhà ở cao cấp", "Căn hộ", "Biệt thự", "Văn phòng", "Showroom"],
  },
  {
    title: "Thi công xây dựng",
    icon: "hardhat",
    items: ["Thi công dân dụng & công nghiệp", "Thi công phần thô, hoàn thiện", "Thi công nội thất", "Tổng thầu Design & Build"],
  },
  {
    title: "Giám sát & Quản lý dự án",
    icon: "clipboard",
    items: ["Giám sát chất lượng, tiến độ", "Nghiệm thu & bàn giao", "Điều phối nhà thầu phụ", "Tư vấn kỹ thuật xây dựng"],
  },
] as const;

export const deliveryCapabilities = [
  "Thi công phần thô và hoàn thiện công trình",
  "Thi công hệ thống điện, nước và kỹ thuật âm",
  "Sản xuất nội thất theo thiết kế riêng tại nhà máy",
  "Lắp đặt, hoàn thiện và kiểm soát chất lượng",
  "Bảo đảm an toàn, tiến độ và tối ưu chi phí",
];

export const workflow = [
  { step: "01", title: "Khảo sát & Tư vấn", desc: "Nghiên cứu nhu cầu, phong cách sống, khu đất và ngân sách." },
  { step: "02", title: "Thiết kế & Dự toán", desc: "Ý tưởng, phối cảnh 3D, hồ sơ kỹ thuật và dự toán chi tiết." },
  { step: "03", title: "Sản xuất", desc: "Gia công nội thất tại nhà máy theo bản vẽ riêng." },
  { step: "04", title: "Thi công", desc: "Phần thô, MEP, hoàn thiện kiến trúc và lắp đặt nội thất." },
  { step: "05", title: "Giám sát", desc: "Kiểm soát vật liệu, kỹ thuật, an toàn và tiến độ tại công trường." },
  { step: "06", title: "Nghiệm thu & Bàn giao", desc: "Báo cáo minh bạch, bảo hành và đồng hành lâu dài." },
];

export const leadership = [
  { name: "Bùi Anh Thư", role: "Chủ tịch HĐQT" },
  { name: "TS. GV. Lê Văn Minh", role: "Giám đốc kỹ thuật" },
  { name: "KS. Phạm Văn Hưng", role: "Giám đốc kinh doanh" },
];

export const disciplineLeads = [
  { name: "KTS. Chu Văn Trường", role: "Chủ trì bộ môn Kiến trúc" },
  { name: "ThS. KS. Nguyễn Trọng Thắm", role: "Chủ trì bộ môn Kết cấu" },
  { name: "KS. Nguyễn Văn Luân", role: "Chủ trì bộ môn Điện" },
  { name: "KS. Nguyễn Đức Công", role: "Chủ trì bộ môn Nước" },
  { name: "KS. Lê Thị Hằng", role: "Chủ trì bộ môn Dự toán" },
];

/** Sơ đồ tổ chức — trang 10 của profile */
export const orgChart: OrgNode = {
  id: "chairman",
  title: "Chủ tịch HĐQT",
  person: "Bùi Anh Thư",
  children: [
    {
      id: "cto",
      title: "Giám đốc kỹ thuật",
      person: "TS. GV. Lê Văn Minh",
      children: [
        {
          id: "planning",
          title: "Trưởng phòng Kế hoạch",
          children: [
            { id: "plan-internal", title: "Bộ phận kế hoạch nội bộ" },
            { id: "plan-market", title: "Bộ phận kế hoạch thị trường" },
          ],
        },
        {
          id: "design",
          title: "Trưởng phòng Thiết kế, Giám sát",
          children: [
            {
              id: "design-dept",
              title: "Phòng Thiết kế",
              children: disciplineLeads.map((d, i) => ({ id: `disc-${i}`, title: d.role, person: d.name })),
            },
            { id: "supervision", title: "Phòng Giám sát" },
            { id: "legal", title: "Phòng Thủ tục pháp lý CĐT" },
          ],
        },
        {
          id: "construction",
          title: "Trưởng phòng Thi công",
          children: [
            { id: "factory", title: "Đội gia công sản xuất tại nhà máy" },
            { id: "site", title: "Đội thi công xây lắp" },
          ],
        },
      ],
    },
    {
      id: "cso",
      title: "Giám đốc kinh doanh",
      person: "KS. Phạm Văn Hưng",
      children: [{ id: "finance", title: "Trưởng phòng Kế toán, Nhân sự" }],
    },
  ],
};

/** Trang 14–23 "Thông tin pháp lý" — thay ảnh SVG bằng bản scan thật. */
export const certificates: Certificate[] = [
  { id: "c1", title: "Giấy chứng nhận đăng ký doanh nghiệp", issuer: "Sở KH&ĐT Hà Nội · MST 0109533694", image: "/certificates/business-license.svg" },
  { id: "c2", title: "Chứng chỉ năng lực hoạt động xây dựng", issuer: "Bộ Xây dựng", image: "/certificates/construction-capacity.svg" },
  { id: "c3", title: "Chứng chỉ hành nghề thiết kế kiến trúc", issuer: "Hội Kiến trúc sư Việt Nam", image: "/certificates/architect-license.svg" },
  { id: "c4", title: "Chứng chỉ hành nghề giám sát thi công", issuer: "Bộ Xây dựng", image: "/certificates/supervision-license.svg" },
  { id: "c5", title: "Chứng chỉ thiết kế kết cấu công trình", issuer: "Bộ Xây dựng", image: "/certificates/structure-license.svg" },
  { id: "c6", title: "Chứng chỉ định giá xây dựng", issuer: "Bộ Xây dựng", image: "/certificates/cost-license.svg" },
];

/* ─────────────────────── Năng lực & Thiết bị ─────────────────────── */

export const equipmentGroupLabels: Record<EquipmentGroup, string> = {
  machinery: "Máy thi công",
  formwork: "Cốp pha & Giàn giáo",
  survey: "Thiết bị trắc đạc – kiểm định",
  workshop: "Xưởng sản xuất nội thất",
};

// MẪU — profile chưa có danh mục thiết bị chi tiết, cập nhật trong /admin/equipments
export const equipments: Equipment[] = [
  { id: "eq-1", name: "Máy xúc bánh xích", group: "machinery", spec: "Gầu 0,7 – 1,2 m³", quantity: 3, unit: "chiếc", origin: "Nhật Bản", image: img("1517089596392-fb9a9033e05b", 900) },
  { id: "eq-2", name: "Cần trục tháp", group: "machinery", spec: "Sức nâng 6 – 8 tấn, tầm với 50 m", quantity: 2, unit: "bộ", origin: "Trung Quốc", image: img("1565008447742-97f6f38c985c", 900) },
  { id: "eq-3", name: "Máy trộn & bơm bê tông", group: "machinery", spec: "Công suất 30 – 60 m³/h", quantity: 4, unit: "bộ", origin: "Hàn Quốc", image: img("1541888946425-d81bb19240f5", 900) },
  { id: "eq-4", name: "Máy đầm dùi, đầm bàn", group: "machinery", spec: "1,5 – 2,2 kW", quantity: 20, unit: "chiếc", origin: "Nhật Bản", image: img("1504307651254-35680f356dfd", 900) },
  { id: "eq-5", name: "Cốp pha nhôm định hình", group: "formwork", spec: "Hệ sàn + vách, luân chuyển 200+ lần", quantity: 1800, unit: "m²", origin: "Việt Nam", image: img("1590496793929-36417d3117de", 900) },
  { id: "eq-6", name: "Cốp pha thép & ván phủ phim", group: "formwork", spec: "Dầm, cột, sàn", quantity: 2500, unit: "m²", origin: "Việt Nam", image: img("1621905252507-b35492cc74b4", 900) },
  { id: "eq-7", name: "Giàn giáo nêm, giáo chống tổ hợp", group: "formwork", spec: "Chiều cao lắp dựng tới 30 m", quantity: 3000, unit: "bộ", origin: "Việt Nam", image: img("1565008447742-97f6f38c985c", 900) },
  { id: "eq-8", name: "Máy toàn đạc điện tử", group: "survey", spec: "Độ chính xác góc 2″", quantity: 2, unit: "bộ", origin: "Nhật Bản", image: img("1581092160562-40aa08e78837", 900) },
  { id: "eq-9", name: "Máy thủy bình, máy laser cân bằng", group: "survey", spec: "Tự động cân bằng", quantity: 6, unit: "bộ", origin: "Đức", image: img("1503387762-592deb58ef4e", 900) },
  { id: "eq-10", name: "Máy siêu âm & súng bật nẩy bê tông", group: "survey", spec: "Kiểm tra cường độ kết cấu", quantity: 2, unit: "bộ", origin: "Thụy Sĩ", image: img("1504307651254-35680f356dfd", 900) },
  { id: "eq-11", name: "Máy CNC cắt ván công nghiệp", group: "workshop", spec: "Bàn làm việc 1.300 × 2.500 mm", quantity: 2, unit: "máy", origin: "Đài Loan", image: img("1513828583688-c52646db42da", 900) },
  { id: "eq-12", name: "Máy dán cạnh tự động, khoan đa trục", group: "workshop", spec: "Dây chuyền gia công tủ bếp, tủ áo", quantity: 3, unit: "máy", origin: "Đài Loan", image: img("1586528116311-ad8dd3c8310d", 900) },
];

/* ─────────────────────────── Dự án ─────────────────────────── */

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  residential: "Dân dụng & Biệt thự",
  industrial: "Nhà xưởng & Công nghiệp",
  interior: "Thiết kế & Thi công Nội thất",
};

type SeedProject = Omit<Project, "id" | "slug" | "status" | "createdAt" | "gallery"> & { gallery?: string[] };

// Tên, địa điểm, phạm vi lấy từ trang 24–38. Quy mô/năm: MẪU.
const seedProjects: SeedProject[] = [
  {
    title: "Nhà máy mạ kẽm Công ty Vạn Xuân",
    category: "industrial",
    location: "CCN Vạn Xuân, Tam Nông, Phú Thọ",
    scale: "Khung thép tiền chế · 6.500 m²",
    area: 6500,
    year: 2024,
    client: "Công ty Vạn Xuân",
    scope: ["Thiết kế", "Thi công"],
    summary: "Nhà máy mạ kẽm nhúng nóng với kết cấu khung thép tiền chế khẩu độ lớn, hệ thống thông gió và xử lý khí thải chuyên dụng.",
    cover: photo("12"),
    featured: true,
  },
  {
    title: "Nhà máy Công ty Chế tạo Bơm Hải Dương",
    category: "industrial",
    location: "Đường Ngô Quyền, TP. Hải Dương",
    scale: "Nhà xưởng + nhà ăn · 4.200 m²",
    area: 4200,
    year: 2023,
    client: "Công ty CP Chế tạo Bơm Hải Dương",
    scope: ["Thiết kế", "Thi công"],
    summary: "Cải tạo, mở rộng nhà xưởng sản xuất và thiết kế – thi công hạng mục nhà ăn cho cán bộ công nhân viên.",
    cover: img("1513828583688-c52646db42da"),
    featured: false,
  },
  {
    title: "Nhà xưởng sản xuất & cho thuê Xuân Phương",
    category: "industrial",
    location: "CCN Đan Phượng giai đoạn 2, Hà Nội",
    scale: "Cụm nhà xưởng · 8.000 m²",
    area: 8000,
    year: 2024,
    client: "Công ty Xuân Phương",
    scope: ["Thiết kế", "Thi công"],
    summary: "Cụm nhà xưởng tiêu chuẩn phục vụ sản xuất và cho thuê, tối ưu khẩu độ, chiếu sáng tự nhiên và phòng cháy chữa cháy.",
    cover: photo("13"),
    featured: false,
  },
  {
    title: "Nhà máy Công ty TNHH Ánh sáng Tiến Dư",
    category: "industrial",
    location: "Xã Bình Minh, Thanh Oai, Hà Nội",
    scale: "Nhà máy + văn phòng · 5.100 m²",
    area: 5100,
    year: 2023,
    client: "Công ty TNHH Ánh sáng Tiến Dư",
    scope: ["Thiết kế", "Thi công"],
    summary: "Thiết kế và thi công trọn gói nhà máy sản xuất thiết bị chiếu sáng cùng khối văn phòng điều hành.",
    cover: photo("17"),
    featured: false,
  },
  {
    title: "Nhà máy sản xuất thiết bị công nghiệp Kintop",
    category: "industrial",
    location: "KCN Lai Cách, Cẩm Giàng, Hải Dương",
    scale: "Nhà xưởng · 7.200 m²",
    area: 7200,
    year: 2025,
    client: "Công ty Kintop",
    scope: ["Thiết kế", "Thi công"],
    summary: "Nhà máy sản xuất thiết bị công nghiệp, kết cấu thép kết hợp bê tông cốt thép, cầu trục 10 tấn.",
    cover: photo("15"),
    featured: true,
  },
  {
    title: "Nhà máy nhôm kính Công ty CP HCC",
    category: "industrial",
    location: "CCN Thanh Đa, Phúc Thọ, Hà Nội",
    scale: "Nhà xưởng · 5.600 m²",
    area: 5600,
    year: 2024,
    client: "Công ty CP Nhôm kính HCC",
    scope: ["Thiết kế", "Thi công"],
    summary: "Nhà máy gia công nhôm kính với dây chuyền khép kín, mặt bằng bố trí theo luồng sản xuất một chiều.",
    cover: photo("14"),
    featured: false,
  },
  {
    title: "Showroom ô tô VinFast Vĩnh Yên",
    category: "industrial",
    location: "TP. Vĩnh Yên, Vĩnh Phúc",
    scale: "Showroom 3S · 2.400 m²",
    area: 2400,
    year: 2023,
    client: "Đại lý VinFast Vĩnh Yên",
    scope: ["Thi công"],
    summary: "Thi công showroom – xưởng dịch vụ theo bộ nhận diện tiêu chuẩn của thương hiệu.",
    cover: photo("05"),
    gallery: [photo("05"), photo("03"), photo("04")],
    featured: false,
  },
  {
    title: "Nhà máy MING SHIN Hưng Yên",
    category: "industrial",
    location: "Hưng Yên",
    scale: "Nhà xưởng · 9.000 m²",
    area: 9000,
    year: 2025,
    client: "MING SHIN",
    scope: ["Thi công", "Giám sát"],
    summary: "Nhà máy vốn FDI, thi công kết cấu thép khẩu độ lớn và hệ thống kỹ thuật MEP đồng bộ.",
    cover: photo("11"),
    featured: false,
  },
  {
    title: "Biệt thự Địa Trung Hải",
    category: "residential",
    location: "Thanh Hóa",
    scale: "3 tầng · 520 m² sàn",
    area: 520,
    year: 2024,
    scope: ["Thiết kế", "Thi công"],
    summary: "Biệt thự phong cách Địa Trung Hải với mái ngói đỏ, vòm cong và sân vườn bao quanh.",
    cover: photo("55"),
    gallery: [photo("55"), photo("56"), photo("51"), photo("49"), photo("50"), photo("52"), photo("53"), photo("54"), photo("48")],
    featured: true,
  },
  {
    title: "Biệt thự mái Nhật",
    category: "residential",
    location: "Hòa Bình",
    scale: "2 tầng · 380 m² sàn",
    area: 380,
    year: 2023,
    scope: ["Thiết kế", "Thi công"],
    summary: "Biệt thự nghỉ dưỡng mái Nhật, hòa vào cảnh quan đồi núi với vật liệu gỗ và đá tự nhiên.",
    cover: photo("07"),
    featured: true,
  },
  {
    title: "Biệt thự KĐT Thành phố Giao Lưu",
    category: "residential",
    location: "KĐT Thành phố Giao Lưu, Bắc Từ Liêm, Hà Nội",
    scale: "4 tầng · 600 m² sàn",
    area: 600,
    year: 2024,
    scope: ["Thiết kế", "Thi công"],
    summary: "Biệt thự hiện đại với mặt đứng kính lớn, giếng trời trung tâm và tầng hầm để xe.",
    cover: photo("18"),
    featured: true,
  },
  {
    title: "Biệt thự gia đình Hạc Thành",
    category: "residential",
    location: "Phường Hạc Thành, Thanh Hóa",
    scale: "3 tầng · 450 m² sàn",
    area: 450,
    year: 2025,
    scope: ["Thiết kế", "Thi công"],
    summary: "Biệt thự tân cổ điển cho gia đình ba thế hệ, công năng tách bạch và sân vườn riêng.",
    cover: photo("08"),
    featured: false,
  },
  {
    title: "Khách sạn Sông Hồng",
    category: "residential",
    location: "Vĩnh Phúc",
    scale: "9 tầng · 4.800 m² sàn",
    area: 4800,
    year: 2022,
    scope: ["Thiết kế"],
    summary: "Khách sạn 3 sao với sảnh đón thông tầng, nhà hàng và 60 phòng nghỉ.",
    cover: photo("63"),
    gallery: [photo("63"), photo("62")],
    featured: false,
  },
  {
    title: "Văn phòng 7 tầng Bạch Đằng",
    category: "residential",
    location: "Phường Bạch Đằng, TP. Hạ Long",
    scale: "7 tầng · 1.750 m² sàn",
    area: 1750,
    year: 2024,
    scope: ["Thiết kế"],
    summary: "Tòa văn phòng mặt tiền kính hướng biển, kết cấu khung BTCT kết hợp lam chắn nắng.",
    cover: photo("58"),
    featured: false,
  },
  {
    title: "Trường Cao đẳng Thương mại",
    category: "residential",
    location: "TP. Đà Nẵng",
    scale: "Khối giảng đường · 6.000 m² sàn",
    area: 6000,
    year: 2022,
    scope: ["Thiết kế"],
    summary: "Khối giảng đường và thư viện với hành lang thông gió tự nhiên phù hợp khí hậu miền Trung.",
    cover: photo("06"),
    featured: false,
  },
  {
    title: "Kết cấu thép chung cư Five Star Garden",
    category: "residential",
    location: "Số 2 Kim Giang, Hà Nội",
    scale: "Hạng mục kết cấu thép",
    area: 3000,
    year: 2025,
    scope: ["Thiết kế", "Thi công"],
    summary: "Thiết kế và thi công hạng mục kết cấu thép cho tổ hợp chung cư cao tầng.",
    cover: img("1545324418-cc1a3fa10c00"),
    featured: false,
  },
  {
    title: "Chung cư mini Thạch Bàn",
    category: "residential",
    location: "Thạch Bàn, Long Biên, Hà Nội",
    scale: "8 tầng · 1.400 m² sàn",
    area: 1400,
    year: 2023,
    scope: ["Thiết kế", "Thi công"],
    summary: "Chung cư mini 24 căn hộ, tối ưu diện tích cho thuê và hệ thống PCCC theo quy chuẩn mới.",
    cover: photo("59"),
    gallery: [photo("59"), photo("60"), photo("57")],
    featured: false,
  },
  {
    title: "Giám sát hoàn thiện Vinhomes Vũ Yên",
    category: "residential",
    location: "Vũ Yên, Hải Phòng",
    scale: "Biệt thự đảo",
    area: 900,
    year: 2026,
    scope: ["Giám sát"],
    summary: "Giám sát thi công hoàn thiện kiến trúc và nội thất các căn biệt thự tại Vinhomes Royal Island.",
    cover: photo("45"),
    gallery: [photo("45"), photo("42"), photo("44"), photo("43"), photo("46"), photo("47"), photo("41")],
    featured: false,
  },
  {
    title: "Nội thất nhà phố anh Mạnh",
    category: "interior",
    location: "TP. Bắc Giang",
    scale: "4 tầng · 320 m² sàn",
    area: 320,
    year: 2025,
    scope: ["Thiết kế", "Sản xuất", "Thi công"],
    summary: "Nội thất hiện đại tông ấm, toàn bộ đồ gỗ sản xuất tại xưởng Anyhome theo kích thước riêng.",
    cover: photo("29"),
    gallery: [photo("29"), photo("37"), photo("38"), photo("40"), photo("26"), photo("24"), photo("25"), photo("28"), photo("22"), photo("23"), photo("21"), photo("19"), photo("33"), photo("34"), photo("35"), photo("36")],
    featured: true,
  },
  {
    title: "Nhà hàng café 2 tầng Măng Đen",
    category: "interior",
    location: "Khu du lịch Măng Đen, Kon Tum",
    scale: "2 tầng · 400 m² sàn",
    area: 400,
    year: 2024,
    scope: ["Thiết kế", "Thi công"],
    summary: "Không gian café – nhà hàng giữa rừng thông, vật liệu gỗ thông và kính lớn đón sương.",
    cover: img("1554118811-1e0d58224f24"),
    featured: false,
  },
  {
    title: "Quán café 3 tầng Đà Nẵng",
    category: "interior",
    location: "TP. Đà Nẵng",
    scale: "3 tầng · 360 m² sàn",
    area: 360,
    year: 2024,
    scope: ["Thiết kế", "Thi công"],
    summary: "Café phong cách industrial – tropical, sân thượng mở và quầy bar trung tâm.",
    cover: img("1501339847302-ac426a4a7cbb"),
    featured: false,
  },
  {
    title: "Căn hộ cao cấp phong cách Japandi",
    category: "interior",
    location: "Hà Nội",
    scale: "Căn hộ · 135 m²",
    area: 135,
    year: 2026,
    scope: ["Thiết kế", "Sản xuất", "Thi công"],
    summary: "Căn hộ 3 phòng ngủ tối giản Japandi với gỗ sồi sáng màu và ánh sáng gián tiếp.",
    cover: img("1618221195710-dd6b41faaea6"),
    beforeAfter: { render: img("1618221195710-dd6b41faaea6"), real: img("1618221195710-dd6b41faaea6") },
    featured: true,
  },
];

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const projects: Project[] = seedProjects.map((p, i) => ({
  ...p,
  id: `prj-${String(i + 1).padStart(3, "0")}`,
  slug: slugify(p.title),
  gallery: p.gallery ?? [p.cover],
  status: "published",
  createdAt: new Date(Date.UTC(p.year, 5, 1 + i)).toISOString(),
}));

/* ─────────────────────────── Đối tác ─────────────────────────── */

export const partners = [
  { name: "Vạn Xuân", sector: "Mạ kẽm nhúng nóng" },
  { name: "Bơm Hải Dương", sector: "Chế tạo bơm" },
  { name: "Xuân Phương", sector: "Khu công nghiệp" },
  { name: "Tiến Dư", sector: "Thiết bị chiếu sáng" },
  { name: "Kintop", sector: "Thiết bị công nghiệp" },
  { name: "HCC", sector: "Nhôm kính" },
  { name: "VinFast", sector: "Ô tô" },
  { name: "Ming Shin", sector: "Sản xuất FDI" },
  { name: "Five Star", sector: "Bất động sản" },
  { name: "Vinhomes", sector: "Bất động sản" },
];

/* ─────────────────────────── Bài viết ─────────────────────────── */

export const postCategoryLabels: Record<PostCategory, string> = {
  news: "Tin tức",
  knowledge: "Kiến thức xây dựng",
  "construction-log": "Nhật ký công trình",
  recruitment: "Tuyển dụng",
};

export const posts: Post[] = [
  {
    id: "post-001",
    slug: "design-and-build-giai-phap-tron-goi",
    title: "Design & Build: vì sao chủ đầu tư nên chọn một đầu mối từ thiết kế đến thi công?",
    excerpt: "Mô hình tổng thầu Design & Build giúp hạn chế sai lệch giữa bản vẽ và thực tế, tối ưu chi phí và kiểm soát tiến độ.",
    content:
      "<p>Khi thiết kế và thi công do hai đơn vị khác nhau đảm nhận, chủ đầu tư thường phải tự xử lý những xung đột giữa bản vẽ và hiện trường.</p><h2>3 lợi ích cốt lõi</h2><ul><li><strong>Một đầu mối chịu trách nhiệm</strong> cho toàn bộ chất lượng.</li><li><strong>Dự toán sát thực tế</strong> ngay từ giai đoạn ý tưởng.</li><li><strong>Rút ngắn tiến độ</strong> nhờ triển khai song song thiết kế – sản xuất.</li></ul><blockquote>Anyhome – Thiết kế khác biệt, kiến tạo không gian giá trị.</blockquote>",
    cover: photo("64"),
    category: "knowledge",
    tags: ["Design & Build", "Tư vấn"],
    author: "Phòng Thiết kế",
    status: "published",
    publishedAt: "2026-08-12T02:00:00.000Z",
    updatedAt: "2026-08-12T02:00:00.000Z",
  },
  {
    id: "post-002",
    slug: "khoi-cong-nha-may-kintop",
    title: "Khởi công nhà máy sản xuất thiết bị công nghiệp Kintop tại KCN Lai Cách",
    excerpt: "Anyhome chính thức triển khai thi công nhà xưởng 7.200 m² cho Công ty Kintop tại Cẩm Giàng, Hải Dương.",
    content:
      "<p>Sáng nay, Anyhome cùng chủ đầu tư tổ chức lễ khởi công nhà máy Kintop.</p><h2>Quy mô dự án</h2><p>Nhà xưởng kết cấu thép kết hợp bê tông cốt thép, trang bị cầu trục 10 tấn.</p>",
    cover: photo("15"),
    category: "construction-log",
    tags: ["Công nghiệp", "Khởi công"],
    author: "Ban Chỉ huy công trường",
    status: "published",
    publishedAt: "2026-07-03T02:00:00.000Z",
    updatedAt: "2026-07-03T02:00:00.000Z",
  },
  {
    id: "post-003",
    slug: "xu-huong-noi-that-japandi-2026",
    title: "Xu hướng nội thất Japandi 2026: tối giản, ấm áp và bền vững",
    excerpt: "Gỗ sáng màu, đường nét tối giản và ánh sáng gián tiếp — vì sao Japandi tiếp tục dẫn dắt nội thất căn hộ cao cấp.",
    content: "<p>Japandi là sự giao thoa giữa tinh thần wabi-sabi Nhật Bản và công năng Bắc Âu.</p>",
    cover: photo("28"),
    category: "knowledge",
    tags: ["Nội thất", "Xu hướng"],
    author: "Studio Nội thất",
    status: "published",
    publishedAt: "2026-05-20T02:00:00.000Z",
    updatedAt: "2026-05-20T02:00:00.000Z",
  },
  {
    id: "post-004",
    slug: "tuyen-dung-ky-su-giam-sat",
    title: "Tuyển dụng Kỹ sư giám sát xây dựng (Hà Nội, Hải Phòng)",
    excerpt: "Anyhome mở rộng đội ngũ, tuyển 05 kỹ sư giám sát dân dụng và công nghiệp.",
    content: "<p>Bản nháp — đang hoàn thiện mô tả công việc.</p>",
    cover: photo("65"),
    category: "recruitment",
    tags: ["Tuyển dụng"],
    author: "Phòng Nhân sự",
    status: "draft",
    publishedAt: null,
    updatedAt: "2026-09-28T02:00:00.000Z",
  },
];

/* ─────────────────────────── Leads ─────────────────────────── */

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  quoted: "Đã báo giá",
  closed: "Đã chốt",
};

export const leadProjectTypeLabels: Record<Lead["projectType"], string> = {
  ...projectCategoryLabels,
  other: "Khác",
};

const daysAgo = (d: number, h = 9) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(h, 15, 0, 0);
  return date.toISOString();
};

// Dữ liệu demo cho trang quản trị
export const leads: Lead[] = [
  { id: "lead-001", name: "Nguyễn Minh Tuấn", phone: "0903 112 334", email: "tuan.nm@example.com", projectType: "residential", area: "320 m²", budget: "3 – 5 tỷ", message: "Cần thiết kế & thi công biệt thự 3 tầng tại Hà Đông.", status: "new", createdAt: daysAgo(0, 8) },
  { id: "lead-002", name: "Trần Thu Hà", phone: "0987 556 102", projectType: "interior", area: "110 m²", budget: "500 tr – 1 tỷ", message: "Nội thất căn hộ 3PN phong cách hiện đại.", status: "new", createdAt: daysAgo(1, 14) },
  { id: "lead-003", name: "Công ty TNHH Hưng Phát", phone: "0912 889 001", email: "contact@hungphat.example", projectType: "industrial", area: "5.000 m²", budget: "Trên 20 tỷ", message: "Nhà xưởng KCN Quế Võ, cần báo giá thiết kế – thi công.", status: "contacted", createdAt: daysAgo(3, 10) },
  { id: "lead-004", name: "Lê Văn Phúc", phone: "0868 230 777", projectType: "residential", area: "180 m²", message: "Nhà phố 5 tầng mặt tiền 5 m.", status: "quoted", createdAt: daysAgo(6, 16) },
  { id: "lead-005", name: "Phạm Ngọc Anh", phone: "0936 450 218", projectType: "interior", budget: "1 – 3 tỷ", message: "Showroom thời trang 2 tầng.", status: "closed", createdAt: daysAgo(12, 11) },
];
