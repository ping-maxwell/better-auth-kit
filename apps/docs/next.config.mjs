import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	devIndicators: {
		appIsrStatus: false,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.shields.io",
			},
		],
	},
};

export default withMDX(config);
