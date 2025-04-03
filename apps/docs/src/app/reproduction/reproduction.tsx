import { ReproductionCommand } from "./components/reproduction-command";

export type Frontend =
	| "nextjs"
	| "vue"
	| "sveltekit"
	| "nuxt"
	| "astro"
	| "expo"
	| "remix"
	| "solid"
	| "tanstack-start";

export type Backend = "hono" | "express" | "elysia" | "nitro" | "use-frontend";

export const Reproduction = () => {
	return (
		<div className="mt-16">
			<ReproductionCommand />
		</div>
	);
};