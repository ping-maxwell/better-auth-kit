import {
	betterAuth,
	type Session,
	type User,
	type BetterAuthPlugin,
} from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import { Socket } from "socket.io";
import { z } from "zod";
import { Server } from "socket.io";

const sessionTokenSchema = z.object({
	sessionToken: z.string(),
});

export function socket() {
	return {
		id: "socket",
		endpoints: {
			socketIoAdapter: createAuthEndpoint(
				"/socket/socket-io-adapter",
				{
					method: "GET",
					metadata: {
						SERVER_ONLY: true,
					},
					body: z.object({
						socket: z.instanceof(Socket),
						options: z
							.object({
								/**
								 * How long in milliseconds until the session is considered invalid, and should revalidate.
								 *
								 * @default 1000 * 60 * 5 // 5 minutes
								 */
								sessionExpiration: z.number().optional(),
							})
							.optional(),
					}),
				},
				async (ctx) => {
					const { socket, options } = ctx.body;
					const { sessionExpiration = 1000 * 60 * 5 } = options ?? {};
					let sessionToken: string | null = null;
					let lastValidatedAt: Date | null = null;

					async function validateSession() {
						if (
							!sessionToken ||
							(lastValidatedAt &&
								lastValidatedAt.getTime() + sessionExpiration < Date.now())
						) {
							const result = await new Promise<string | null>(
								(resolve, reject) => {
									socket.emit(
										"better-auth:validate-session",
										(sessionTokenReponse: any) => {
											const result =
												sessionTokenSchema.safeParse(sessionTokenReponse);
											if (!result.success)
												reject(
													new Error("UNAUTHORIZED", {
														cause: result.error,
													}),
												);
											resolve(result.data?.sessionToken ?? null);
										},
									);
								},
							);
							if (!result) {
								throw new Error("UNAUTHORIZED");
							}
							lastValidatedAt = new Date();
							sessionToken = result;
						}
						const session =
							await ctx.context.internalAdapter.findSession(sessionToken);
						if (!session) throw new Error("UNAUTHORIZED");
						return session;
					}

					return {
						on: (
							event: string,
							cb: (
								{ session, user }: { session: Session; user: User },
								...args: any[]
							) => void,
						) => {
							return socket.on(event, async (...args: any[]) => {
								const session = await validateSession();
								cb({ session: session.session, user: session.user }, ...args);
							});
						},
					};
				},
			),
		},
	} satisfies BetterAuthPlugin;
}

// ========== SERVER EXAMPLE ==========
const auth = betterAuth({ plugins: [socket()] });

const ioServer = new Server({
	/* options */
});

ioServer.on("connection", async (socket) => {
	const safeSocket = await auth.api.socketIoAdapter({
		body: {
			socket: socket,
		},
	});

	socket.on("unsafe-event", () => {
		console.log("Unsafe event called.");
	});

	safeSocket.on("protected-event", ({ session, user }) => {
		console.log("Protected event called.");
	});
});

ioServer.listen(3000);

// ========== CLIENT EXAMPLE ==========
import { io } from "socket.io-client";
import { createAuthClient } from "better-auth/react";
import { socketClient } from "./client";

const socket2 = io("http://localhost:3000");

const authClient = createAuthClient({ plugins: [socketClient()] });

authClient.initSocketIO(socket2);

socket2.on("connect", () => {});
