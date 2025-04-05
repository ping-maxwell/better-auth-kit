import { afterAll } from "vitest";
import type {
	BetterAuthOptions,
	ClientOptions,
	Session,
	User,
} from "better-auth";
import fs from "node:fs/promises";
import { generateRandomString } from "./utils/generate-random-string";
import { Kysely, MysqlDialect, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { createPool } from "mysql2/promise";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins/bearer";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import BetterDatabase, { type Database } from "better-sqlite3";
import { createAuthClient, type SuccessContext } from "better-auth/react";
import { getBaseURL } from "./utils/url";
import { getMigrations, getAdapter } from "better-auth/db";
import { parseSetCookieHeader, setCookieToHeader } from "better-auth/cookies";

export async function getTestInstance<
	O extends Partial<BetterAuthOptions>,
	C extends ClientOptions,
>(
	options?: O,
	config?: {
		clientOptions?: C;
		port?: number;
		disableTestUser?: boolean;
		testUser?: Partial<User>;
		adminUser?: Partial<User>;
		testWith?: "sqlite" | "postgres" | "mongodb" | "mysql";
	},
) {
	const testWith = config?.testWith || "sqlite";
	/**
	 * create db folder if not exists
	 */
	await fs.mkdir(".db", { recursive: true });
	const randomStr = generateRandomString(4, "a-z");
	const dbName = `./.db/test-${randomStr}.db`;

	const postgres = new Kysely({
		dialect: new PostgresDialect({
			pool: new Pool({
				connectionString: "postgres://user:password@localhost:5432/better_auth",
			}),
		}),
	});

	const mysql = new Kysely({
		dialect: new MysqlDialect(
			createPool("mysql://user:password@localhost:3306/better_auth"),
		),
	});

	async function mongodbClient() {
		const dbClient = async (connectionString: string, dbName: string) => {
			const client = new MongoClient(connectionString);
			await client.connect();
			const db = client.db(dbName);
			return db;
		};
		const db = await dbClient("mongodb://127.0.0.1:27017", "better-auth");
		return db;
	}

	const opts = {
		socialProviders: {
			github: {
				clientId: "test",
				clientSecret: "test",
			},
			google: {
				clientId: "test",
				clientSecret: "test",
			},
		},
		secret: "better-auth.secret",
		database:
			testWith === "postgres"
				? { db: postgres, type: "postgres" }
				: testWith === "mongodb"
					? mongodbAdapter(await mongodbClient())
					: testWith === "mysql"
						? { db: mysql, type: "mysql" }
						: new BetterDatabase(dbName),
		emailAndPassword: {
			enabled: true,
		},
		rateLimit: {
			enabled: false,
		},
		advanced: {
			cookies: {},
		},
		user: {
			additionalFields: {
				role: {
					type: "string",
					input: false,
					required: false,
					defaultValue: "user",
				},
			},
		},
	} satisfies BetterAuthOptions;

	const auth = betterAuth({
		baseURL: "http://localhost:" + (config?.port || 3000),
		...opts,
		...options,
		advanced: {
			disableCSRFCheck: true,
			...options?.advanced,
		},
		plugins: [bearer(), ...(options?.plugins || [])],
	} as O extends undefined ? typeof opts : O & typeof opts);

	const testUser = {
		email: "test@test.com",
		password: "test123456",
		name: "test user",
		...config?.testUser,
	};

	const adminUser = {
		email: "admin@admin.com",
		password: "admin123456",
		name: "admin user",
		...config?.adminUser,
	};

	async function createTestUser(user: Partial<User>, role?: string) {
		if (config?.disableTestUser) {
			return;
		}
		//@ts-expect-error
		const res = await auth.api.signUpEmail({
			body: user,
		});

		if (res.user && role) {
			await (await auth.$context).adapter.update({
				model: "user",
				update: {
					role,
				},
				where: [
					{
						field: "id",
						operator: "eq",
						value: res.user.id,
					},
				],
			});
		}
	}

	if (testWith !== "mongodb") {
		const { runMigrations } = await getMigrations({
			...auth.options,
			database: opts.database,
		});
		await runMigrations();
	}

	await createTestUser(testUser);
	await createTestUser(adminUser, "admin");

	afterAll(async () => {
		if (testWith === "mongodb") {
			const db = await mongodbClient();
			await db.dropDatabase();
			return;
		}
		if (testWith === "postgres") {
			await sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`.execute(
				postgres,
			);
			await postgres.destroy();
			return;
		}

		if (testWith === "mysql") {
			await sql`SET FOREIGN_KEY_CHECKS = 0;`.execute(mysql);
			const tables = await mysql.introspection.getTables();
			for (const table of tables) {
				// @ts-expect-error
				await mysql.deleteFrom(table.name).execute();
			}
			await sql`SET FOREIGN_KEY_CHECKS = 1;`.execute(mysql);
			return;
		}

		// Fix resource-locking issue on Windows
		(opts?.database as Database).close();

		await fs.unlink(dbName);
	});

	async function signInWithTestUser(role: "user" | "admin" = "user") {
		if (config?.disableTestUser) {
			throw new Error("Test user is disabled");
		}
		const user = role === "admin" ? adminUser : testUser;
		const headers = new Headers();
		const setCookie = (name: string, value: string) => {
			const current = headers.get("cookie");
			headers.set("cookie", `${current || ""}; ${name}=${value}`);
		};
		//@ts-expect-error
		const { data, error } = await client.signIn.email({
			email: user.email,
			password: user.password,
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

	const changeUserRole = async (id: string, role: string) => {
		await (await auth.$context).adapter.update({
			model: "user",
			update: {
				role,
			},
			where: [
				{
					field: "id",
					operator: "eq",
					value: id,
				},
			],
		});
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
			options?.baseURL || "http://localhost:" + (config?.port || 3000),
			options?.basePath || "/api/auth",
		),
		fetchOptions: {
			customFetchImpl,
		},
	});

	return {
		auth,
		client,
		testUser,
		adminUser,
		signInWithTestUser,
		signInWithAdminUser: () => signInWithTestUser("admin"),
		signInWithUser,
		changeUserRole,
		cookieSetter: setCookieToHeader,
		customFetchImpl,
		sessionSetter,
		db: await getAdapter(auth.options),
	};
}
