import type { User, Session, AuthContext } from "better-auth";
import { z } from "zod";
import { Server, type Socket } from "socket.io";

const sessionTokenSchema = z.object({
	sessionToken: z.string(),
});

export const x = (ctx: AuthContext) => {
	const socketIoAdapter = (socket: Socket) => {
		return {
			on: (
				event: string,
				cb: (
					{ session, user }: { session: Session; user: User },
					...args: any[]
				) => void,
				options?: {
					validation: "one-time-validation" | "active-revalidation";
				},
			) => {
				return socket.on(event, async (...args: any[]) => {
					const [sessionTokenUnsafe, ...rest] = args;
					const { sessionToken } = sessionTokenSchema.parse(sessionTokenUnsafe);
					const session = await ctx.internalAdapter.findSession(sessionToken);
					if (!session) return new Error("UNAUTHORIZED");
					cb({ session: session.session, user: session.user }, ...rest);
				});
			},
		};
	};
	return {
		socketIoAdapter,
	};
};

const io = new Server({
	/* options */
});

const { socketIoAdapter } = x({} as AuthContext);

io.on("connection", (socket) => {
	const safeSocket = socketIoAdapter(socket);

	socket.on("unsafe-event", () => {
		console.log("Unsafe event called.");
	});

	safeSocket.on(
		"protected-event",
		({ session, user }) => {
			console.log("Protected event called.");
		},
		{ validation: "active-revalidation" },
	);
});

io.listen(3000);
