import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="overflow-hidden w-screen h-screen">
			<Navbar />
			{children}
		</div>
	);
}
