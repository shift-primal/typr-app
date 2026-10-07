import { z } from "zod";

// Every websocket message is JSON text, one of these unions keyed by `type`.
// `echo` is a placeholder; add real message types here.

export const clientMessage = z.discriminatedUnion("type", [
	z.object({ type: z.literal("echo"), text: z.string().max(1000) }),
]);
export type ClientMessage = z.infer<typeof clientMessage>;

export const serverMessage = z.discriminatedUnion("type", [
	z.object({ type: z.literal("echo"), text: z.string() }),
	z.object({ type: z.literal("server_restarting") }),
]);
export type ServerMessage = z.infer<typeof serverMessage>;
