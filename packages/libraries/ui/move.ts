import { copyFile, copyFileSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const allFiles = readdirSync("./public/r", "utf-8");
console.log(`Detected ${allFiles.length} files:`);
allFiles.forEach((file) => {
	console.log(`- ${file}`);
	copyFileSync(
		path.join("./public/r", file),
		path.join("./../../../apps/docs/public/r", file),
	);
});
