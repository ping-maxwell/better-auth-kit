#!/usr/bin/env node

import { Command } from "commander";
import { version } from "../package.json";

// handle exit
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
	const program = new Command("better-auth-kit");

	program.version(version).description("Better Auth Kit CLI version");
	program.parse();
}

main();
