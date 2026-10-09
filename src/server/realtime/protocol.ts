import { z } from "zod";

export const clientMessage = z.discriminatedUnion("type", [
	z.object({ type: z.literal("echo"), text: z.string().max(1000) }),
	z.object({ type: z.literal("create_room") }),
	z.object({ type: z.literal("join_room"), roomId: z.string().length(4) }),
]);

export const serverMessage = z.discriminatedUnion("type", [
	z.object({ type: z.literal("echo"), text: z.string() }),
	z.object({ type: z.literal("server_restarting") }),
	z.object({
		type: z.literal("room_joined"),
		roomId: z.string(),
		players: z.array(z.string()),
	}),
	z.object({ type: z.literal("player_joined"), id: z.string() }),
	z.object({ type: z.literal("player_left"), id: z.string() }),
	z.object({ type: z.literal("room_error"), message: z.string() }),
]);

export type ClientMessage = z.infer<typeof clientMessage>;
export type ServerMessage = z.infer<typeof serverMessage>;
