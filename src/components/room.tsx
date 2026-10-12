import { useMemo } from "react";

import { useSocketContext } from "#/hooks/socket-provider";

export const Room = () => {
	const socket = useSocketContext();

	const { roomId, players } = useMemo(() => {
		let roomId: string | null = null;
		let players: { id: string; name: string }[] = [];

		for (const m of socket.messages) {
			switch (m.type) {
				case "room_joined":
					roomId = m.roomId;
					players = m.players;
					break;
				case "player_joined":
					if (!players.some((p) => p.id === m.player.id))
						players = [...players, m.player];
					break;
				case "player_left":
					players = players.filter((p) => p.id !== m.id);
					break;
			}
		}

		return { roomId, players };
	}, [socket.messages]);

	if (!roomId) return null;

	return (
		<div>
			<h2>Room {roomId}</h2>
			<ul>
				{players.map((p) => (
					<li key={p.id}>{p.name}</li>
				))}
			</ul>
		</div>
	);
};
