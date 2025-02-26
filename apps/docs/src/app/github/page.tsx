import type { Metadata } from "next";
import Redirect from "./redirect";

export const metadata: Metadata = {
  title: "Better-Auth-Kit 📦 Github",
  description: "The Better-Auth-Kit GitHub repository.",
  openGraph: {
    title: "Better-Auth-Kit 📦 Github",
    description: "The Better-Auth-Kit GitHub repository.",
    url: "https://github.com/ping-maxwell/better-auth-kit",
    siteName: "Better Auth Kit",
    images: [
      {
        url: "https://github.com/ping-maxwell/better-auth-kit/blob/main/assets/banner/1600x600.png?raw=true",
        width: 1600,
        height: 600,
        alt: "Better-Auth-Kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Better-Auth-Kit 📦 Github",
    description: "The Better-Auth-Kit GitHub repository.",
    site: "@ping_maxwell",
    images: [
      {
        url: "https://github.com/ping-maxwell/better-auth-kit/blob/main/assets/banner/1600x600.png?raw=true",
        width: 1600,
        height: 600,
        alt: "Better-Auth-Kit",
      },
    ],
  },
};

export default async function Page() {
  return <Redirect />;
}
