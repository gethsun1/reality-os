import 'dotenv/config';
import { registerIPAsset } from '@realityos/integrations';
import { getArg, requireArg, requireEnv } from './utils';

async function main() {
  const contestantId = requireArg('contestantId');
  const title = getArg('title', 'Episode');
  const description = getArg('description', 'Episode description');
  const mediaUrl = getArg('media');
  const royaltyBps = Number(getArg('royaltyBps', '300'));

  const metadata = {
    name: title,
    description,
    media: mediaUrl,
    attributes: [
      { trait_type: 'role', value: 'episode' },
      { trait_type: 'contestantId', value: contestantId },
    ],
  };

  const resp = await registerIPAsset({
    kind: 'episode',
    metadata,
    parentId: contestantId,
    royaltyBps,
    ipfsApiKey: requireEnv('IPFS_API_KEY'),
    ipfsApiUrl: requireEnv('IPFS_API_URL'),
    storyApiKey: requireEnv('STORY_API_KEY'),
  });

  console.log('Episode registered', { assetId: resp.assetId, parent: contestantId, metadata: resp.metadataURI });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

