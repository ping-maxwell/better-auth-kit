import type {
	EntitiesWithLinks,
	RoomsDef,
	InstantCoreDatabase,
	InstantSchemaDef,
	DataAttrDef,
	LinksDef,
	EntityDef,
} from "@instantdb/core";
import type { AdapterInstance } from "better-auth";

export type InstantClient = InstantCoreDatabase<
	InstantSchemaDef<
		EntitiesWithLinks<
			{
				// todos: EntityDef<
				// 	{
				// 		text: DataAttrDef<string, true>;
				// 		done: DataAttrDef<boolean, true>;
				// 		createdAt: DataAttrDef<string | number, true>;
				// 	},
				// 	{},
				// 	void
				// >;
			},
			LinksDef<any>
		>,
		LinksDef<any>,
		RoomsDef
	>
>;

export type InstantAdapter = (client: InstantClient) => AdapterInstance;
