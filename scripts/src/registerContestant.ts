import 'dotenv/config';
import { AbvClient, registerIPAsset } from '@realityos/integrations';
import { getArg, requireEnv } from './utils';

async function main() {
  const name = getArg('name', 'New Contestant');
  const description = getArg('description', 'RealityOS contestant');
  const mediaUrl = getArg('media') || getArg('image');
  const royaltyBps = Number(getArg('royaltyBps', '500'));
  const useAbv = getArg('abv', 'false') === 'true';

  let metadata = {
    name,
    description,
    media: mediaUrl,
    attributes: [{ trait_type: 'role', value: 'contestant' }],
  } as Record<string, unknown>;

  if (useAbv && mediaUrl) {
    const abv = new AbvClient({ apiKey: process.env.ABV_API_KEY });
    const analyzed = await abv.analyzeMedia({ url: mediaUrl });
    metadata = { ...metadata, abv: analyzed };
  }

  const resp = await registerIPAsset({
    kind: 'contestant',
    metadata,
    royaltyBps,
    ipfsApiKey: requireEnv('IPFS_API_KEY'),
    ipfsApiUrl: requireEnv('IPFS_API_URL'),
    storyApiKey: requireEnv('STORY_API_KEY'),
  });

  console.log('Contestant registered', { assetId: resp.assetId, royaltyBps, metadata: resp.metadataURI });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

