import { table, type ConvertToSeedGenerator } from "../index";
import { dataset as $ } from "../dataset";
import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";
import { rng } from "../utils";

const client = createAuthClient({ plugins: [organizationClient()] });
export type Organization = typeof client.$Infer.Organization;
export type Member = typeof client.$Infer.Member;
export type Invitation = typeof client.$Infer.Invitation;
export type Team = typeof client.$Infer.Team;

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
				updatedAt: $.randomDate(),
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
								const org = rng(createdOrgs);
								return org.id;
							},
							role: $.custom(() => rng(["admin", "member", "owner"])),
							createdAt: $.randomDate(),
						},
						{ count, modelName: memberModel },
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
								const org = rng(createdOrgs);
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
		...(createTeams
			? {
					[teamModel]: table<TableTypes["Team"]>(
						//@ts-ignore
						{
							id: $.uuid(),
							name: $.firstname((name) => `${name}'s Team`),
							organizationId: () => {
								const org = rng(createdOrgs);
								return org.id;
							},
							updatedAt: $.randomChoice($.randomDate(), $.nullValue()),
							createdAt: $.randomDate(),
						},
						{ count, modelName: teamModel },
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
