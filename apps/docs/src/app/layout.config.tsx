import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
	nav: {
		title: (
			<>
				<Image
					src="/logo/500x500.png"
					alt="Better Auth Kit"
					width={32}
					height={32}
				/>
				Better Auth Kit
			</>
		),
		component: (
			<div className="flex flex-col items-center justify-center h-10 w-screen">
				<Image
					src="/logo/500x500.png"
					alt="Better Auth Kit"
					width={32}
					height={32}
				/>
				Better Auth Kit
			</div>
		),
	},
	links: [
		{
			text: "Documentation",
			url: "/docs",
			active: "nested-url",
		},
	],
};
