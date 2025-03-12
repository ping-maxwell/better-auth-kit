import { MobileSidebarController } from "@/components/mobile-sidebar-controller";
import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
	subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={inter.className} suppressHydrationWarning>
			<body className="flex flex-col min-h-screen overflow-hidden">
				<MobileSidebarController>
					<RootProvider>
						{children}
						<Toaster />
					</RootProvider>
				</MobileSidebarController>
				<Analytics />
			</body>
		</html>
	);
}
