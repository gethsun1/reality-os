# RealityOS — Programmable Reality Competition on Story Protocol

RealityOS models contestants, episodes, and fan contributions as programmable IP objects on Story Protocol. Authenticity is checked with Yakoa, economics run through royalty fractions and a franchise staking token, and the experience is delivered via Fastify + Next.js + scripts.

## Architecture (monorepo)
- `contracts/` — Solidity (Hardhat) for `RealityShowIP` (ERC1155 royalty fractions) + `FranchiseToken` (ERC20 staking). Deploy script writes addresses/ABIs to `docs/addresses.json` and `docs/abis/*`.
- `backend/` — Fastify API with Swagger docs, Yakoa authenticity checks, Story registration, analytics ingest, and an ethers + Prisma indexer.
- `frontend/` — Next.js UI for authenticity checks, contestant/episode creation, fan votes, staking, and investment views.
- `integrations/` — Typed Story, Yakoa, ABV, and IPFS clients with retry + IPFS fallback helpers.
- `scripts/` — CLI flows (`registerContestant`, `registerEpisode`, `registerContribution`, `e2eHappyPath`).
- `docs/` — Diagrams, deployment notes, event schemas, and `AGENT_GUIDE.md`.

## Environment
Use `.env.example` as a template. Key values:
- Story: `STORY_RPC_URL`, `STORY_CHAIN_ID`, `STORY_API_KEY`, `PRIVATE_KEY`
- Contracts: `REALITY_CONTRACT_ADDRESS`, `FRANCHISE_TOKEN_ADDRESS`, `BASE_URI`
- Storage: `IPFS_API_URL`, `IPFS_API_KEY`, `IPFS_FALLBACK_URLS`
- Auth: `YAKOA_API_KEY`, optional `ABV_API_KEY`
- Frontend: `NEXT_PUBLIC_*` mirrors backend + contract addresses

## Workspace Commands
- Install: `npm install`
- Lint/Type/Build/Test: `npm run validate`
- Contracts: `npm run compile -w contracts` / `npm test -w contracts`
- Backend: `DATABASE_URL="file:./dev.db" npm run prisma:dev -w backend` then `npm run build -w backend`
- Scripts: `npm run typecheck -w scripts`
- Frontend: `npm run typecheck -w frontend`
- Demo seed: `npm run demo:seed`

## Contract Deploy (Story testnet)
```
cd contracts
npx hardhat compile
npx hardhat test
STORY_RPC_URL=... STORY_CHAIN_ID=1513 PRIVATE_KEY=... npx hardhat run scripts/deploy.ts --network storyTestnet
```
Outputs: `docs/addresses.json`, `docs/abis/RealityShowIP.json`, `docs/abis/FranchiseToken.json`.

## Backend (API + Indexer)
```
cd backend
DATABASE_URL="file:./dev.db" npm run prisma:dev
npm run dev
```
Routes:
- `GET /health`
- `POST /authenticity/verify` — Yakoa check
- `POST /ip/register` — kind=`contestant|episode|contribution`
- `POST /analytics/ingest` — engagement events
- `GET /docs` — Swagger UI
Indexer auto-starts when `STORY_RPC_URL` and `REALITY_CONTRACT_ADDRESS` are set.

## Frontend (Next.js)
```
cd frontend
npm run dev
```
Requires backend URL + contract addresses in `NEXT_PUBLIC_*`. UI surfaces authenticity verification, contestant/episode creation, fan votes, staking prompts, and investment cards.

## Scripts (CLI)
- Contestant: `npm run register:contestant --workspace=scripts -- --name "Ava" --media https://...`
- Episode: `npm run register:episode --workspace=scripts -- --contestantId 1 --title "Pilot"`
- Contribution: `npm run register:contribution --workspace=scripts -- --episodeId 2 --media https://... --text "fan idea"`
- Demo seed: `npm run demo:seed`

## Contribution Guide
- Keep ABIs/addresses in sync via the deploy script (writes to `docs/`).
- Use `npm run validate` before PRs; CI mirrors this pipeline.
- Prefer the shared integrations clients (`@realityos/integrations`) for Story/Yakoa/IPFS; they include retry + fallback.
- Update Swagger (`/docs`) when adding backend routes and ensure Prisma migrations are committed (not the `.db` file).