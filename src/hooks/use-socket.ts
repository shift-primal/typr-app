import { useEffect, useRef, useState } from "react";

export const useSocket = () => {
	const ws = useRef<WebSocket | null>(null);

	const [messages, setMessages] = useState<string[]>([]);
	const [status, setStatus] = useState<"connecting" | "open" | "closed">(
		"connecting",
	);

	useEffect(() => {
		const url = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/api/ws`;

		const socket = new WebSocket(url);
		ws.current = socket;

		socket.onopen = () => setStatus("open");
		socket.onmessage = (e) => setMessages((m) => [...m, e.data]);
		socket.onclose = () => setStatus("closed");

		return () => {
			socket.onopen = socket.onmessage = socket.onclose = null;
			socket.close();
		};
	}, []);

	const send = (text: string) => {
		if (ws.current?.readyState === WebSocket.OPEN) ws.current.send(text);
	};

	return { status, messages, send };
};
