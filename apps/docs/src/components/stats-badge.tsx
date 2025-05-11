export const StatsBadge = ({
	npmPackage,
}: {
	npmPackage: string;
}) => {
	const imgClass = `!-mt-22 !mb-0 mr-3 inline-block`;

	const badgeStyle = `&labelColor=161f37&color=2a3d6b`;

	return (
		<>
			<a href={`https://www.npmjs.com/package/${npmPackage}`}>
				<img
					className={imgClass}
					src={`https://img.shields.io/npm/v/${npmPackage}.svg?label=version${badgeStyle}`}
					alt="Version"
				/>
			</a>
			<a href={`https://www.npmjs.com/package/${npmPackage}`}>
				<img
					className={imgClass}
					src={`https://img.shields.io/npm/dm/${npmPackage}.svg?label=downloads${badgeStyle}`}
					alt="Downloads"
				/>
			</a>
			<a href={`https://www.npmjs.com/package/${npmPackage}`}>
				<img
					className={imgClass}
					src={`https://img.shields.io/npm/l/${npmPackage}.svg?label=license${badgeStyle}`}
					alt="License"
				/>
			</a>
			<br />
		</>
	);
};
