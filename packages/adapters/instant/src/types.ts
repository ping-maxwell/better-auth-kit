import type { InstantUnknownSchema } from "@instantdb/core";
import type { InstantAdminDatabase, DataAttrDef } from "@instantdb/admin";
import type { AdapterInstance } from "better-auth";

export type InstantDB = InstantAdminDatabase<InstantUnknownSchema>;

export interface InstantAdapterOptions {
	debug?: boolean;
	generateId?: () => string;
}

export type InstantAdapter = (
	db: InstantDB,
	options: InstantAdapterOptions,
) => AdapterInstance;

export type DataToEntity<T> = {
	[key in keyof T]: DataAttrDef<T[key], true>;
};
