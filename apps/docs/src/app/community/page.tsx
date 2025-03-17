import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Github, MessageSquare, ArrowUpRight } from "lucide-react";
import {
	NpmPackageStats,
	type PackageData,
} from "./components/npm-package-stats";
import { CommunityHero } from "./components/community-hero";
import { Navbar } from "@/components/navbar";
import { getNPMPackageDownloads } from "./get-npm-downloads";
import { getNpmPackageLatestVersion } from "./get-npm-version";

export default async function CommunityPage() {
	let packages: PackageData[] = [
		{
			name: "@better-auth-kit/waitlist",
			description: "A waitlist plugin for Better Auth",
			downloads: 0,
			version: "0",
			docs: "https://better-auth-kit.com/docs/plugins/waitlist",
		},
		{
			name: "@better-auth-kit/legal-consent",
			description: "A legal consent plugin for Better Auth",
			downloads: 0,
			version: "0",
			docs: "https://better-auth-kit.com/docs/plugins/legal-consent",
		},
		{
			name: "@better-auth-kit/convex",
			description: "A Convex adapter for Better Auth",
			downloads: 0,
			version: "0",
			docs: "https://better-auth-kit.com/docs/adapters/convex",
		},
		{
			name: "@better-auth-kit/reverify",
			description: "A plugin to reverify a user's identity",
			downloads: 0,
			version: "0",
			docs: "https://better-auth-kit.com/docs/plugins/reverify",
		},
		{
			name: "better-auth-dashboard",
			description: "Admin dashboard for Better Auth",
			downloads: 0,
			version: "0",
			docs: "https://better-auth-kit.com/docs/libraries/admin-dashboard",
		},
		{
			name: "@better-auth-kit/tests",
			description:
				"A collection of utilities to help you test your Better-Auth plugins",
			downloads: 0,
			version: "0",
			docs: "https://better-auth-kit.com/docs/libraries/tests",
		},
		{
			name: "@better-auth-kit/seed",
			description: "A seeding tool for Better Auth",
			downloads: 0,
			version: "0",
			docs: "https://better-auth-kit.com/docs/cli/seed",
		},
		{
			name: "@better-auth-kit/cli",
			description: "The CLI for Better Auth Kit",
			downloads: 0,
			version: "0",
			docs: "https://better-auth-kit.com/docs/cli/introduction",
		},
	];

	for (const pkg of packages) {
		const npmStat = await getNPMPackageDownloads(pkg.name);
		packages[packages.indexOf(pkg)].downloads = npmStat.downloads;

		const latestVersion = await getNpmPackageLatestVersion(pkg.name);
		packages[packages.indexOf(pkg)].version = latestVersion.version;
	}

	packages = packages.sort((a, b) => b.downloads - a.downloads);

	return (
		<div className="w-screen h-screen">
			<Navbar />
			<div className="w-full h-[calc(100vh-65px)] mt-[56px] overflow-y-auto">
				<div className="container mx-auto py-32 px-4 md:px-6">
					<CommunityHero />

					<div className="flex justify-center items-center flex-wrap gap-10 mt-24">
						<Card className="flex flex-col w-[400px] h-[320px]">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Github className="h-5 w-5" />
									GitHub Repository
								</CardTitle>
								<CardDescription>
									Our open-source project welcomes all contributors.
								</CardDescription>
							</CardHeader>
							<CardContent className="flex justify-center items-center h-full">
								<Github
									width={"4rem"}
									height={"4rem"}
									className="opacity-50 scale-150"
								/>
							</CardContent>
							<CardFooter>
								<Button className="w-full" asChild variant={"outline"}>
									<Link
										href="https://github.com/ping-maxwell/better-auth-kit"
										target="_blank"
									>
										View on GitHub
										<ArrowUpRight />
									</Link>
								</Button>
							</CardFooter>
						</Card>

						<Card className="flex flex-col w-[400px] h-[320px]">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MessageSquare className="h-5 w-5" />
									Discord Community
								</CardTitle>
								<CardDescription>
									Join our Discord server to chat with us!
								</CardDescription>
							</CardHeader>
							<CardContent className="flex justify-center items-center h-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="4em"
									height="4em"
									viewBox="0 0 24 24"
									className="scale-150 opacity-50"
								>
									<path
										fill="currentColor"
										d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"
									></path>
								</svg>
							</CardContent>
							<CardFooter>
								<Button className="w-full" asChild variant={"outline"}>
									<Link href="https://discord.gg/v5w4CTCnaf" target="_blank">
										Join Discord
										<ArrowUpRight />
									</Link>
								</Button>
							</CardFooter>
						</Card>
					</div>
					<div className="mt-32">
						<h2 className="text-3xl font-bold mb-8">NPM Package Statistics</h2>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{packages.map((pkg) => (
								<NpmPackageStats key={pkg.name} package={pkg} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
