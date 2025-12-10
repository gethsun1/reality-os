import 'dotenv/config';
import { registerIPAsset } from '@realityos/integrations';
import { requireEnv } from './utils';

async function main() {
  const respContestant = await registerIPAsset({
    kind: 'contestant',
    metadata: { name: 'Pilot Contestant', role: 'contestant', description: 'E2E flow' },
    royaltyBps: 500,
    ipfsApiKey: requireEnv('IPFS_API_KEY'),
    ipfsApiUrl: requireEnv('IPFS_API_URL'),
    storyApiKey: requireEnv('STORY_API_KEY'),
  });
  console.log('Contestant', respContestant);

  const respEpisode = await registerIPAsset({
    kind: 'episode',
    metadata: { name: 'Episode 1', role: 'episode', parent: respContestant.assetId },
    parentId: respContestant.assetId,
    royaltyBps: 300,
    ipfsApiKey: requireEnv('IPFS_API_KEY'),
    ipfsApiUrl: requireEnv('IPFS_API_URL'),
    storyApiKey: requireEnv('STORY_API_KEY'),
  });
  console.log('Episode', respEpisode);

  const respContribution = await registerIPAsset({
    kind: 'contribution',
    metadata: { name: 'Fan Contribution', role: 'contribution', parent: respEpisode.assetId },
    parentId: respEpisode.assetId,
    royaltyBps: 200,
    ipfsApiKey: requireEnv('IPFS_API_KEY'),
    ipfsApiUrl: requireEnv('IPFS_API_URL'),
    storyApiKey: requireEnv('STORY_API_KEY'),
  });
  console.log('Contribution', respContribution);

  console.log('E2E complete: register → mint royalty tokens (via Story) → vote/stake via frontend/backend.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

