"use client";

import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { useCallback, useState } from "react";
import type { Frontend, Backend } from "../reproduction";

export const ReproductionCommand = (options: {
	frontend?: Frontend;
	backend?: Backend;
}) => {
	const { frontend, backend } = options;
	const [flags, setFlags] = useState<string[]>([]);

	if (frontend) {
		setFlags((prev) => sortFlags([...prev, `--framework ${frontend}`]));
	}

	if (backend) {
		setFlags((prev) => sortFlags([...prev, `--backend ${backend}`]));
	}

	const sortFlags = useCallback((arr: string[]) => {
		return arr.sort((a, b) => {
			if (a.includes("frontend") && b.includes("backend")) return -1;
			if (a.includes("backend") && b.includes("frontend")) return 1;
			return 0;
		});
	}, []);

	return (
		<div className="w-full flex justify-center items-center mt-32">
			<div className="w-[800px]">
				<Tabs items={["pnpm", "bun", "npm"]}>
					<Tab value="pnpm">
						<CodeBlock>
							<Pre>
								pnpx @better-auth-kit/cli@latest repro {flags.join(" ")}
							</Pre>
						</CodeBlock>
					</Tab>
					<Tab value="bun">
						<CodeBlock>
							<Pre>
								bunx @better-auth-kit/cli@latest repro {flags.join(" ")}
							</Pre>
						</CodeBlock>
					</Tab>
					<Tab value="npm">
						<CodeBlock>
							<Pre>npx @better-auth-kit/cli@latest repro {flags.join(" ")}</Pre>
						</CodeBlock>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
};
