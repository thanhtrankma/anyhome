import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site/site-shell";
import { Badge } from "@/components/ui/badge";
import { postCategoryLabels } from "@/lib/data";
import { getPublishedPosts, getSettings } from "@/lib/store";

const findPost = (slug: string) => getPublishedPosts().find((p) => p.slug === slug);

export async function generateMetadata({ params }: PageProps<"/tin-tuc/[slug]">): Promise<Metadata> {
  const post = findPost((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, openGraph: { images: [post.cover] } };
}

export default async function PostPage({ params }: PageProps<"/tin-tuc/[slug]">) {
  const post = findPost((await params).slug);
  if (!post) notFound();

  return (
    <SiteShell settings={getSettings()} solidHeader>
      <article className="pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/#news" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-navy-900">
            <ArrowLeft className="size-4" /> Tin tức
          </Link>
          <Badge className="mt-6 bg-gold-100 text-gold-800">{postCategoryLabels[post.category]}</Badge>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] font-semibold text-navy-900 sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {post.author} · {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="relative mx-auto mt-10 aspect-[21/9] max-w-5xl overflow-hidden sm:rounded-2xl">
          <Image src={post.cover} alt={post.title} fill preload sizes="(min-width:1024px) 1024px, 100vw" className="object-cover" />
        </div>
        {/* Nội dung đã được sanitize khi lưu (lib/sanitize.ts) */}
        <div className="prose-anyhome mx-auto mt-12 max-w-3xl px-4 sm:px-6" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </SiteShell>
  );
}
