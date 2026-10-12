import { createFileRoute } from "@tanstack/react-router";

import { EnterRoom } from "#/components/enter-room";

const Home = () => {
	return (
		<div className="flex items-center justify-center h-full">
			<EnterRoom />
		</div>
	);
};

export const Route = createFileRoute("/")({ component: Home });
