import { createAuthClient } from "better-auth/react";
import { DatabaseExplorerProvider } from "./provider";
import { dbExplorerClientPlugin } from "@/lib/database-explorer-plugin";

import "./overwrite.css";

export async function DatabaseExplorer({ baseURL }: { baseURL: string }) {
	const authClient = createAuthClient({
		baseURL,
		plugins: [dbExplorerClientPlugin],
	});

	const { data: schema } = await authClient.adapter.getSchema();

	if (!schema) {
		return (
			<div className="flex h-full w-full items-center justify-center flex-col gap-4">
				<h1 className="text-2xl font-bold">Error fetching schema</h1>
				<p className="text-muted-foreground">
					Something went wrong while fetching the schema. Please try again
					later.
				</p>
			</div>
		);
	}

	return <DatabaseExplorerProvider baseURL={baseURL} schema={schema} />;
}
