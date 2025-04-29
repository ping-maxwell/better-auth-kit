import { DatabaseExplorerProvider } from "./provider";
import "./overwrite.css";

export async function DatabaseExplorer({ baseURL }: { baseURL: string }) {
	return <DatabaseExplorerProvider baseURL={baseURL} />;
}
