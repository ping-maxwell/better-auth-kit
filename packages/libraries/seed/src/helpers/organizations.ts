import { table, type ConvertToSeedGenerator } from "../index";
import { dataset as $ } from "../dataset";
import { rng } from "../utils";
import chalk from "chalk";

export type Organization = {
	id: string;
	name: string;
	createdAt: Date;
	slug: string;
	metadata?: any;
	logo?: string | null | undefined;
};
export type Member = {
	id: string;
	userId: string;
	organizationId: string;
	role: "member" | "admin" | "owner";
	createdAt: Date;
};

export type Invitation = {
	id: string;
	organizationId: string;
	email: string;
	role: "member" | "admin" | "owner";
	status: "pending" | "accepted" | "rejected" | "canceled";
	inviterId: string;
	expiresAt: Date;
	teamId?: string;
};
export type Team = {
	id: string;
	name: string;
	createdAt: Date;
	organizationId: string;
	updatedAt?: Date | undefined;
};

export function organizations<
	TableTypes extends {
		Organization: Organization;
		Member: Member;
		Invitation: Invitation;
		Team: Team;
	} = {
		Organization: Organization;
		Member: Member;
		Invitation: Invitation;
		Team: Team;
	},
	OrganizationModel extends string = "organization",
	MemberModel extends string = "member",
	InvitationModel extends string = "invitation",
	TeamModel extends string = "team",
	ShouldCreateInvitations extends boolean = false,
	ShouldCreateTeams extends boolean = false,
	ShouldCreateMembers extends boolean = true,
>(
	fields?: {
		organization?: Partial<ConvertToSeedGenerator<TableTypes["Organization"]>>;
		member?: Partial<ConvertToSeedGenerator<TableTypes["Member"]>>;
		invitation?: Partial<ConvertToSeedGenerator<TableTypes["Invitation"]>>;
		team?: Partial<ConvertToSeedGenerator<TableTypes["Team"]>>;
	},
	options?: {
		/**
		 * Custom model names for the user, session and account tables
		 */
		modelNames?: {
			organization: OrganizationModel;
			member: MemberModel;
			invitation: InvitationModel;
			team: TeamModel;
		};
		/**
		 * The number of users to create
		 *
		 * @default 100
		 */
		count?: number;
		/**
		 * Whether to create invitations
		 *
		 * @default false
		 */
		createInvitations?: ShouldCreateInvitations;
		/**
		 * Whether to create teams
		 *
		 * @default false
		 */
		createTeams?: ShouldCreateTeams;
		/**
		 * Whether to create members
		 *
		 * @default true
		 */
		createMembers?: ShouldCreateMembers;
	},
) {
	const {
		modelNames,
		count = 100,
		createInvitations = false,
		createTeams = false,
		createMembers = true,
	} = options ?? {};
	const organizationModel = modelNames?.organization ?? "organization";
	const memberModel = modelNames?.member ?? "member";
	const invitationModel = modelNames?.invitation ?? "invitation";
	const teamModel = modelNames?.team ?? "team";

	const createdOrgs: {
		id: string;
	}[] = [];

	return {
		[organizationModel]: table<TableTypes["Organization"]>(
			//@ts-expect-error
			{
				id: async ({ adapter, context }) => {
					const id = await $.uuid()({ adapter, context });
					createdOrgs.push({ id });
					return id;
				},
				name: async ({ adapter, context }) => {
					const name = await $.firstname()({ adapter, context });
					const companySuffix = await $.companyNameSuffixes()({
						adapter,
						context,
					});
					return `${name} ${companySuffix}`;
				},
				createdAt: $.randomDate(),
				slug: $.randomCharacters(10),
				logo: $.image(),
				...fields?.organization,
			},
			{ count, modelName: organizationModel },
		),
		...(createMembers
			? {
					[memberModel]: table<TableTypes["Member"]>(
						//@ts-ignore
						{
							id: $.uuid(),
							//@ts-ignore
							userId: $.foreignKey({
								model: "user",
								field: "id",
							}),
							organizationId: () => {
								const org = rng<{id: string}>(createdOrgs);
								if(typeof org === "undefined") throw new Error(`No organizations found while seeding model ${chalk.cyanBright(memberModel)}`);
								return org.id;
							},
							role: $.custom(() => rng(["admin", "member", "owner"])),
							createdAt: $.randomDate(),
						},
						{ count, modelName: memberModel },
					),
				}
			: {}),
		...(createTeams
			? {
					[teamModel]: table<TableTypes["Team"]>(
						//@ts-ignore
						{
							id: $.uuid(),
							name: $.firstname((name) => `${name}'s Team`),
							organizationId: () => {
								const org = rng<{id: string}>(createdOrgs);
								if(typeof org === "undefined") throw new Error(`No organizations found while seeding model ${chalk.cyanBright(teamModel)}`);
								return org.id;
							},
							updatedAt: $.randomChoice($.randomDate(), $.nullValue()),
							createdAt: $.randomDate(),
						},
						{ count, modelName: teamModel },
					),
				}
			: {}),
		...(createInvitations
			? {
					[invitationModel]: table<TableTypes["Invitation"]>(
						//@ts-ignore
						{
							id: $.uuid(),
							email: $.email(),
							expiresAt: $.randomDate(),
							inviterId: $.foreignKey({
								model: "user",
								field: "id",
							}),
							organizationId: () => {
								const org = rng<{id: string}>(createdOrgs);
								if(typeof org === "undefined") throw new Error(`No organizations found while seeding model ${chalk.cyanBright(invitationModel)}`);
								return org.id;
							},
							role: $.custom(() => rng(["admin", "member"])),
							status: $.custom(() =>
								rng(["pending", "accepted", "rejected", "canceled"]),
							),
							teamId: $.foreignKey({
								model: "team",
								field: "id",
							}),
						},
						{ count, modelName: invitationModel },
					),
				}
			: {}),
	} as {
		[key in OrganizationModel]: ReturnType<
			typeof table<TableTypes["Organization"]>
		>;
	} & (ShouldCreateInvitations extends true
		? {
				[key in InvitationModel]: ReturnType<
					typeof table<TableTypes["Invitation"]>
				>;
			}
		: {}) &
		(ShouldCreateTeams extends true
			? {
					[key in TeamModel]: ReturnType<typeof table<TableTypes["Team"]>>;
				}
			: {}) &
		(ShouldCreateMembers extends true
			? {
					[key in MemberModel]: ReturnType<typeof table<TableTypes["Member"]>>;
				}
			: {});
}
