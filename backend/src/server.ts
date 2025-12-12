import fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config';
import { StoryClient, uploadJsonToIPFS, YakoaClient } from './integrations';
import { prisma } from './db/client';
import { startIndexer } from './events/indexer';

let appInstance: FastifyInstance | null = null;
let indexerStarted = false;

type VerifyBody = { url?: string; content?: string; mimeType?: string };
type IpRegisterBody = {
  wallet?: string;
  kind?: 'contestant' | 'episode' | 'contribution';
  contestantId?: string;
  episodeId?: string;
  name?: string;
  title?: string;
  description?: string;
  media?: string;
  text?: string;
  royaltyBps?: number;
  verify?: boolean;
};
type AnalyticsBody = { type?: string; payload?: { wallet?: string; assetRef?: number; weight?: number } };

export async function buildApp() {
  if (appInstance) return appInstance;

  const app = fastify({ logger: true }) as any as FastifyInstance;
  const story = new StoryClient({ apiKey: config.storyApiKey });
  const yakoa = new YakoaClient({ apiKey: config.yokoaApiKey });

  app.register(cors, { origin: true });
  app.register(formbody);
  app.register(swagger, {
    openapi: {
      info: { title: 'RealityOS API', version: '0.1.0' },
      servers: [{ url: config.baseUrl }],
    },
  });
  app.register(swaggerUi, { routePrefix: '/docs' });

  const api = app as any;

  api.get('/health', async () => ({ status: 'ok' }));

  api.post('/authenticity/verify', async (request: FastifyRequest<{ Body: VerifyBody }>, reply: FastifyReply) => {
    try {
      const { url, content, mimeType } = request.body || {};
      const result = await yakoa.verify({ url, content, mimeType });
      return { result };
    } catch (err) {
      request.log.error(err);
      reply.code(400);
      return { error: 'verification_failed' };
    }
  });

  api.post('/ip/register', async (request: FastifyRequest<{ Body: IpRegisterBody }>, reply: FastifyReply) => {
    try {
      const { wallet, kind, contestantId, episodeId, name, title, description, media, text, royaltyBps, verify } =
        request.body || {};

      const chosenRoyalty = Number(royaltyBps ?? (kind === 'contestant' ? 500 : kind === 'episode' ? 300 : 200));
      const assetKind = (kind || 'contestant') as 'contestant' | 'episode' | 'contribution';

      let yakoaResult: unknown;
      if (assetKind === 'contribution' && verify !== false && (media || text)) {
        yakoaResult = await yakoa.verify({ url: media, content: text });
      }

      const metadata =
        assetKind === 'contestant'
          ? {
              name: name || title || 'Contestant',
              description: description || 'RealityOS contestant',
              media,
              attributes: [{ trait_type: 'role', value: 'contestant' }],
            }
          : assetKind === 'episode'
            ? {
                name: title || 'Episode',
                description: description || 'Episode description',
                media,
                attributes: [
                  { trait_type: 'role', value: 'episode' },
                  { trait_type: 'contestantId', value: contestantId },
                ],
              }
            : {
                name: `Contribution by ${wallet || 'fan'}`,
                description: text,
                media,
                yakoa: yakoaResult,
                attributes: [
                  { trait_type: 'role', value: 'contribution' },
                  { trait_type: 'episodeId', value: episodeId },
                ],
              };

      const upload = await uploadJsonToIPFS(metadata, {
        apiUrl: config.ipfsApiUrl,
        apiKey: config.ipfsApiKey,
      });

      const resp = await story.registerAsset({
        kind: assetKind,
        metadataURI: upload.uri,
        parentId: assetKind === 'episode' ? contestantId : assetKind === 'contribution' ? episodeId : undefined,
        royaltyBps: chosenRoyalty,
      });

      const record = await upsertAsset({
        wallet,
        assetType: assetKind,
        assetId: resp.assetId,
        metadataURI: upload.uri,
        royaltyBps: chosenRoyalty,
        parentId: assetKind === 'episode' ? contestantId : assetKind === 'contribution' ? episodeId : undefined,
      });

      return { assetId: resp.assetId, metadataURI: upload.uri, yakoa: yakoaResult, dbId: record.id };
    } catch (err) {
      request.log.error(err);
      reply.code(400);
      return { error: 'ip_registration_failed' };
    }
  });

  api.post('/analytics/ingest', async (request: FastifyRequest<{ Body: AnalyticsBody }>, reply: FastifyReply) => {
    try {
      const { type, payload } = request.body || {};
      const data: any = {
        user: {
          connectOrCreate: {
            where: { wallet: payload?.wallet || 'unknown' },
            create: { wallet: payload?.wallet || 'unknown' },
          },
        },
        action: type || 'event',
        weight: payload?.weight ?? 1,
      };
      if (payload?.assetRef) {
        data.asset = { connect: { id: payload.assetRef } };
      }
      await prisma.engagement.create({ data });
      return { ok: true };
    } catch (err) {
      request.log.error(err);
      reply.code(400);
      return { error: 'ingest_failed' };
    }
  });

  if (config.storyRpcUrl && config.realityContract && !indexerStarted) {
    indexerStarted = true;
    startIndexer({
      rpcUrl: config.storyRpcUrl,
      contractAddress: config.realityContract,
      chainId: config.storyChainId,
    }).catch((err) => app.log.error({ err }, 'Indexer failed to start'));
  } else if (!config.storyRpcUrl || !config.realityContract) {
    app.log.warn('Indexer disabled: missing STORY_RPC_URL or REALITY_CONTRACT_ADDRESS');
  }

  appInstance = app;
  return appInstance;
}

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
      chainId: config.storyChainId,
      contract: config.realityContract || 'onchain',
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

