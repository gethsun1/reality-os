import 'dotenv/config';
import { StoryClient, uploadJsonToIPFS, AbvClient } from '@realityos/integrations';
import { getArg } from './utils';

async function main() {
  const name = getArg('name', 'New Contestant');
  const description = getArg('description', 'RealityOS contestant');
  const mediaUrl = getArg('media');
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

  const upload = await uploadJsonToIPFS(metadata, {
    apiKey: process.env.IPFS_API_KEY,
    apiUrl: process.env.IPFS_API_URL,
  });

  const story = new StoryClient({ apiKey: process.env.STORY_API_KEY });
  const resp = await story.registerAsset({
    kind: 'contestant',
    metadataURI: upload.uri,
    royaltyBps,
  });

  console.log('Contestant registered', { assetId: resp.assetId, royaltyBps, metadata: upload.uri });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

