import { createFileRoute } from "@tanstack/react-router";

// import { EnterRoom } from "#/components/enter-room";
import { Typing } from "#/components/typing";

const Home = () => {
	return (
		<div className="flex items-center justify-center h-full">
			<Typing />
			{/* <EnterRoom /> */}
		</div>
	);
};

export const Route = createFileRoute("/")({ component: Home });
