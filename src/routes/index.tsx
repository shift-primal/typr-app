import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { EnterRoom } from "#/components/enter-room";
import { useSocket } from "#/hooks/use-socket";

const Home = () => {
	const socket = useSocket();

	const [input, setInput] = useState<string>("");

	return (
		<div className="flex items-center justify-center h-full">
			<EnterRoom socket={socket} />
		</div>
	);
};

export const Route = createFileRoute("/")({ component: Home });
