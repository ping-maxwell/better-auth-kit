import type { Adapter } from "better-auth";
import { create } from "./create";
import type { InstantDB, InstantAdapterOptions } from "src/types";

export const transform = ({
	db,
	options,
}: { db: InstantDB; options: InstantAdapterOptions }): Omit<
	Adapter,
	"id" | "createSchema"
> => {
	//@ts-ignore
	return {
		create: create({ db, options }),
	};
};
