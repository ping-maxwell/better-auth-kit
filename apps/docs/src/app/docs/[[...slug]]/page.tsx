import { source } from "@/lib/source";
import {
	DocsPage,
	DocsBody,
	DocsDescription,
	DocsTitle,
} from "fumadocs-ui/page";
import { notFound, redirect } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { GithubUser } from "@/components/github-user";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Comprehensive } from "@/components/comprehensive";
import { DatabaseTable } from "@/components/database-table";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Button } from "@/components/ui/button";
import { GithubButton } from "@/components/github-button";
import { NpmButton } from "@/components/npm-button";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { File, Folder, Files } from "fumadocs-ui/components/files";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export default async function Page(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;

	if (!params.slug || params.slug.length === 0) {
		return redirect("/docs/introduction");
	}

	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;

	return (
		<DocsPage
			toc={page.data.toc}
			full={page.data.full}
			editOnGithub={{
				owner: "ping-maxwell",
				repo: "better-auth-kit",
				sha: "main",
				path: `apps/docs/content/docs/${params.slug.join("/")}.mdx`,
			}}
			tableOfContent={{
				style: "clerk",
				header: <div className="w-10 h-4"></div>,
			}}
			footer={{
				enabled: true,
				component: <div className="w-10 h-4" />,
			}}
		>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX
					components={{
						...defaultMdxComponents,
						GithubUser,
						Tab,
						Tabs,
						Comprehensive,
						DatabaseTable,
						Step,
						Steps,
						Button,
						GithubButton,
						NpmButton,
						Accordion,
						Accordions,
						File,
						Folder,
						Files,
					}}
				/>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return createMetadata({
		title: `${page.data.title} | Better Auth Kit`,
		description: page.data.description,
		openGraph: {
			url: absoluteUrl(`docs/${params.slug}`),
			title: page.data.title,
			description: page.data.description,
		},
		twitter: {
			card: "summary_large_image",
			creator: "@ping-maxwell",
			title: page.data.title,
			description: page.data.description,
		},
	});
}

function absoluteUrl(path: string) {
	return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
