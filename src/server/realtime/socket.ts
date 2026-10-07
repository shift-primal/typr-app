import { defineWebSocketHandler } from "nitro";

import { env } from "#/env.ts";

import {
	addPeer,
	markAlive,
	removePeer,
	send,
	withinRateLimit,
} from "./peers.ts";
import { clientMessage } from "./protocol.ts";

const MAX_MESSAGE_BYTES = 4096;

export default defineWebSocketHandler({
	upgrade(request) {
		if (request.headers.get("origin") !== env.APP_URL) {
			throw new Response("Forbidden", { status: 403 });
		}
	},
	open(peer) {
		addPeer(peer);
		peer.subscribe("lobby");
	},
	message(peer, message) {
		markAlive(peer);
		const raw = message.text();
		if (Buffer.byteLength(raw) > MAX_MESSAGE_BYTES) {
			peer.close(1009, "message_too_big");
			return;
		}
		if (!withinRateLimit(peer)) {
			peer.close(1008, "rate_limited");
			return;
		}
		let json: unknown;
		try {
			json = JSON.parse(raw);
		} catch {
			peer.close(1008, "invalid_message");
			return;
		}
		const parsed = clientMessage.safeParse(json);
		if (!parsed.success) {
			peer.close(1008, "invalid_message");
			return;
		}
		switch (parsed.data.type) {
			case "echo":
				for (const p of peer.peers)
					send(p, { type: "echo", text: parsed.data.text });
				break;
		}
	},
	pong(peer) {
		markAlive(peer);
	},
	close(peer) {
		removePeer(peer);
	},
	error(peer) {
		removePeer(peer);
	},
});
