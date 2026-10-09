import { definePlugin } from "nitro";

import { sql } from "#/db/index";
import { closeAllPeers } from "#/server/realtime/peers";

export default definePlugin(() => {
	let shuttingDown = false;
	const shutdown = async (signal: NodeJS.Signals) => {
		if (shuttingDown) return;
		shuttingDown = true;
		console.log(JSON.stringify({ level: "info", msg: "shutdown", signal }));
		closeAllPeers();
		await sql.end({ timeout: 5 });
	};
	process.once("SIGTERM", shutdown);
	process.once("SIGINT", shutdown);
});
