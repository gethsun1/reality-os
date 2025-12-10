import { ethers } from 'ethers';
import { prisma } from '../db/client';

// Minimal ABI fragments for RealityShowIP events
const ABI = [
  'event ContestantRegistered(uint256 indexed contestantId, address indexed creator, string metadataURI, uint256 royaltyTokenId, uint16 royaltyBps)',
  'event EpisodeTokenized(uint256 indexed episodeId, uint256 indexed contestantId, string metadataURI, uint256 royaltyTokenId, uint16 royaltyBps)',
  'event FanContributionRegistered(uint256 indexed contributionId, uint256 indexed episodeId, address indexed contributor, string metadataURI, uint16 royaltyBps)',
  'event RoyaltyFractionMinted(uint256 indexed assetId, address indexed to, uint256 amount)',
  'event FranchiseStaked(address indexed staker, uint256 amount, uint256 totalStaked)',
];

type AssetType = 'contestant' | 'episode' | 'contribution';

async function ensureAsset(params: {
  chainId: number;
  contractAddress: string;
  assetType: AssetType;
  assetId: string;
  metadataURI: string;
  creator: string;
  parentId?: string;
  royaltyBps?: number;
}) {
  return prisma.iPAsset.upsert({
    where: { assetId: params.assetId },
    update: {},
    create: {
      chainId: params.chainId,
      contract: params.contractAddress,
      assetType: params.assetType,
      assetId: params.assetId,
      metadataURI: params.metadataURI,
      creator: params.creator,
      parentId: params.parentId,
      royaltyBps: params.royaltyBps ?? 0,
    },
  });
}

export async function startIndexer(opts: {
  rpcUrl: string;
  contractAddress: string;
  chainId?: number;
  startBlock?: number;
}) {
  const provider = new ethers.JsonRpcProvider(opts.rpcUrl);
  const contract = new ethers.Contract(opts.contractAddress, ABI, provider);
  const chainId = opts.chainId ?? Number(process.env.STORY_CHAIN_ID || 1513);

  contract.on('ContestantRegistered', async (id, creator, metadataURI, _royaltyTokenId, royaltyBps) => {
    await ensureAsset({
      chainId,
      contractAddress: opts.contractAddress,
      assetType: 'contestant',
      assetId: id.toString(),
      metadataURI,
      creator,
      royaltyBps: Number(royaltyBps),
    });
  });

  contract.on('EpisodeTokenized', async (episodeId, contestantId, metadataURI, _royaltyTokenId, royaltyBps) => {
    await ensureAsset({
      chainId,
      contractAddress: opts.contractAddress,
      assetType: 'episode',
      assetId: episodeId.toString(),
      metadataURI,
      creator: 'onchain',
      parentId: contestantId.toString(),
      royaltyBps: Number(royaltyBps),
    });
  });

  contract.on('FanContributionRegistered', async (contributionId, episodeId, contributor, metadataURI, royaltyBps) => {
    await ensureAsset({
      chainId,
      contractAddress: opts.contractAddress,
      assetType: 'contribution',
      assetId: contributionId.toString(),
      metadataURI,
      creator: contributor,
      parentId: episodeId.toString(),
      royaltyBps: Number(royaltyBps),
    });
  });

  contract.on('RoyaltyFractionMinted', async (assetId, to, amount) => {
    const asset = await prisma.iPAsset.findUnique({ where: { assetId: assetId.toString() } });
    if (!asset) return;

    const user = await prisma.user.upsert({
      where: { wallet: to },
      update: {},
      create: { wallet: to },
    });

    await prisma.economicParticipation.create({
      data: {
        userId: user.id,
        assetRef: asset.id,
        amount: Number(amount),
        kind: 'royalty_mint',
      },
    });
  });

  contract.on('FranchiseStaked', async (staker, amount) => {
    const user = await prisma.user.upsert({
      where: { wallet: staker },
      update: { reputation: { increment: Number(amount) } },
      create: { wallet: staker, reputation: Number(amount) },
    });

    await prisma.fanStake.create({
      data: {
        userId: user.id,
        amount: Number(amount),
      },
    });
  });

  return { provider, contract };
}

