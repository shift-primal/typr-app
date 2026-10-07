import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSocket } from "#/hooks/use-socket";

const Home = () => {
	const { status, messages, send } = useSocket();

	const [input, setInput] = useState<string>("");

	const toWebsocketMsg = (text: string) =>
		JSON.stringify({ type: "echo", text });

	return (
		<div className="p-8">
			<span>Status: {status}</span>
			<div className="border flex flex-col">
				<span>Messages:</span>
				{messages.map((m, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <test>
					<span key={i}>{JSON.parse(m).text}</span>
				))}
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					send(toWebsocketMsg(input));
					setInput("");
				}}
			>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<button type="submit">Send</button>
			</form>
		</div>
	);
};

export const Route = createFileRoute("/")({ component: Home });
