'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Analytics } from '@/lib/analytics'
import { useGoogleAnalytics } from './google-analytics'

export function PageViewTracker() {
  const pathname = usePathname()
  const { trackPageView } = useGoogleAnalytics()

  useEffect(() => {
    // Track page view with our analytics system
    Analytics.trackPageView({
      path: pathname,
      title: document.title,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    })

    // Track with Google Analytics
    trackPageView(window.location.href, document.title)
  }, [pathname, trackPageView])

  return null
}
