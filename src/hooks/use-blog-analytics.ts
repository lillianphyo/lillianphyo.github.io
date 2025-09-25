'use client'

import { useEffect, useRef, useState } from 'react'
import { Analytics } from '@/lib/analytics'
import { useGoogleAnalytics } from '@/components/google-analytics'

interface UseBlogAnalyticsProps {
  slug: string
  title: string
}

export function useBlogAnalytics({ slug, title }: UseBlogAnalyticsProps) {
  const [readCount, setReadCount] = useState(0)
  const [readTime, setReadTime] = useState(0)
  const startTimeRef = useRef<number>(Date.now())
  const hasTrackedRef = useRef(false)
  const { trackEvent } = useGoogleAnalytics()

  // Track initial page view
  useEffect(() => {
    if (hasTrackedRef.current) return
    
    Analytics.trackBlogView({
      slug,
      title,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    }).then(() => {
      hasTrackedRef.current = true
      setReadCount(Analytics.getBlogReadCount(slug))
      
      // Track with Google Analytics
      trackEvent('blog_view', 'engagement', title)
    })
  }, [slug, title])

  // Track read time
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setReadTime(timeSpent)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Track when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const finalReadTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
      
      // Update the last blog view with final read time
      Analytics.trackBlogView({
        slug,
        title,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        readTime: finalReadTime,
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [slug, title])

  return {
    readCount,
    readTime,
  }
}
