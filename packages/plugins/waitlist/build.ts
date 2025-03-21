import dts from "bun-plugin-dts";

(async () => {
	const start = Date.now();
	const res = await Bun.build({
		format: "esm",
		target: "node",
		outdir: "./dist",
		minify: true,
		sourcemap: "external",
		entrypoints: ["./src/index.ts", "./src/schema.ts", "./src/client.ts"],
		packages: "external",
		plugins: [dts()],
		splitting: true,
	});
	res.logs.forEach((log) => {
		console.log(log);
	});
	if (res.success) {
		console.log(`Success! Built in ${Date.now() - start}ms`);
	} else {
		console.error(`Failed to build in ${Date.now() - start}ms`);
	}
})();
