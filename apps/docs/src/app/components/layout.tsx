import type { Metadata } from "next";
import { LayoutClient } from "./layout-client";

export const metadata: Metadata = {
	title: "Components",
	description: "UI components from Better Auth Kit",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <LayoutClient>{children}</LayoutClient>;
}
