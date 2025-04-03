import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { Reproduction } from "./reproduction";

export const metadata: Metadata = {
	title: "Reproduction",
	description: "Recreate a Better Auth issue in a fresh project.",
};

export default function ReproductionPage() {
	return (
		<div className="w-screen h-screen relative">
			<Navbar />
			<Reproduction />
		</div>
	);
}
