import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Better Auth Kit",
	description:
		"A handy collection of plugins, adapters, libraries and more for Better Auth!",
	openGraph: {
		title: "Better Auth Kit",
		description:
			"A handy collection of plugins, adapters, libraries and more for Better Auth!",
		images: [
			{
				url: "https://better-auth-kit.vercel.app/misc/meta_img.png",
				width: 1000,
				height: 669,
				alt: "Better Auth Kit",
			},
		],
		siteName: "Better Auth Kit",
	},
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="overflow-hidden w-screen h-screen">
			<Navbar />
			{children}
		</div>
	);
}
