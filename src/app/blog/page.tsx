import { getSortedPostsData } from '@/lib/blog';
import { BlogPreview } from '@/components/blog-preview';

export default async function BlogPage() {
  const posts = await getSortedPostsData();

  return (
    <div className="min-h-screen pt-20 bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Blog</h1>
          <BlogPreview posts={posts} />
        </div>
      </div>
    </div>
  );
}
