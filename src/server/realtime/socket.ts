import { defineWebSocketHandler } from "nitro";

import { env } from "#/env";
import { createRoom, joinRoom, leaveCurrentRoom } from "#/server/realtime/room";
import { addPeer, markAlive, removePeer, send, withinRateLimit } from "./peers";
import { clientMessage } from "./protocol";

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
			case "create_room":
				createRoom(peer);
				break;
			case "join_room":
				joinRoom(peer, parsed.data.roomId);
				break;
			case "echo": {
				const payload = { type: "echo", text: parsed.data.text } as const;
				send(peer, payload);
				peer.publish("lobby", JSON.stringify(payload));
				break;
			}
		}
	},
	pong(peer) {
		markAlive(peer);
	},
	close(peer) {
		leaveCurrentRoom(peer);
		removePeer(peer);
	},
	error(peer) {
		leaveCurrentRoom(peer);
		removePeer(peer);
	},
});
