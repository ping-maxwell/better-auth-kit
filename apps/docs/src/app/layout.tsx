import { MobileSidebarController } from "@/components/mobile-sidebar-controller";
import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { baseUrl, createMetadata } from "@/lib/metadata";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = createMetadata({
  title: {
    template: "%s | Better Auth UI",
    default: "Better Auth UI",
  },
  description:
    "UI components for the most comprehensive authentication library for TypeScript.",
  metadataBase: baseUrl,
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: To apply theme immediately without flash.
          dangerouslySetInnerHTML={{
            __html: `
                    try {
                      if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        document.querySelector('meta[name="theme-color"]').setAttribute('content')
						}
						
						} catch (_) {}
						console.log('dark')
                  `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen overflow-hidden bg-background">
        <RootProvider
          theme={{
			enabled: true,
            attribute: "class",
          }}
        >
          {/* <MobileSidebarController> */}
            {/* {children} */}
            <Toaster />
          {/* </MobileSidebarController> */}
          <Analytics />
        </RootProvider>
      </body>
    </html>
  );
}
