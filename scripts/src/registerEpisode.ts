import 'dotenv/config';
import { StoryClient, uploadJsonToIPFS } from '@realityos/integrations';
import { getArg, requireArg } from './utils';

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

  const upload = await uploadJsonToIPFS(metadata, {
    apiKey: process.env.IPFS_API_KEY,
    apiUrl: process.env.IPFS_API_URL,
  });

  const story = new StoryClient({ apiKey: process.env.STORY_API_KEY });
  const resp = await story.registerAsset({
    kind: 'episode',
    metadataURI: upload.uri,
    parentId: contestantId,
    royaltyBps,
  });

  console.log('Episode registered', { assetId: resp.assetId, parent: contestantId, metadata: upload.uri });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

