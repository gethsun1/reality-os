import 'dotenv/config';
import { StoryClient, uploadJsonToIPFS } from '@realityos/integrations';

async function main() {
  const story = new StoryClient({ apiKey: process.env.STORY_API_KEY });

  const contestantMeta = await uploadJsonToIPFS(
    { name: 'Pilot Contestant', role: 'contestant', description: 'E2E flow' },
    { apiUrl: process.env.IPFS_API_URL, apiKey: process.env.IPFS_API_KEY },
  );
  const contestant = await story.registerAsset({
    kind: 'contestant',
    metadataURI: contestantMeta.uri,
    royaltyBps: 500,
  });
  console.log('Contestant', contestant);

  const episodeMeta = await uploadJsonToIPFS(
    { name: 'Episode 1', role: 'episode', parent: contestant.assetId },
    { apiUrl: process.env.IPFS_API_URL, apiKey: process.env.IPFS_API_KEY },
  );
  const episode = await story.registerAsset({
    kind: 'episode',
    metadataURI: episodeMeta.uri,
    parentId: contestant.assetId,
    royaltyBps: 300,
  });
  console.log('Episode', episode);

  const contributionMeta = await uploadJsonToIPFS(
    { name: 'Fan Contribution', role: 'contribution', parent: episode.assetId },
    { apiUrl: process.env.IPFS_API_URL, apiKey: process.env.IPFS_API_KEY },
  );
  const contribution = await story.registerAsset({
    kind: 'contribution',
    metadataURI: contributionMeta.uri,
    parentId: episode.assetId,
    royaltyBps: 200,
  });
  console.log('Contribution', contribution);

  console.log('E2E complete: register → mint royalty tokens (via Story) → vote/stake via frontend/backend.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

