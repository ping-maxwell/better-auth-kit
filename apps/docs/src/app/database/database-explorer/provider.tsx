"use client";
import type { BetterAuthDbSchema } from "better-auth/db";
import type { AuthClient, DatabaseStore } from "./types";
import { createAuthClient } from "better-auth/react";
import { createContext, type RefObject, useContext, useRef } from "react";
import { Store, useStore } from "@tanstack/react-store";
import { SidebarProvider } from "@/components/ui/sidebar";
import { dbExplorerClientPlugin } from "@/lib/database-explorer-plugin";
import { DBSidebar } from "./sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DBExplorer } from "./database";
import { cn } from "@/lib/utils";
import { SchemaExplorer } from "./schema";

export const DatabaseExplorerContext = createContext<{
	authClient: RefObject<AuthClient>;
	databaseStore: RefObject<Store<DatabaseStore>>;
	//@ts-ignore
}>(null);

export const DatabaseExplorerProvider = ({
	baseURL,
	schema,
}: {
	baseURL: string;
	schema: BetterAuthDbSchema;
}) => {
	const authClient = useRef(
		createAuthClient({
			baseURL,
			plugins: [dbExplorerClientPlugin],
		}),
	);
	const databaseStore = useRef(
		new Store<DatabaseStore>({
			database: {
				primary: schema,
				secondary: {},
			},
			selectedTab: "database",
			selectedDatabase: "primary",
			selectedModel: Object.keys(schema)[0],
		}),
	);
	console.log("DatabaseExplorerProvider");

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
	const selectedTab = useStore(dbStore, (st) => st.selectedTab);

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
