import { createMetadata } from "@/lib/metadata";
import { DatabaseExplorer } from "./database-explorer";
import type { Metadata } from "next";

export default function Home() {
	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<DatabaseExplorer baseURL="http://localhost:3572" />
		</div>
	);
}

export const metadata: Metadata = createMetadata({
	title: "Database Explorer",
	description: "A Better-Auth powered database explorer and schema visualizer.",
});
