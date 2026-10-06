import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { RailHint } from "@/components/site/mobile-ui";
import { SectionHeading, StaggerGroup, StaggerItem } from "@/components/site/motion";
import { postCategoryLabels } from "@/lib/data";
import type { Post } from "@/lib/types";

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";

export function News({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section id="news" className="bg-white py-14 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Tin tức & Kiến thức" title="Câu chuyện từ công trường" />
        <StaggerGroup className="rail mt-8 sm:mt-12 md:grid-cols-3 md:gap-8">
          {posts.slice(0, 3).map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/tin-tuc/${post.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                  <Image src={post.cover} alt={post.title} fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="mt-5 text-xs font-semibold tracking-widest text-gold-700 uppercase">
                  {postCategoryLabels[post.category]} · {fmt(post.publishedAt)}
                </p>
                <h3 className="mt-2 line-clamp-2 text-lg leading-snug font-bold text-navy-900 transition-colors group-hover:text-gold-700">{post.title}</h3>
                <p className="mt-2 line-clamp-2 hidden text-sm text-muted-foreground sm:block">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-900">
                  Đọc tiếp <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <RailHint count={Math.min(posts.length, 3)} />
      </div>
    </section>
  );
}
