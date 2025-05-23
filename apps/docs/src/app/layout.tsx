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
		template: "%s | Better Auth Kit",
		default: "Better Auth Kit",
	},
	description: "A handy collection of plugins, adapters, libraries and more.",
	metadataBase: baseUrl,
});

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={inter.className} suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon/favicon.ico" sizes="any" />
				<script
					src={"https://app.databuddy.cc/databuddy.js"}
					data-client-id={"z0XffqWWczdDDQEeVXS2b"}
					data-api-url={"https://basket.databuddy.cc"}
					data-track-screen-views="true"
					data-track-performance="true"
					data-track-web-vitals="false"
					data-track-errors="true"
					// data-enable-batching="true"
					// data-batch-size="20"
					// data-batch-timeout="5000"
					// strategy="afterInteractive"
					defer
				/>
			</head>
			<body className="flex flex-col min-h-screen overflow-hidden bg-background text-foreground antialiased">
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					<RootProvider
						theme={{
							enabled: false,
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
				</ThemeProvider>
			</body>
		</html>
	);
}
