// Analytics types
export interface PageView {
  id: string
  path: string
  title: string
  timestamp: Date
  userAgent?: string
  referrer?: string
  ip?: string
}

// Extend Window interface for Cloudflare
declare global {
  interface Window {
    cfBeacon?: (action: string, data: unknown) => void
  }
}

export interface BlogView {
  id: string
  slug: string
  title: string
  timestamp: Date
  userAgent?: string
  referrer?: string
  ip?: string
  readTime?: number
}

// In-memory storage for development (replace with database in production)
const pageViews: PageView[] = []
const blogViews: BlogView[] = []

// Generate UUID that works across all environments
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export class Analytics {
  // Track page views
  static async trackPageView(data: Omit<PageView, 'id' | 'timestamp'>) {
    const view: PageView = {
      id: generateUUID(),
      timestamp: new Date(),
      ...data,
    }
    
    pageViews.push(view)
    
    // Send to Google Analytics
    this.sendToGoogleAnalytics('page_view', {
      path: data.path,
      title: data.title,
    })

    // Cloudflare Analytics is handled by their beacon script
    
    return view
  }

  // Track blog post views with read time
  static async trackBlogView(data: Omit<BlogView, 'id' | 'timestamp'>) {
    const view: BlogView = {
      id: generateUUID(),
      timestamp: new Date(),
      ...data,
    }
    
    blogViews.push(view)
    
    // Send to Google Analytics
    this.sendToGoogleAnalytics('blog_view', {
      slug: data.slug,
      title: data.title,
      readTime: data.readTime,
    })

    // Cloudflare Analytics is handled by their beacon script
    
    return view
  }

  // Get blog post read count
  static getBlogReadCount(slug: string): number {
    return blogViews.filter(view => view.slug === slug).length
  }

  // Get popular blog posts
  static getPopularBlogPosts(limit: number = 5) {
    const counts = blogViews.reduce((acc, view) => {
      acc[view.slug] = (acc[view.slug] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts)
      .map(([slug, count]) => ({
        slug,
        count,
        title: blogViews.find(v => v.slug === slug)?.title || slug,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  // Get analytics data
  static getAnalytics() {
    return {
      totalPageViews: pageViews.length,
      totalBlogViews: blogViews.length,
      uniqueBlogPosts: new Set(blogViews.map(v => v.slug)).size,
      popularPosts: this.getPopularBlogPosts(),
      recentViews: blogViews.slice(-10).reverse(),
    }
  }

  // Send data to Google Analytics
  private static sendToGoogleAnalytics(event: string, data: { title?: string; slug?: string; path?: string; readTime?: number }) {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('event', event, {
      event_category: 'blog',
      event_label: data.title || data.slug,
      custom_parameter_1: data.path || data.slug,
      custom_parameter_2: data.readTime || 0,
    })
  }

  // Cloudflare Analytics is handled by their beacon script automatically
}
