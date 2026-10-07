try {
	process.loadEnvFile();
} catch {}

export const env = {
	DATABASE_URL:
		process.env.DATABASE_URL ?? "postgres://typr:typr@localhost:5433/typr",
	APP_URL: process.env.APP_URL ?? "http://localhost:3000",
};
