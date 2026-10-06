-- Anyhome — bảng nội dung "Giao diện & cài đặt" (/admin/settings/<nhóm>)
-- Chạy 1 lần trong Supabase → SQL Editor (đã gộp vào schema.sql cho cài đặt mới). Chạy lại được.

create table if not exists public.site_content (
  key         text primary key,                 -- general, header, hero, about, capacity, sections, partners, certificates, footer
  data        jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;
