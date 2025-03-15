import { cache } from "react";

interface PackageVersion {
	version: string;
}

export const getNpmPackageLatestVersion = cache(
	async (packageName: string): Promise<PackageVersion> => {
		const res = await fetch(
			`https://registry.npmjs.org/-/package/${packageName}/dist-tags`,
			{
				next: { revalidate: 60 },
			},
		);

		if (!res.ok) {
			console.error(`Failed to fetch ${packageName} version`);
			return {
				version: "0",
			};
		}

		const data: { latest: string } = await res.json();

		return {
			version: data.latest,
		};
	},
);
