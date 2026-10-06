import { PageHeader } from "@/components/admin/page-header";
import { PostsTable } from "@/components/admin/posts-table";
import { getPosts } from "@/lib/store";

export const metadata = { title: "Bài viết & Tin tức" };

export default async function AdminPostsPage() {
  const posts = await getPosts();
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <>
      <PageHeader title="Bài viết & Tin tức" description={`${posts.length} bài viết · ${drafts} bản nháp`} />
      <PostsTable posts={posts} />
    </>
  );
}
