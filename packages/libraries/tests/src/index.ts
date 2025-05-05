import type { BetterAuthClientPlugin, Session, User } from "better-auth";
import type { betterAuth } from "better-auth";
import {
	createAuthClient,
	type BetterFetchOption,
	type SuccessContext,
} from "better-auth/react";
import { getBaseURL } from "./utils/url";
import { getMigrations, getAdapter } from "better-auth/db";
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

	async function createTestUser() {
		if (config?.disableTestUser) {
			return;
		}
		const res = await auth.api.signUpEmail({
			body: testUser,
		});
		return res.user;
	}

	if (config?.shouldRunMigrations) {
		const { runMigrations } = await getMigrations({
			...auth.options,
			database: opts.database as any,
		});
		await runMigrations();
	}

	await createTestUser();

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

	return {
		client: client as unknown as ReturnType<typeof createAuthClient<C>>,
		testUser,
		signInWithTestUser,
		signInWithUser,
		cookieSetter: setCookieToHeader,
		customFetchImpl,
		sessionSetter,
		db: await getAdapter(auth.options),
	};
}
