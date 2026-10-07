import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "#/env.ts";

import * as schema from "./schema.ts";

export const sql = postgres(env.DATABASE_URL, {
	max: 5,
	connect_timeout: 10,
});

export const db = drizzle(sql, { schema });
