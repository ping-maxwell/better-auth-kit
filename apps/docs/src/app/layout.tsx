import { MobileSidebarController } from "@/components/mobile-sidebar-controller";
import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import { Suspense, type ReactNode } from "react";
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
      </head>
      <body className="flex flex-col min-h-screen overflow-hidden bg-background">
        <RootProvider
          theme={{
            enabled: true,
            attribute: "class",
          }}
        >
          <Suspense>
            <MobileSidebarController>
              {children}
              <Toaster />
            </MobileSidebarController>
            <Analytics />
          </Suspense>
        </RootProvider>
      </body>
    </html>
  );
}
