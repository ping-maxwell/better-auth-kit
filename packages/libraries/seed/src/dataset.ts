import type { SeedGenerator, SeedPrimitiveValue } from "./types";
import firstNames from "./dataset/first-names";
import lastNames from "./dataset/last-names";
import emailDomains from "./dataset/email-domains";
import company_name_suffixes from "./dataset/company-name-suffixes";
import countries_list from "./dataset/countries";
import job_titles from "./dataset/job-titles";
import lorem_ipsum from "./dataset/lorem-ipsum-sentences";
import phone_numbers from "./dataset/phones-info";
import states_list from "./dataset/states";
import street_suffixes from "./dataset/street-suffixes";
import city_names from "./dataset/city-names";
import user_agents from "./dataset/user-agents";
import { rng } from "./utils";
import chalk from "chalk";

const tableCache: {
	model: string;
	values: any[];
	offset: number;
}[] = [];

const firstname = (
	modifier?: (name: string) => string,
): SeedGenerator<string> => {
	if (modifier) {
		return () => modifier(rng(firstNames) as string);
	}
	return () => rng(firstNames) as string;
};

const lastname = (
	modifier?: (name: string) => string,
): SeedGenerator<string> => {
	if (modifier) {
		return () => modifier(rng(lastNames) as string);
	}
	return () => rng(lastNames) as string;
};

const first_and_lastname = (
	modifier?: (firstname: string, lastname: string) => string,
): SeedGenerator<string> => {
	if (modifier) {
		return async ({ adapter, context }) =>
			modifier(
				await firstname()({ adapter, context }),
				await lastname()({ adapter, context }),
			);
	}
	return async ({ adapter, context }) =>
		`${await firstname()({ adapter, context })} ${await lastname()({ adapter, context })}`;
};

const uuid = (): SeedGenerator<string> => {
	return () => crypto.randomUUID();
};

const email = ({
	unique = true,
	fullname,
	domain,
}: {
	unique?: boolean;
	domain?: string;
	fullname?: () => SeedGenerator<string>;
} = {}): SeedGenerator<string> => {
	const usedEmails: string[] = [];
	return async ({ adapter, context }) => {
		const domain_ = domain ?? rng(emailDomains);
		let fn_ = (await firstname()({ adapter, context })).toLowerCase();
		let ln_: string | null = (
			await lastname()({ adapter, context })
		).toLowerCase();

		if (fullname) {
			const fn = await fullname()({ adapter, context });
			if (fn.includes(" ")) {
				fn_ = fn.split(" ")[0].toLowerCase();
				ln_ = fn.split(" ")[1].toLowerCase();
			} else {
				fn_ = fn.toLowerCase();
				ln_ = null;
			}
		}

		let email = `${fn_}${ln_ ? `_${ln_}` : ""}@${domain_}`;
		if (unique) {
			if (usedEmails.includes(email)) {
				const generateUniqueEmail = async () => {
					let newEmail = `${fn_}${ln_ ? `_${ln_}` : ""}_${await randomCharacters(5)({ adapter, context })}@${domain_}`;
					if (usedEmails.includes(newEmail)) {
						newEmail = await generateUniqueEmail();
					}
					return newEmail;
				};
				email = await generateUniqueEmail();
			}
			usedEmails.push(email);
		}
		return email;
	};
};

const password = (cb?: () => string): SeedGenerator<string> => {
	return async ({ context }) =>
		await context.password.hash(cb ? cb() : randomPassword());
};

const randomNumber = (
	options: { min?: number; max?: number } = {},
): SeedGenerator<number> => {
	const { min = 0, max = 100 } = options;
	return () => Math.floor(Math.random() * (max - min + 1)) + min;
};

const image = (dimensions?: {
	width?: number;
	height?: number;
}): SeedGenerator<string> => {
	return () =>
		`https://picsum.photos/${dimensions?.width ?? 500}/${dimensions?.height ?? 500}`;
};

const randomDate = (
	timeline?: "past" | "future" | "any",
): SeedGenerator<Date> => {
	return () => {
		const now = new Date();
		const range = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years in milliseconds
		let randomTime: number;

		if (timeline === "past") {
			randomTime = now.getTime() - Math.random() * range;
		} else if (timeline === "future") {
			randomTime = now.getTime() + Math.random() * range;
		} else {
			randomTime = now.getTime() + (Math.random() * 2 - 1) * range; // +/- 10 years
		}

		return new Date(randomTime);
	};
};

const companyNameSuffixes = (): SeedGenerator<string> => {
	return () => rng(company_name_suffixes) as string;
};

const countries = (): SeedGenerator<string> => {
	return () => rng(countries_list) as string;
};

const jobTitles = (): SeedGenerator<string> => {
	return () => rng(job_titles) as string;
};

const phoneNumbers = (): SeedGenerator<string> => {
	const [countryCode, operatorCode, length] = rng(phone_numbers) as string;
	return () =>
		`+${countryCode}${operatorCode}${randomPhoneNumber(Number.parseInt(length))}`;
};

