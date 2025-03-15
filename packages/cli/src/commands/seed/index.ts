import chalk from "chalk";
import { Command } from "commander";

const seedAction = async () => {
	console.log(`Hello world!`);
};

export const seedCommand = new Command("seed").action(seedAction);
