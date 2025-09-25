'use client'

import { Eye, Clock } from 'lucide-react'
import { useBlogAnalytics } from '@/hooks/use-blog-analytics'

interface BlogAnalyticsProps {
  slug: string
  title: string
}

export function BlogAnalytics({ slug, title }: BlogAnalyticsProps) {
  const { readCount, readTime } = useBlogAnalytics({ slug, title })

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>{readCount} views</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>{Math.floor(readTime / 60)}m {readTime % 60}s</span>
      </div>
    </div>
  )
}
