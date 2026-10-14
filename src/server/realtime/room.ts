import type { WebSocketPeer as Peer } from "nitro/h3";

import { send } from "./peers";

type Room = {
	id: string;
	peers: Set<Peer>;
};

const rooms = new Map<string, Room>();

const peerToRoom = new Map<Peer, string>();

const peerNames = new Map<Peer, string>();

const logRooms = () => {
	console.log(
		"rooms",
		[...rooms.values()].map((room) => ({
			id: room.id,
			players: [...room.peers].map((peer) => peer.id),
		})),
	);
};

const generateRoomCode = (): string => {
	const chars = "ABCD1234";
	let code = "";

	for (let i = 0; i < 4; i++) {
		code += chars[Math.floor(Math.random() * chars.length)];
	}

	return rooms.has(code) ? generateRoomCode() : code;
};

export const createRoom = (
	peer: Peer,
	name: string,
	requestId: number,
): string => {
	leaveCurrentRoom(peer);
	peerNames.set(peer, name);

	const roomId = generateRoomCode();
	const room: Room = { id: roomId, peers: new Set([peer]) };

	rooms.set(roomId, room);
	peerToRoom.set(peer, roomId);

	peer.subscribe(`room:${roomId}`);
	send(peer, {
		type: "room_joined",
		requestId,
		roomId: room.id,
		players: [{ id: peer.id, name }],
	});

	logRooms();

	return roomId;
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

	leaveCurrentRoom(peer);
	peerNames.set(peer, name);

	room.peers.add(peer);
	peerToRoom.set(peer, roomId);

	peer.subscribe(`room:${roomId}`);

	send(peer, {
		type: "room_joined",
		requestId,
		roomId,
		players: Array.from(room.peers).map((p) => ({
			id: p.id,
			name: peerNames.get(p) ?? "Unknown",
		})),
	});

	peer.publish(
		`room:${roomId}`,
		JSON.stringify({ type: "player_joined", player: { id: peer.id, name } }),
	);

	logRooms();
};

export const leaveCurrentRoom = (peer: Peer) => {
	const roomId = peerToRoom.get(peer);
	if (!roomId) return;

	peerToRoom.delete(peer);
	peerNames.delete(peer);
	peer.unsubscribe(`room:${roomId}`);

	const room = rooms.get(roomId);
	if (!room) return;

	room.peers.delete(peer);

	peer.publish(
		`room:${roomId}`,
		JSON.stringify({ type: "player_left", id: peer.id }),
	);

	if (room.peers.size === 0) {
		rooms.delete(roomId);
	}

	logRooms();
};
