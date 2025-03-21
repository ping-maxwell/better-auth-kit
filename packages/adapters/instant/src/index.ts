import type { AdapterInstance } from "better-auth";
import type { InstantAdapter } from "./types";
import { transform } from "./methods";
import { schema } from "./schema";

export const instantAdapter: InstantAdapter =
	(db, options): AdapterInstance =>
	(ba_options) => {
		return {
			id: "instant",
			...transform({ db, options }),
			...schema(), //TODO: Fix this.
		};
	};
