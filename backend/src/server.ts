import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { config } from './config';
import { StoryClient, uploadJsonToIPFS, YakoaClient } from '@realityos/integrations';
import { prisma } from './db/client';

const app = Fastify({ logger: true });
const story = new StoryClient({ apiKey: config.storyApiKey });
const yakoa = new YakoaClient({ apiKey: config.yokoaApiKey });

app.register(cors, { origin: true });
app.register(formbody);

app.get('/health', async () => ({ status: 'ok' }));

app.post('/api/verify', async (request, reply) => {
  try {
    // @ts-expect-error fastify lacks body typing here
    const { url, content, mimeType } = request.body || {};
    const result = await yakoa.verify({ url, content, mimeType });
    return { result };
  } catch (err) {
    request.log.error(err);
    reply.code(400);
    return { error: 'verification_failed' };
  }
});

app.post('/api/register/contestant', async (request, reply) => {
  try {
    // @ts-expect-error body typing simplified
    const { wallet, name, description, media, royaltyBps = 500 } = request.body || {};
    const metadata = { name, description, media, attributes: [{ trait_type: 'role', value: 'contestant' }] };
    const upload = await uploadJsonToIPFS(metadata, {
      apiUrl: config.ipfsApiUrl,
      apiKey: config.ipfsApiKey,
    });
    const resp = await story.registerAsset({
      kind: 'contestant',
      metadataURI: upload.uri,
      royaltyBps,
    });
    await upsertAsset({
      wallet,
      assetType: 'contestant',
      assetId: resp.assetId,
      metadataURI: upload.uri,
      royaltyBps,
    });
    return { assetId: resp.assetId, metadataURI: upload.uri };
  } catch (err) {
    request.log.error(err);
    reply.code(400);
    return { error: 'contestant_registration_failed' };
  }
});

app.post('/api/register/episode', async (request, reply) => {
  try {
    // @ts-expect-error body typing simplified
    const { wallet, contestantId, title, description, media, royaltyBps = 300 } = request.body || {};
    const metadata = {
      name: title,
      description,
      media,
      attributes: [
        { trait_type: 'role', value: 'episode' },
        { trait_type: 'contestantId', value: contestantId },
      ],
    };
    const upload = await uploadJsonToIPFS(metadata, { apiUrl: config.ipfsApiUrl, apiKey: config.ipfsApiKey });
    const resp = await story.registerAsset({
      kind: 'episode',
      metadataURI: upload.uri,
      parentId: contestantId,
      royaltyBps,
    });
    await upsertAsset({
      wallet,
      assetType: 'episode',
      assetId: resp.assetId,
      metadataURI: upload.uri,
      royaltyBps,
      parentId: contestantId,
    });
    return { assetId: resp.assetId, metadataURI: upload.uri };
  } catch (err) {
    request.log.error(err);
    reply.code(400);
    return { error: 'episode_registration_failed' };
  }
});

app.post('/api/register/contribution', async (request, reply) => {
  try {
    // @ts-expect-error body typing simplified
    const { wallet, episodeId, contributor, media, text, royaltyBps = 200 } = request.body || {};
    const verification = await yakoa.verify({ url: media, content: text });
    const metadata = {
      name: `Contribution by ${contributor || wallet}`,
      description: text,
      media,
      yakoa: verification,
      attributes: [
        { trait_type: 'role', value: 'contribution' },
        { trait_type: 'episodeId', value: episodeId },
      ],
    };
    const upload = await uploadJsonToIPFS(metadata, { apiUrl: config.ipfsApiUrl, apiKey: config.ipfsApiKey });
    const resp = await story.registerAsset({
      kind: 'contribution',
      metadataURI: upload.uri,
      parentId: episodeId,
      royaltyBps,
    });
    await upsertAsset({
      wallet,
      assetType: 'contribution',
      assetId: resp.assetId,
      metadataURI: upload.uri,
      royaltyBps,
      parentId: episodeId,
    });
    return { assetId: resp.assetId, metadataURI: upload.uri, yakoa: verification };
  } catch (err) {
    request.log.error(err);
    reply.code(400);
    return { error: 'contribution_registration_failed' };
  }
});

app.post('/api/events/ingest', async (request, reply) => {
  try {
    // @ts-expect-error body typing simplified
    const { type, payload } = request.body || {};
    await prisma.engagement.create({
      data: {
        user: { connectOrCreate: { where: { wallet: payload?.wallet }, create: { wallet: payload?.wallet } } },
        asset: { connect: { id: payload?.assetRef } },
        action: type || 'event',
        weight: payload?.weight ?? 1,
      },
    });
    return { ok: true };
  } catch (err) {
    request.log.error(err);
    reply.code(400);
    return { error: 'ingest_failed' };
  }
});

async function upsertAsset(params: {
  wallet?: string;
  assetType: string;
  assetId: string;
  metadataURI: string;
  royaltyBps: number;
  parentId?: string;
}) {
  const user = params.wallet
    ? await prisma.user.upsert({
        where: { wallet: params.wallet },
        update: {},
        create: { wallet: params.wallet },
      })
    : null;

  return prisma.iPAsset.upsert({
    where: { assetId: params.assetId },
    update: {},
    create: {
      chainId: Number(process.env.STORY_CHAIN_ID || 1513),
      contract: process.env.REALITY_CONTRACT_ADDRESS || 'onchain',
      assetType: params.assetType,
      assetId: params.assetId,
      metadataURI: params.metadataURI,
      creator: params.wallet || 'unknown',
      parentId: params.parentId,
      royaltyBps: params.royaltyBps,
      engagements: user
        ? {
            create: {
              userId: user.id,
              action: 'register',
              weight: 1,
            },
          }
        : undefined,
    },
  });
}

app.listen({ port: config.port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server running at ${address}`);
});

