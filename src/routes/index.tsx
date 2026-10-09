import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { JoinRoom } from "#/components/join-room";
import { useSocket } from "#/hooks/use-socket";

const Home = () => {
	const { status, messages, send } = useSocket();

	const [input, setInput] = useState<string>("");

	return (
		<div className="flex items-center justify-center h-full">
			<JoinRoom />
		</div>
	);
};

export const Route = createFileRoute("/")({ component: Home });
