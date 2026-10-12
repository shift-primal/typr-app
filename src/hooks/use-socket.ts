import { useEffect, useRef, useState } from "react";

import {
	type ClientMessage,
	type ServerMessage,
	serverMessage,
} from "#/server/realtime/protocol";

export const useSocket = () => {
	const ws = useRef<WebSocket | null>(null);
	const pending = useRef<((message: ServerMessage) => void) | null>(null);

	const [messages, setMessages] = useState<ServerMessage[]>([]);
	const [status, setStatus] = useState<"connecting" | "open" | "closed">(
		"connecting",
	);

	useEffect(() => {
		const url = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/api/ws`;

		const socket = new WebSocket(url);
		ws.current = socket;

		socket.onopen = () => setStatus("open");

		socket.onmessage = (e) => {
			try {
				const parsed = JSON.parse(e.data);
				const result = serverMessage.safeParse(parsed);

				if (result.success) {
					if (
						result.data.type === "room_joined" ||
						result.data.type === "room_error"
					) {
						pending.current?.(result.data);
						pending.current = null;
					}

					setMessages((m) => [...m, result.data]);
				} else {
					console.warn("Invalid message:", result.error);
				}
			} catch (err) {
				console.error("Error parsing message:", err);
			}
		};

		socket.onclose = () => {
			setStatus("closed");
			pending.current = null;
		};

		return () => {
			socket.onopen = socket.onmessage = socket.onclose = null;
			socket.close();
		};
	}, []);

	const send = (message: ClientMessage) => {
		if (ws.current?.readyState === WebSocket.OPEN)
			ws.current.send(JSON.stringify(message));
	};

	const request = (message: ClientMessage) =>
		new Promise<ServerMessage>((resolve, reject) => {
			if (ws.current?.readyState !== WebSocket.OPEN) {
				reject(new Error("socket closed"));
				return;
			}
			pending.current = resolve;
			ws.current.send(JSON.stringify(message));
		});

	return { status, messages, send, request };
};

export type Socket = ReturnType<typeof useSocket>;
