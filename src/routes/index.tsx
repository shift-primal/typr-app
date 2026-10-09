import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useSocket } from "#/hooks/use-socket";

const Home = () => {
	const { status, messages, send } = useSocket();

	const [input, setInput] = useState<string>("");

	return (
		<div className="p-8">
			<span>Status: {status}</span>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					send({ type: "echo", text: input });
					setInput("");
				}}
				className="flex gap-2 my-4"
			>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="border"
				/>
				<button type="submit" className="border">
					Send
				</button>
			</form>
			<div className="flex flex-col border w-md">
				<span>Messages:</span>
				{messages.map((m, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <test>
					<span key={i}>
						{m.type === "echo" ? m.text : `System: ${m.type}`}
					</span>
				))}
			</div>
		</div>
	);
};

export const Route = createFileRoute("/")({ component: Home });
