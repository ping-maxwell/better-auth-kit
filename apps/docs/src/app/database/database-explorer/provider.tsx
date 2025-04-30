"use client";
import type { BetterAuthDbSchema } from "better-auth/db";
import type { AuthClient, DatabaseStore } from "./types";
import { createAuthClient } from "better-auth/react";
import {
	createContext,
	type RefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Store, useStore } from "@tanstack/react-store";
import { SidebarProvider } from "@/components/ui/sidebar";
import { dbExplorerClientPlugin } from "@/lib/database-explorer-plugin";
import { DBSidebar } from "./sidebar";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { DBExplorer } from "./database";
import { cn } from "@/lib/utils";
import { SchemaExplorer } from "./schema";
import { APIError } from "better-auth";
import { useQueryState } from "nuqs";

export const DatabaseExplorerContext = createContext<{
	authClient: RefObject<AuthClient>;
	databaseStore: RefObject<Store<DatabaseStore>>;
	//@ts-ignore
}>(null);

export const useSchema = ({ authClient }: { authClient: AuthClient }) => {
	const [schema, setSchema] = useState<BetterAuthDbSchema | null>({});
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState<{
		code?: string | undefined;
		message?: string | undefined;
		status: number;
		statusText: string;
	} | null>(null);

	const ran = useRef(false);
	useEffect(() => {
		if (ran.current) return;
		ran.current = true;
		(async () => {
			const { data: schema, error } = await authClient.adapter.getSchema();
			setSchema(schema);
			setIsPending(false);
			if (error) {
				setError(error);
			}
		})();
	}, [authClient.adapter.getSchema]);

	return { schema, isPending, error };
};

export const DatabaseExplorerProvider = ({
	baseURL,
}: {
	baseURL: string;
}) => {
	const authClient = useRef(
		createAuthClient({
			baseURL,
			plugins: [dbExplorerClientPlugin],
		}),
	);
	const { schema, isPending, error } = useSchema({
		authClient: authClient.current,
	});
	console.log({ schema, isPending, error });

	const databaseStore = useRef(
		new Store<DatabaseStore>({
			database: {
				primary: schema || {},
				secondary: {},
			},
			selectedDatabase: "primary",
			selectedModel: Object.keys(schema || {})?.[0] || "",
		}),
	);

	const isApplied = useRef(false);
	if (schema && !isPending && !error && !isApplied.current) {
		isApplied.current = true;
		databaseStore.current.setState((x) => ({
			...x,
			database: { primary: schema },
			selectedModel: Object.keys(schema)[0],
		}));
	}

	if (isPending) {
		return (
			<div className="flex h-full w-full items-center justify-center flex-col gap-4">
				<h1 className="text-2xl font-bold">Loading schema</h1>
				<p className="text-muted-foreground">
					Please wait while we fetch the schema...
				</p>
			</div>
		);
	}

	if (!schema || error) {
		return (
			<div className="flex h-full w-full items-center justify-center flex-col gap-4">
				<h1 className="text-2xl font-bold">Error fetching schema</h1>
				<p className="text-muted-foreground">
					Something went wrong while fetching the schema. Please try again
					later.
					<br />
					{error?.message}
					<br />
					Have you tried disabling your ad blocker, or any other browser
					extensions that might be blocking the request?
				</p>
			</div>
		);
	}

	return (
		<DatabaseExplorerContext.Provider
			value={{
				authClient: authClient,
				databaseStore: databaseStore,
			}}
		>
			<DBExplorerUI />
		</DatabaseExplorerContext.Provider>
	);
};

export function useAuthClient() {
	const { authClient } = useContext(DatabaseExplorerContext);
	if (!authClient) {
		throw new Error("Auth client not found");
	}
	return authClient;
}

export function useDatabaseStore() {
	const { databaseStore } = useContext(DatabaseExplorerContext);
	if (!databaseStore) {
		throw new Error("Database store not found");
	}
	return databaseStore.current;
}

export const queryClient = new QueryClient();

function DBExplorerUI() {
	const dbStore = useDatabaseStore();
	const [selectedTab, setSelectedTab] = useQueryState("tab", {
		defaultValue: "database",
	});

	return (
		<QueryClientProvider client={queryClient}>
			<SidebarProvider>
				<DBSidebar />
				<main className="w-full h-screen overflow-hidden relative">
					<div
						className={cn(
							"w-full h-full flex flex-col absolute inset-0 transition-opacity duration-300 ease-in-out",
							selectedTab === "database"
								? "opacity-100 pointer-events-auto z-10"
								: "opacity-0 pointer-events-none z-0",
						)}
					>
						<DBExplorer />
					</div>
					<div
						className={cn(
							"w-full h-full absolute inset-0 transition-opacity duration-300 ease-in-out",
							selectedTab === "schema"
								? "opacity-100 pointer-events-auto z-10"
								: "opacity-0 pointer-events-none z-0",
						)}
					>
						<SchemaExplorer />
					</div>
				</main>
			</SidebarProvider>
		</QueryClientProvider>
	);
}
