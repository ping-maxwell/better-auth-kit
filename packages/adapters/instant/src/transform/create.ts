import type { Adapter } from "better-auth";

export const create = (): Adapter["create"] => {
	return <T extends Record<string, any>, R = T>(data: {
		model: string;
		data: T;
		select?: string[];
	}): R => {
		return 1 as R;
	};
};
