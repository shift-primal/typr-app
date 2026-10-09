import { betterAuth } from "better-auth";

import { env } from "#/env";

export const auth = betterAuth({
	baseURL: env.APP_URL,
	emailAndPassword: { enabled: true },
});
