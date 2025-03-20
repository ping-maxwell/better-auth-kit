import type { AdapterInstance } from "better-auth";
import type { InstantAdapter } from "./types";
import { transform } from "./transform";

export const instantAdapter: InstantAdapter =
	(client): AdapterInstance =>
	(ba_options) => {
		return {
			id: "instant",
			...transform(),
		};
	};
