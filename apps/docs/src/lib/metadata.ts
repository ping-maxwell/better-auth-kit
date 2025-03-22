import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
	return {
		...override,
		keywords: [
			"better auth",
			"auth",
			"authentication",
			"authorization",
			"better-auth",
			"kit",
			"auth kit",
			"better auth kit",
		],
		openGraph: {
			title: override.title ?? undefined,
			description:
				override.description ??
				"A handy collection of plugins, adapters, libraries and more for Better Auth!",
			url: "https://better-auth-kit.com",
			images: "https://better-auth-kit.com/misc/meta_img.png",
			siteName: "Better Auth Kit",
			...override.openGraph,
		},
		twitter: {
			card: "summary_large_image",
			creator: "@ping-maxwell",
			title: override.title ?? undefined,
			description:
				override.description ??
				"A handy collection of plugins, adapters, libraries and more for Better Auth!",
			images: "https://better-auth-kit.com/misc/meta_img.png",
			...override.twitter,
		},
	};
}

export const baseUrl =
	process.env.NODE_ENV === "development"
		? new URL("http://localhost:3001")
		: new URL(`https://${process.env.VERCEL_URL!}`);
