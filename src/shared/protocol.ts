import { z } from "zod";

const playerName = z.string().min(2).max(16);

const player = z.object({ id: z.string(), name: playerName });

export type Player = z.infer<typeof player>;

export const clientMessage = z.discriminatedUnion("type", [
	z.object({ type: z.literal("echo"), text: z.string().max(1000) }),
	z.object({
		type: z.literal("create_room"),
		requestId: z.number().int(),
		name: playerName,
	}),
	z.object({
		type: z.literal("join_room"),
		requestId: z.number().int(),
		roomId: z.string().length(4),
		name: playerName,
	}),
]);

export const serverMessage = z.discriminatedUnion("type", [
	z.object({ type: z.literal("echo"), text: z.string() }),
	z.object({ type: z.literal("server_restarting") }),
	z.object({
		type: z.literal("room_joined"),
		requestId: z.number().int(),
		roomId: z.string(),
		players: z.array(player),
	}),
	z.object({ type: z.literal("player_joined"), player }),
	z.object({ type: z.literal("player_left"), id: z.string() }),
	z.object({
		type: z.literal("room_error"),
		requestId: z.number().int(),
		message: z.string(),
	}),
]);

export type ClientMessage = z.infer<typeof clientMessage>;
export type ServerMessage = z.infer<typeof serverMessage>;
