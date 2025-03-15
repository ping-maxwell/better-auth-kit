#!/usr/bin/env node

import { Command } from "commander";
import { version } from "../package.json";
import * as commands from "./commands";

// handle exit
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
	const program = new Command("better-auth-kit");

	for (const command of Object.values(commands)) {
		program.addCommand(command);
	}

	program.version(version).description("Better Auth Kit CLI");
	program.parse();
}

main();
