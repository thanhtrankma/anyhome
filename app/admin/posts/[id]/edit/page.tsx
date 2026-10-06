import { notFound } from "next/navigation";

import { PostForm } from "@/components/admin/post-form";
import { db } from "@/lib/store";

export const metadata = { title: "Chỉnh sửa bài viết" };

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]/edit">) {
  const { id } = await params;
  const post = db().posts.find((p) => p.id === id);
  if (!post) notFound();
  return <PostForm post={post} />;
}
