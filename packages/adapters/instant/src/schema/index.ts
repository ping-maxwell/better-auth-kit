import type { Adapter } from "better-auth";

export const schema: () => {
	createSchema: Adapter["createSchema"];
} = () => {
	return {
		createSchema: async (options, file) => {
			return {
				code: "123",
				path: "123",
			};
		},
	};
};
