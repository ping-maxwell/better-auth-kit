import type {
	BetterAuthClientPlugin,
	Session,
	User,
	APIError,
} from "better-auth";
import type { betterAuth } from "better-auth";
import {
	createAuthClient,
	type BetterFetchOption,
	type SuccessContext,
} from "better-auth/react";
import { getBaseURL } from "./utils/url";
import { getMigrations, getAdapter, getSchema } from "better-auth/db";
import { parseSetCookieHeader, setCookieToHeader } from "better-auth/cookies";

interface ClientOptions {
	fetchOptions?: BetterFetchOption;
	plugins?: BetterAuthClientPlugin[];
	baseURL?: string;
	basePath?: string;
	disableDefaultFetchPlugins?: boolean;
}

export async function getTestInstance<C extends ClientOptions>(
	auth_: { api: any; options: any } & Record<string, any>,
	config?: {
		clientOptions?: C;
		port?: number;
		disableTestUser?: boolean;
		testUser?: Partial<User>;
		shouldRunMigrations?: boolean;
	},
) {
	const auth = auth_ as ReturnType<typeof betterAuth>;
	const opts = auth.options;

	const testUser = {
		email: "test@test.com",
		password: "test123456",
		name: "test user",
		...config?.testUser,
	};

	if (config?.shouldRunMigrations) {
		const { runMigrations } = await getMigrations({
			...auth.options,
			database: opts.database as any,
		});
		await runMigrations();
	}

	async function signUpWithTestUser() {
		if (config?.disableTestUser) {
			throw new Error("Test user is disabled");
		}
		const headers = new Headers();
		const setCookie = (name: string, value: string) => {
			const current = headers.get("cookie");
			headers.set("cookie", `${current || ""}; ${name}=${value}`);
		};
		//@ts-expect-error
		const { data, error } = await client.signUp.email({
			email: testUser.email,
			password: testUser.password,
			name: testUser.name,
			fetchOptions: {
				//@ts-expect-error
				onSuccess(context) {
					const header = context.response.headers.get("set-cookie");
					const cookies = parseSetCookieHeader(header || "");
					const signedCookie = cookies.get("better-auth.session_token")?.value;
					headers.set("cookie", `better-auth.session_token=${signedCookie}`);
				},
			},
		});
		if (error) {
			console.error(error);
			throw error;
		}
		return {
			session: data.session as Session,
			user: data.user as User,
			headers,
			setCookie,
		};
	}
	async function signInWithTestUser() {
		if (config?.disableTestUser) {
			throw new Error("Test user is disabled");
		}
		const headers = new Headers();
		const setCookie = (name: string, value: string) => {
			const current = headers.get("cookie");
			headers.set("cookie", `${current || ""}; ${name}=${value}`);
		};
		//@ts-expect-error
		const { data, error } = await client.signIn.email({
			email: testUser.email,
			password: testUser.password,
			fetchOptions: {
				//@ts-expect-error
				onSuccess(context) {
					const header = context.response.headers.get("set-cookie");
					const cookies = parseSetCookieHeader(header || "");
					const signedCookie = cookies.get("better-auth.session_token")?.value;
					headers.set("cookie", `better-auth.session_token=${signedCookie}`);
				},
			},
		});
		return {
			session: data.session as Session,
			user: data.user as User,
			headers,
			setCookie,
		};
	}
	async function signInWithUser(email: string, password: string) {
		const headers = new Headers();
		//@ts-expect-error
		const { data } = await client.signIn.email({
			email,
			password,
			fetchOptions: {
				//@ts-expect-error
				onSuccess(context) {
					const header = context.response.headers.get("set-cookie");
					const cookies = parseSetCookieHeader(header || "");
					const signedCookie = cookies.get("better-auth.session_token")?.value;
					headers.set("cookie", `better-auth.session_token=${signedCookie}`);
				},
			},
		});
		return {
			res: data as {
				user: User;
				session: Session;
			},
			headers,
		};
	}

	const customFetchImpl = async (
		url: string | URL | Request,
		init?: RequestInit,
	) => {
		const req = new Request(url.toString(), init);
		return auth.handler(req);
	};

	function sessionSetter(headers: Headers) {
		return (context: SuccessContext) => {
			const header = context.response.headers.get("set-cookie");
			if (header) {
				const cookies = parseSetCookieHeader(header || "");
				const signedCookie = cookies.get("better-auth.session_token")?.value;
				headers.set("cookie", `better-auth.session_token=${signedCookie}`);
			}
		};
	}

	const client = createAuthClient({
		...(config?.clientOptions as C extends undefined ? {} : C),
		baseURL: getBaseURL(
			opts.baseURL || "http://localhost:" + (config?.port || 3000),
			opts.basePath || "/api/auth",
		),
		fetchOptions: {
			customFetchImpl,
		},
	});

	async function resetDatabase(
		tables: string[] = ["session", "account", "verification", "user"],
	) {
		const ctx = await auth.$context;
		const adapter = ctx.adapter;
		for (const modelName of tables) {
			const allRows = await adapter.findMany<{ id: string }>({
				model: modelName,
				limit: 1000,
			});
			for (const row of allRows) {
				await adapter.delete({
					model: modelName,
					where: [{ field: "id", value: row.id }],
				});
			}
		}
		console.log("Database successfully reset.");
	}

	return {
		client: client as unknown as ReturnType<typeof createAuthClient<C>>,
		testUser,
		signInWithTestUser,
		signInWithUser,
		cookieSetter: setCookieToHeader,
		customFetchImpl,
		sessionSetter,
		db: await getAdapter(auth.options),
		resetDatabase,
		signUpWithTestUser,
	};
}

export type Success<T> = {
	data: T;
	error: null;
};

export type Failure<E> = {
	data: null;
	error: E;
};

export type Result<T, E = APIError> = Success<T> | Failure<E>;

export async function tryCatch<T, E = APIError>(
	promise: Promise<T>,
): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
}
