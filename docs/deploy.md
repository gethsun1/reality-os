# Deployment Guide

## Contracts (Story testnet)
1. Set envs in `.env`: `STORY_RPC_URL`, `STORY_CHAIN_ID`, `PRIVATE_KEY`.
2. `cd contracts && npm install && npm run compile`.
3. `npm run deploy:story` — writes addresses to `contracts/docs/addresses.json` and `docs/addresses.json`.

## Backend
1. `cd backend && npm install`.
2. Copy `.env.example` → `.env` and fill `DATABASE_URL`, Story/Yakoa/IPFS keys, deployed contract addresses.
3. `npm run prisma:dev` (SQLite) then `npm run dev`.
4. Optional: start event indexer by importing `startIndexer` with `RPC_URL` + contract address.

## Frontend (Vercel)
1. `cd frontend && npm install`.
2. Set Vercel envs: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_DYNAMIC_ENV_ID`, `NEXT_PUBLIC_COINBASE_APP_ID`, `NEXT_PUBLIC_STORY_CHAIN_ID`.
3. `npm run build` locally; deploy via `vercel --prod` or Vercel dashboard.

## E2E Happy Path
1. `npm run e2e --workspace @realityos/scripts` to register contestant → episode → contribution.
2. Open frontend: buy royalty tokens (simulated), stake franchise tokens, vote.
3. Verify media via Authenticity panel; register as IP if score passes.
4. Check backend SQLite for assets + engagements; export to Dune using `docs/dune-schemas.md`.



