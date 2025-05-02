import type { BetterAuthDbSchema } from "better-auth/db";
import { createAuthClient } from "better-auth/react";
import { dbExplorerClientPlugin } from "@/lib/database-explorer-plugin";

export interface DatabaseStore {
	/**
	 * {
	 *  database: {
	 *      model: {
	 *          field: value
	 *      }
	 *  }
	 * }
	 *
	 * Eg:
	 *
	 * {
	 *  primary: {
	 *      user: {
	 *          id: 1,
	 *          name: "John Doe",
	 *          email: "john@doe.com"
	 *      }
	 *  }
	 * }
	 */
	database: Record<string, BetterAuthDbSchema>;
	selectedDatabase: string;
	selectedModel: string;
}

const x = createAuthClient({
	plugins: [dbExplorerClientPlugin],
});

export type AuthClient = typeof x;
