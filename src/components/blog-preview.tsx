'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

interface BlogPreviewProps {
  posts: BlogPost[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  const { t } = useTranslation();
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
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('blog.title')}
            </h2>
            <Link href="/blog">
              <Button variant="outline">
                View All Posts
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <Card key={post.slug} className="bg-card text-card-foreground border border-border hover:shadow-lg transition-shadow hover-lift">
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-foreground">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
