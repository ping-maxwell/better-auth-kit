import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { Navbar } from "@/components/navbar";
import { ComprehensiveProvider } from "@/components/comprehensive-provider";
import { Sidebar } from "./Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description: "The documentation for Better Auth Kit",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
		<DocsLayout
			tree={source.pageTree}
			{...baseOptions}
			nav={{
				enabled: false,
				component: <Navbar />,
			}}
			sidebar={{
				className: "h-[calc(100vh_-_64px)]! mt-[64px]",
				enabled: false,
			}}
		>
			<ComprehensiveProvider>
				<Navbar />
				<Sidebar />
				<div className="w-[calc(100vw_-_var(--fd-sidebar-width))] ml-[var(--fd-sidebar-width)] h-[calc(100vh_-_64px)] mt-[64px] flex relative overflow-y-auto">
					{children}
				</div>
			</ComprehensiveProvider>
		</DocsLayout>
	);
}
