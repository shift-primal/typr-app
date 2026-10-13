import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/solo")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/solo"!</div>;
}
