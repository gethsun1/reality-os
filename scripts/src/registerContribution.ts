import 'dotenv/config';
import { StoryClient, uploadJsonToIPFS, YakoaClient } from '@realityos/integrations';
import { getArg, requireArg } from './utils';

async function main() {
  const episodeId = requireArg('episodeId');
  const contributor = getArg('contributor', 'fan');
  const contentUrl = getArg('media');
  const text = getArg('text');
  const royaltyBps = Number(getArg('royaltyBps', '200'));
  const verify = getArg('verify', 'true') === 'true';

  let yakoaResult: unknown;
  if (verify && (contentUrl || text)) {
    const yakoa = new YakoaClient({ apiKey: process.env.YAKOA_API_KEY });
    yakoaResult = await yakoa.verify({
      url: contentUrl,
      content: text,
    });
  }

  const metadata = {
    name: `Contribution by ${contributor}`,
    description: text,
    media: contentUrl,
    attributes: [
      { trait_type: 'role', value: 'contribution' },
      { trait_type: 'episodeId', value: episodeId },
      { trait_type: 'contributor', value: contributor },
    ],
    yakoa: yakoaResult,
  };

  const upload = await uploadJsonToIPFS(metadata, {
    apiKey: process.env.IPFS_API_KEY,
    apiUrl: process.env.IPFS_API_URL,
  });

  const story = new StoryClient({ apiKey: process.env.STORY_API_KEY });
  const resp = await story.registerAsset({
    kind: 'contribution',
    metadataURI: upload.uri,
    parentId: episodeId,
    royaltyBps,
  });

  console.log('Contribution registered', {
    assetId: resp.assetId,
    parent: episodeId,
    metadata: upload.uri,
    yakoa: yakoaResult,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

