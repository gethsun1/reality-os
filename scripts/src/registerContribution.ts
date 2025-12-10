import 'dotenv/config';
import { registerIPAsset, YakoaClient } from '@realityos/integrations';
import { getArg, requireArg, requireEnv } from './utils';

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

  const resp = await registerIPAsset({
    kind: 'contribution',
    metadata,
    parentId: episodeId,
    royaltyBps,
    ipfsApiKey: requireEnv('IPFS_API_KEY'),
    ipfsApiUrl: requireEnv('IPFS_API_URL'),
    storyApiKey: requireEnv('STORY_API_KEY'),
  });

  console.log('Contribution registered', {
    assetId: resp.assetId,
    parent: episodeId,
    metadata: resp.metadataURI,
    yakoa: yakoaResult,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

