import { getPostData, getAllPostSlugs } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BlogShare } from '@/components/blog-share';
import { Comments } from '@/components/comments';
import { BlogAnalytics } from '@/components/blog-analytics';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });

  return (
    <section className="py-20 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" asChild>
              <Link href="/blog" className="inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <div className="rounded-lg shadow-sm bg-card text-card-foreground border border-border">
            <article className="p-6 md:p-10">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-card-foreground">{post.title}</h1>

                <div className="flex items-center gap-6 text-card-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <BlogAnalytics slug={slug} title={post.title} />
              </header>

              <div 
                className="prose prose-lg max-w-none text-card-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Share this article</span>
                <BlogShare title={post.title} url={`https://lillianphyo.dev/blog/${slug}`} />
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Comments />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
