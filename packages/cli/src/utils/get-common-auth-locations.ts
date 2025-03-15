export function getCommonAuthLocations(fileNames: string[]) {
	let possiblePaths  = fileNames;
	possiblePaths = [
		...possiblePaths,
		...possiblePaths.map((it) => `lib/server/${it}`),
		...possiblePaths.map((it) => `server/${it}`),
		...possiblePaths.map((it) => `lib/${it}`),
		...possiblePaths.map((it) => `lib/auth/${it}`),
		...possiblePaths.map((it) => `/auth/${it}`),
		...possiblePaths.map((it) => `utils/${it}`),
	];
	possiblePaths = [
		...possiblePaths,
		...possiblePaths.map((it) => `src/${it}`),
		...possiblePaths.map((it) => `app/${it}`),
	];
	return possiblePaths;
}
