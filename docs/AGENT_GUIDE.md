# RealityOS Agent Guide

## Glossary
- **Contestant**: Core IP node; parent for episodes and contributions.
- **Episode**: Child IP under a contestant; can mint royalty fractions.
- **Contribution**: Fan-generated child under an episode, with authenticity proof (Yakoa).
- **Royalty Fraction**: ERC1155 supply that represents revenue share for an asset.
- **Franchise Token (RFT)**: ERC20 used for staking and reputation boosts.
- **Indexer**: Fastify + Prisma service that syncs on-chain RealityShowIP events into SQLite/Postgres.

## Build & Test Cycle
1. `npm install`
2. Contracts: `npm run compile -w contracts` and `npm test -w contracts`
3. Backend: `DATABASE_URL="file:./dev.db" npm run prisma:dev -w backend` then `npm run build -w backend`
4. Integrations/scripts: `npm run typecheck -w integrations && npm run typecheck -w scripts`
5. Frontend: `npm run typecheck -w frontend`
6. Full sweep: `npm run validate`

## Deploy Cycle (Story testnet + Vercel/Railway)
1. Set envs (`.env.example` as template): Story RPC/API key, PRIVATE_KEY, IPFS keys, YAKOA key, BACKEND_BASE_URL.
2. Deploy contracts: `cd contracts && npx hardhat run scripts/deploy.ts --network storyTestnet`  
   - ABIs/addresses written to `docs/addresses.json` and `docs/abis/*`.
3. Backend: point `DATABASE_URL` to prod DB; run `npm run build -w backend`; deploy to Railway/Fly.
4. Frontend: set `NEXT_PUBLIC_*` vars (backend URL, chain ID, contract addresses); deploy to Vercel.

## Expected Outputs per Stage
- **Contracts**: `docs/addresses.json`, `docs/abis/RealityShowIP.json`, successful test suite.
- **Backend**: `/docs` Swagger UI live, indexer logs syncing events, DB tables populated.
- **Scripts**: CLI flows for registering contestant/episode/contribution; `npm run demo:seed`.
- **Frontend**: Pages show registered assets, allow authenticity checks, episode creation, fan votes/staking requests.

## Operational Tips
- If IPFS primary fails, fall back via `IPFS_FALLBACK_URLS` (comma-separated).
- Indexer auto-starts when `STORY_RPC_URL` and `REALITY_CONTRACT_ADDRESS` are set.
- Use `npm run demo:seed` to seed the Story API/IPFS with sample assets for demos.

