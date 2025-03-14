type NpmPackageResp = {
	downloads: number;
	start: string;
	end: string;
	package: string;
};
export async function getNPMPackageDownloads(name: string) {
	const res = await fetch(
		`https://api.npmjs.org/downloads/point/last-year/${name}`,
		{
			next: { revalidate: 60 },
		},
	);

	const npmStat: NpmPackageResp = await res.json();
	if ("error" in npmStat) {
		return {
			downloads: 0,
			start: "",
			end: "",
			package: name,
		};
	}
	return npmStat;
}
