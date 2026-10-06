-- Anyhome — schema Supabase (Postgres)
-- Chạy file này TRƯỚC, sau đó chạy supabase/seed.sql.
-- Có thể chạy lại nhiều lần (idempotent).
--
-- Bảo mật: bật RLS và KHÔNG tạo policy nào → publishable key (anon) không đọc/ghi được.
-- Toàn bộ truy cập đi qua server Next.js bằng SUPABASE_SECRET_KEY (bỏ qua RLS).

/* ─────────────────────────── Dự án ─────────────────────────── */

create table if not exists public.projects (
  id            text primary key,
  slug          text not null unique,
  title         text not null,
  category      text not null check (category in ('residential', 'industrial', 'interior')),
  location      text not null,
  scale         text not null,
  area          integer not null default 0,
  year          integer not null,
  client        text,
  scope         text[] not null default '{}',
  summary       text not null,
  cover         text not null,
  gallery       text[] not null default '{}',
  before_after  jsonb,                          -- { "render": "...", "real": "..." }
  featured      boolean not null default false,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  created_at    timestamptz not null default now()
);

/* ─────────────────────────── Bài viết ─────────────────────────── */

create table if not exists public.posts (
  id            text primary key,
  slug          text not null unique,
  title         text not null,
  excerpt       text not null,
  content       text not null,                  -- HTML đã sanitize
  cover         text not null,
  category      text not null check (category in ('news', 'knowledge', 'construction-log', 'recruitment')),
  tags          text[] not null default '{}',
  author        text not null,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_at  timestamptz,
  updated_at    timestamptz not null default now()
);

/* ─────────────────────────── Thiết bị ─────────────────────────── */

create table if not exists public.equipments (
  id          text primary key,
  name        text not null,
  "group"     text not null check ("group" in ('machinery', 'formwork', 'survey', 'workshop')),
  spec        text not null,
  quantity    integer not null default 0,
  unit        text not null,
  origin      text not null,
  image       text not null,
  created_at  timestamptz not null default now()
);

/* ─────────────────────────── Khách hàng (leads) ─────────────────────────── */

create table if not exists public.leads (
  id            text primary key,
  name          text not null,
  phone         text not null,
  email         text,
  project_type  text not null check (project_type in ('residential', 'industrial', 'interior', 'other')),
  area          text,
  budget        text,
  message       text,
  status        text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed')),
  created_at    timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

/* ─────────────────────────── Cài đặt (1 dòng duy nhất) ─────────────────────────── */

create table if not exists public.site_settings (
  id                      smallint primary key default 1 check (id = 1),
  hotline                 text not null default '',
  hotline2                text not null default '',
  zalo                    text not null default '',
  email                   text not null default '',
  website                 text not null default '',
  hq_address              text not null default '',
  office_address          text not null default '',
  branch_address          text not null default '',
  map_query               text not null default '',
  stats                   jsonb not null default '[]',   -- [{ label, value, suffix }]
  profile_pdf_url         text not null default '',
  profile_pdf_file        text,                          -- đường dẫn trong bucket "documents"
  profile_pdf_updated_at  timestamptz,
  profile_downloads       integer not null default 0
);

-- Tăng lượt tải Profile PDF nguyên tử (tránh race condition khi nhiều người tải cùng lúc)
create or replace function public.increment_profile_downloads()
returns integer
language sql
security definer
set search_path = public
as $$
  update public.site_settings set profile_downloads = profile_downloads + 1 where id = 1
  returning profile_downloads;
$$;

revoke execute on function public.increment_profile_downloads() from public, anon, authenticated;

/* ─────────────────────────── RLS ─────────────────────────── */

alter table public.projects      enable row level security;
alter table public.posts         enable row level security;
alter table public.equipments    enable row level security;
alter table public.leads         enable row level security;
alter table public.site_settings enable row level security;

/* ─────────────────────────── Storage ─────────────────────────── */

-- Ảnh công trình / bài viết: public để next/image tải trực tiếp
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('uploads', 'uploads', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Profile PDF: private, server đọc bằng secret key rồi trả về cho người dùng (để đếm lượt tải)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 20971520, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
