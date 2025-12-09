# AI Demo (Holoworld Ava Studio)

Use these prompts to generate a 30–60s teaser and contestant avatars, then register resulting media via `scripts/registerContestant.ts`.

## Teaser Prompt
- Scene: Futuristic studio, neon-blue stage, live vote overlay.
- Voiceover: “Welcome to RealityOS — where fans write the show on-chain.”
- Shots: 3 contestants intro, challenge clip, fan dashboard overlay, staking animation.

## Contestant Avatar Prompt
- “Portrait, cyberpunk reality competitor, confident smile, teal accent lighting.”
- Export as mp4 or png; upload to IPFS/Arweave; capture CID.

## Register Generated Media
1) Upload file to IPFS (web UI or `uploadJsonToIPFS`).
2) Run `npm run register:contestant --workspace @realityos/scripts -- --name=\"Ava\" --media=ipfs://CID`.
3) Verify authenticity with `registerContribution.ts --verify=true` if needed.

## Assets Folder
- Place generated files here for reference (not committed by default).

