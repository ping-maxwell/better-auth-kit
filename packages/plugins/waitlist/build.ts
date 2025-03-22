import { build, type Config } from "@better-auth-kit/internal-build";

export const config: Config = {
	enableDts: true,
};
build(config);
