import { createFileRoute } from "@tanstack/react-router";

import { Room } from "#/components/room";

export const Route = createFileRoute("/room/$roomId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Room />;
}
