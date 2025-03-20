import { init, i, id, InstaQLEntity } from "@instantdb/core";
import { config } from "dotenv";

config({ path: "./../.env" });

const schema = i.schema({
	entities: {
		todos: i.entity({
			text: i.string(),
			done: i.boolean(),
			createdAt: i.date(),
		}),
	},
});

const db = init({ appId: process.env.APP_ID!, schema });

db.transact(
	db.tx.todos[id()].update({
		createdAt: Date.now(),
		done: true,
		text: "Hello world!",
	}),
);

db.queryOnce({
	todos: {
		$: {
			
		},
	},
});
