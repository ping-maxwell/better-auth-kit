export type PrettifyDeep<T> = {
	[K in keyof T]: T[K] extends (...args: any[]) => any
		? T[K]
		: T[K] extends object
			? T[K] extends Array<any>
				? T[K]
				: T[K] extends Date
					? T[K]
					: PrettifyDeep<T[K]>
			: T[K];
} & {};

export type Prettify<T> = Omit<T, never>;

export function rng(items: any[]) {
	return items[Math.floor(Math.random() * items.length)];
}
