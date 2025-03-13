import type { Metadata } from "next/types"

export function createMetadata(override: Metadata): Metadata {
    return {
        ...override,
        openGraph: {
            title: override.title ?? undefined,
            description: override.description ?? undefined,
            url: "https://better-auth-kit.com",
            // images: "https://better-auth-kit.com/banner.png",
            siteName: "Better Auth Kit",
            ...override.openGraph
        },
        twitter: {
            card: "summary_large_image",
            creator: "@ping-maxwell",
            title: override.title ?? undefined,
            description: override.description ?? undefined,
            // images: "https://better-auth-kit.com/banner.png",
            ...override.twitter
        }
    }
}

export const baseUrl =
    process.env.NODE_ENV === "development"
        ? new URL("http://localhost:3001")
        : new URL(`https://${process.env.VERCEL_URL!}`)