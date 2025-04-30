import { DatabaseExplorerProvider } from "./provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./overwrite.css";

export async function DatabaseExplorer({ baseURL }: { baseURL: string }) {
	return (
		<NuqsAdapter>
			<DatabaseExplorerProvider baseURL={baseURL} />
		</NuqsAdapter>
	);
}
