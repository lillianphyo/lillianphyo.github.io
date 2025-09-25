'use client'

import Script from 'next/script'

interface CloudflareAnalyticsProps {
  token?: string
}

export function CloudflareAnalytics({ token }: CloudflareAnalyticsProps) {
  // Use the provided token or fallback to environment variable
  const analyticsToken = token || process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN

  if (!analyticsToken) {
    return null
  }

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({
        token: analyticsToken,
        spa: true
      })}
      defer
      strategy="afterInteractive"
    />
  )
}
