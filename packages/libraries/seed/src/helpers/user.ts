import type { Account, Session, User } from "better-auth";
import { table, type ConvertToSeedGenerator } from "../index";
import { dataset as $ } from "../dataset";

export function users<
	TableTypes extends {
		user: User;
		session: Session;
		account: Account;
	} = {
		user: User;
		session: Session;
		account: Account;
	},
	UserModel extends string = "user",
	SessionModel extends string = "session",
	AccountModel extends string = "account",
>(
	fields?: {
		user?: Partial<ConvertToSeedGenerator<TableTypes["user"]>>;
		session?: Partial<ConvertToSeedGenerator<TableTypes["session"]>>;
		account?: Partial<ConvertToSeedGenerator<TableTypes["account"]>>;
	},
	options?: {
		/**
		 * Custom model names for the user, session and account tables
		 */
		modelNames?: {
			user: UserModel;
			session: SessionModel;
			account: AccountModel;
		};
		/**
		 * The number of users to create
		 *
		 * @default 100
		 */
		count?: number;
	},
) {
	const { modelNames, count = 100 } = options ?? {};
	const userModel = modelNames?.user ?? "user";
	const sessionModel = modelNames?.session ?? "session";
	const accountModel = modelNames?.account ?? "account";

	const createdUsers: {
		id: string;
		sessionUsed: boolean;
		accountUsed: boolean;
	}[] = [];

	return {
		[userModel]: table<TableTypes["user"]>(
			//@ts-expect-error
			{
				id: async ({ adapter, context }) => {
					const id = await $.uuid()({ adapter, context });
					createdUsers.push({ accountUsed: false, id, sessionUsed: false });
					return id;
				},
				name: $.first_and_lastname(),
				email: $.email(),
				emailVerified: $.randomBoolean({ probability: 0.5 }),
				createdAt: $.randomDate(),
				updatedAt: $.randomDate(),
				...fields?.user,
			},
			{ count, modelName: userModel },
		),
		[sessionModel]: table<TableTypes["session"]>(
			//@ts-expect-error
			{
				id: $.uuid(),
				userId: () => {
					const user = createdUsers.find((x) => x.sessionUsed === false)!;
					createdUsers[createdUsers.indexOf(user)].sessionUsed = true;
					return user.id;
				},
				createdAt: $.randomDate(),
				updatedAt: $.randomDate(),
				expiresAt: $.randomDate(),
				token: $.uuid(),
				ipAddress: $.ip(),
				userAgent: $.userAgent(),
				...fields?.session,
			},
			{ count, modelName: sessionModel },
		),
		[accountModel]: table<TableTypes["account"]>(
			//@ts-expect-error
			{
				id: $.uuid(),
				userId: () => {
					const user = createdUsers.find((x) => x.accountUsed === false)!;
					return user.id;
				},
				accountId: () => {
					const user = createdUsers.find((x) => x.accountUsed === false)!;
					createdUsers[createdUsers.indexOf(user)].accountUsed = true;
					return user.id;
				},
				providerId: $.custom(() => "credentials"),
				refreshToken: $.nullValue(),
				accessToken: $.nullValue(),
				accessTokenExpiresAt: $.nullValue(),
				refreshTokenExpiresAt: $.nullValue(),
				scope: $.nullValue(),
				idToken: $.nullValue(),
				createdAt: $.randomDate(),
				updatedAt: $.randomDate(),
				password: $.password(),
				...fields?.account,
			},
			{ count, modelName: accountModel },
		),
	} as {
		[key in UserModel]: ReturnType<typeof table<TableTypes["user"]>>;
	} & {
		[key in SessionModel]: ReturnType<typeof table<TableTypes["session"]>>;
	} & {
		[key in AccountModel]: ReturnType<typeof table<TableTypes["account"]>>;
	};
}