const states = (): SeedGenerator<string> => {
	return () => rng(states_list) as string;
};

const foreignKey = <FieldType extends SeedPrimitiveValue = any>({
	model,
	field,
	unique = false,
}: {
	model: string;
	field: string;
	unique?: boolean;
}): SeedGenerator<FieldType> => {
	const res: SeedGenerator<FieldType> = async ({ adapter }) => {
		let cache = tableCache.find((x) => x.model === model);
		if (!cache) {
			cache = {
				model,
				values: [],
				offset: 0,
			};
		}
		let row = rng(cache.values);
		if (!row) {
			let values: unknown[] = [];
			try {
				values = await adapter.findMany({
					model,
					where: [],
					limit: 500,
					offset: cache.offset,
				});
			} catch (error: any) {
				if (
					error?.message ===
					"Cannot read properties of undefined (reading 'modelName')"
				) {
					throw new Error(
						`Missing model ${chalk.cyanBright(model)} while assigning foreign key to the current model.`,
					);
				}
				throw error;
			}
			if (values.length === 0) {
				throw new Error(
					`No values found for model ${chalk.cyanBright(model)} while assigning foreign key ${chalk.greenBright(field)}`,
				);
			}
			row = rng(values);
			if (unique) {
				values = values.splice(values.indexOf(row), 1);
			}
			cache = {
				...cache,
				values,
				offset: cache.offset + 1,
			};
			tableCache.push(cache);
			return row[field] as FieldType;
		}
		if (unique) {
			tableCache.find((x) => x.model === model)?.values.splice(row, 1);
		}
		return row[field] as FieldType;
	};

	return res;
};

const loremIpsum = (): SeedGenerator<string> => {
	return () => rng(lorem_ipsum) as string;
};

const streetSuffixes = (): SeedGenerator<string> => {
	return () => rng(street_suffixes) as string;
};

const cityNames = (): SeedGenerator<string> => {
	return () => rng(city_names) as string;
};

const custom = (cb: () => any): SeedGenerator<any> => {
	return () => cb();
};

const ip = (): SeedGenerator<string> => {
	return () => generateRealisticIPv4();
};

const userAgent = (): SeedGenerator<string> => {
	return () => rng(user_agents) as string;
};

const nullValue = (): SeedGenerator<null> => {
	return () => null;
};

const randomChoice = (...choices: SeedGenerator<any>[]): SeedGenerator<any> => {
	return (fns) => rng<SeedGenerator<any>>(choices)?.(fns);
};

const randomCharacters = (length: number): SeedGenerator<string> => {
	return () => {
		const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length),
			);
		}
		return result;
	};
};

const randomBoolean = (opts?: {
	/**
	 * @default 0.5
	 */
	probability?: number;
}): SeedGenerator<boolean> => {
	const { probability = 0.5 } = opts ?? {};
	return () => Math.random() < probability;
};

export const dataset = {
	firstname,
	lastname,
	first_and_lastname,
	uuid,
	email,
	randomBoolean,
	custom,
	randomDate,
	password,
	foreignKey,
	image,
	companyNameSuffixes,
	countries,
	jobTitles,
	loremIpsum,
	phoneNumbers,
	states,
	streetSuffixes,
	cityNames,
	ip,
	userAgent,
	randomNumber,
	nullValue,
	randomChoice,
	randomCharacters,
} satisfies Record<string, (...args: any[]) => SeedGenerator>;

function randomPassword() {
	return Math.random().toString(36).substring(2, 15);
}

function randomPhoneNumber(length: number) {
	let result = "";
	const characters = "0123456789";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

/**
 * Generates a random but realistic-looking IPv4 address.
 *
 * @returns A string representing an IPv4 address.
 */
function generateRealisticIPv4(): string {
	const firstOctet = Math.floor(Math.random() * 223) + 1; // 1-223 (avoiding reserved/multicast)
	// Ensure first octet isn't in reserved ranges (RFC 1918 and others)
	if (firstOctet === 10) {
		// Class A private network
		return `10.${Math.floor(Math.random() * 255)}.${Math.floor(
			Math.random() * 255,
		)}.${Math.floor(Math.random() * 255)}`;
	}
	if (firstOctet === 172) {
		// Class B private network (172.16.0.0 - 172.31.255.255)
		const secondOctet = Math.floor(Math.random() * 16) + 16; // 16-31
		return `172.${secondOctet}.${Math.floor(Math.random() * 255)}.${Math.floor(
			Math.random() * 255,
		)}`;
	}
	if (firstOctet === 192) {
		// Class C private network (192.168.0.0 - 192.168.255.255)
		return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
			Math.random() * 255,
		)}`;
	}

	// Remaining octets (0-255)
	const secondOctet = Math.floor(Math.random() * 255);
	const thirdOctet = Math.floor(Math.random() * 255);
	const fourthOctet = Math.floor(Math.random() * 255);

	return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
}
