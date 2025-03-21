import { init, i, id } from "@instantdb/admin";
import { betterAuth } from "better-auth";
import { config } from "dotenv";
import { instantAdapter } from "../src";

config({ path: "./../.env" });

// const schema = i.schema({
// 	entities: {
// 		todos: i.entity({
// 			text: i.string(),
// 			done: i.boolean(),
// 			createdAt: i.date(),
// 		}),
// 	},
// });

const db = init({
	appId: process.env.APP_ID!,
	adminToken: process.env.SECRET!,
	// schema,
});

const _auth = betterAuth({
	database: instantAdapter(db, {
		debug: true,
	}),
});

console.log(`Running!`);

const ctx = await _auth.$context;

ctx.adapter.create<{
	text: string;
	done: boolean;
	createdAt: Date;
}>({
	model: "test",
	data: {
		text: "Hello, world!",
		done: false,
		createdAt: new Date(),
	},
});
