Phase 1: Websocket basics

1. Client hook

- [ ] Build a useSocket() React hook that connects, sends echo and shows replies on the page.
- [ ] Learn: the connection lifecycle (open/message/close/error), readyState, why you can't send before open, and cleaning up on unmount (React StrictMode connects twice in dev).

2. Shared message types

- [ ] Import protocol.ts on the client too, and parse every incoming message with Zod.
- [ ] Learn: one source of truth for the protocol, and never trusting what comes over the wire in either direction.

3. Broadcast chat

- [ ] Anyone connected can send a message and everyone sees it.
- [ ] Learn: the server as a relay. Try a manual loop over peers first, then crossws pub/sub (peer.subscribe("lobby") / peer.publish(...)).

4. Rooms

- [ ] Create a room, get a code, join by code, and see who's in the room. Room state lives in a Map on the server.
- [ ] Learn: the server owns state, clients only show it. Clean up on close (empty rooms get deleted). Send the full state when someone joins, then only changes after that.

5. Breaking it on purpose

- [ ] Kill the dev server mid-session and make the client reconnect with backoff. Throttle the network in devtools. Open 5 tabs.
- [ ] Learn: heartbeats (already in peers.ts), why sockets die silently, and rejoining a room after a reconnect.

Phase 2: The game

6. Solo typing test (no websockets)

- [ ] A text to type, live highlighting, and WPM and accuracy.
- [ ] Write the game logic as pure functions in something like src/game/, so the server can reuse it later.
- [ ] Learn: keeping game rules separate from the UI and from networking.

7. Players have names

- [ ] Start with a guest name kept in localStorage and sent when joining a room.
- [ ] Later, add Better Auth email login (Drizzle adapter, tables via db:push). The upgrade hook then reads the session cookie and attaches the user id to the socket.
- [ ] Learn: how a websocket gets authenticated, which is through the HTTP upgrade request.

8. Race lifecycle

- [ ] The server runs a state machine per room: lobby → countdown → racing → finished.
- [ ] Clients send progress (word index); the server validates it and broadcasts everyone's positions.
- [ ] Learn: server authority. Don't trust a client that claims "I finished in 2 seconds", and reject impossible progress.

9. Time and latency

- [ ] Synchronize clocks with ping/pong so the countdown starts at the same moment for everyone. Measure round-trip time and show it in the UI. Smooth out other players' cursors.
- [ ] Learn: why "start now" is the wrong message and "start at server time X" is the right one.

10. Save results

- [ ] Add races and race_results tables, written once when a race finishes (never mid-race). Build a history and leaderboard page with server functions and TanStack Query.
- [ ] Learn: the split between in-memory live state and Postgres for durable state.

Phase 3: Stretch goals

11. Tug of war mode

- [ ] Continuous shared state where the server runs a fixed tick loop (for example 20 times a second) instead of reacting to individual events.
- [ ] Learn: the tick-based game-server model, and batching updates.

12. Tests

- [ ] Unit tests for the game logic. Integration tests that open real sockets with Node's built-in WebSocket and play a scripted race.

13. Why it breaks with two servers

- [ ] Rooms live in one process's memory, so a second instance can't see them. Read about Redis pub/sub and stito build it.
