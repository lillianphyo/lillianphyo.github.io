import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { CloudflareAnalytics } from "@/components/cloudflare-analytics";
import { GoogleAnalytics } from "@/components/google-analytics";
import { PageViewTracker } from "@/components/page-view-tracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lillian Phyo - PhD Student & Full Stack Developer",
  description: "Portfolio website of Lillian Phyo, PhD student at Saitama University and Senior Full Stack Developer. Research, development, and innovation.",
  keywords: ["PhD", "Full Stack Developer", "Research", "Saitama University", "React", "Node.js"],
  authors: [{ name: "Lillian Phyo" }],
  openGraph: {
    title: "Lillian Phyo - PhD Student & Full Stack Developer",
    description: "Portfolio website showcasing research and development work",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <PageViewTracker />
          <Navigation />
          <main>{children}</main>
          <Footer />
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          <CloudflareAnalytics token={process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN} />
        </Providers>
      </body>
    </html>
  );
}
