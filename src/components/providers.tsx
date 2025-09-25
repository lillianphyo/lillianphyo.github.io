'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './theme-provider'
import { I18nProvider } from './i18n-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
