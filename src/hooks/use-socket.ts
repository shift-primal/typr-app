import { useEffect, useRef, useState } from "react";

import {
	type ClientMessage,
	type ServerMessage,
	serverMessage,
} from "#/server/realtime/protocol";

export const useSocket = () => {
	const ws = useRef<WebSocket | null>(null);

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
					setMessages((m) => [...m, result.data]);
				} else {
					console.warn("Invalid message:", result.error);
				}
			} catch (err) {
				console.error("Error parsing message:", err);
			}
		};
		socket.onclose = () => setStatus("closed");

		return () => {
			socket.onopen = socket.onmessage = socket.onclose = null;
			socket.close();
		};
	}, []);

	const send = (message: ClientMessage) => {
		if (ws.current?.readyState === WebSocket.OPEN)
			ws.current.send(JSON.stringify(message));
	};

	return { status, messages, send };
};
