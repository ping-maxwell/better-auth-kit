import { id } from "@instantdb/core";
import type { Adapter } from "better-auth";
import type { InstantDB, DataToEntity, InstantAdapterOptions } from "src/types";

export const create = ({
	db,
	options,
}: {
	db: InstantDB;
	options: InstantAdapterOptions;
}): Adapter["create"] => {
	return async <T extends Record<string, any>, R = T>(data: {
		model: string;
		data: T;
		select?: string[];
	}): Promise<R> => {
		const id_ = id();
		const result = await db.transact(
			db.tx[data.model][id_].update(data.data as DataToEntity<T>),
		);

		const new_data = {
			...data.data,
			id: id_,
		};

		if (options.debug) {
			console.log(`[Instant] Created \`${data.model}\`:`, new_data, result);
		}

		const qdata = await db.query({
			[data.model]: { $: { where: { id: id_ } } },
		});

		console.log(123, qdata);

		return new_data as never as R;
	};
};
