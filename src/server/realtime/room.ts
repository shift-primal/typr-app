import type { WebSocketPeer as Peer } from "nitro/h3";

import type { ServerMessage } from "#/shared/protocol";

import { send } from "./peers";

type RoomPlayer = { id: string; name: string; peer: Peer };

type Room = {
	id: string;
	players: Map<string, RoomPlayer>;
};

const rooms = new Map<string, Room>();
const sessions = new Map<Peer, { roomId: string; playerId: string }>();

const generateRoomCode = (): string => {
	const chars = "ABCD1234";
	let code = "";

	for (let i = 0; i < 4; i++) {
		code += chars[Math.floor(Math.random() * chars.length)];
	}

	return rooms.has(code) ? generateRoomCode() : code;
};

const broadcast = (room: Room, message: ServerMessage, except?: string) => {
	for (const player of room.players.values()) {
		if (player.id !== except) send(player.peer, message);
	}
};

export const createRoom = (peer: Peer, name: string, requestId: number) => {
	const room: Room = { id: generateRoomCode(), players: new Map() };
	rooms.set(room.id, room);
	enterRoom(peer, room, name, requestId);
};

export const joinRoom = (
	peer: Peer,
	roomId: string,
	name: string,
	requestId: number,
) => {
	const room = rooms.get(roomId);
	if (!room) {
		send(peer, { type: "room_error", requestId, message: "Room not found" });
		return;
	}
	enterRoom(peer, room, name, requestId);
};

const toPlayers = (room: Room) =>
	[...room.players.values()].map(({ id, name }) => ({ id, name }));

const enterRoom = (peer: Peer, room: Room, name: string, requestId: number) => {
	if (sessions.get(peer)?.roomId === room.id) {
		send(peer, {
			type: "room_joined",
			requestId,
			roomId: room.id,
			players: toPlayers(room),
		});
		return;
	}

	leaveCurrentRoom(peer);

	const player: RoomPlayer = { id: peer.id, name, peer };
	room.players.set(player.id, player);
	sessions.set(peer, { roomId: room.id, playerId: player.id });

	send(peer, {
		type: "room_joined",
		requestId,
		roomId: room.id,
		players: toPlayers(room),
	});

	broadcast(
		room,
		{ type: "player_joined", player: { id: player.id, name } },
		player.id,
	);
};

export const leaveCurrentRoom = (peer: Peer) => {
	const session = sessions.get(peer);
	if (!session) return;

	sessions.delete(peer);

	const room = rooms.get(session.roomId);
	if (!room) return;

	room.players.delete(session.playerId);

	if (room.players.size === 0) {
		rooms.delete(room.id);
		return;
	}

	broadcast(room, { type: "player_left", id: session.playerId });
};
