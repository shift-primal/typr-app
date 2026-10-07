# typr

Type race. TanStack Start + Nitro websockets + Drizzle on local Postgres.

```sh
pnpm install
pnpm db:up     # Postgres in Docker on localhost:5433
pnpm db:push   # sync src/db/schema.ts to the database
pnpm dev       # http://localhost:3000, websocket at ws://localhost:3000/api/ws
```

- Config lives in `src/env.ts` with local defaults; override any of it in a `.env` file.
- Websocket handler: `src/server/realtime/socket.ts`, message types: `src/server/realtime/protocol.ts`.
- `pnpm db:down` stops Postgres (data is kept in the `typr-db` volume).
