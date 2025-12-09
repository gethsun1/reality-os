import { ethers } from 'ethers';
import { prisma } from '../db/client';

// Minimal ABI fragments for RealityShowIP events
const ABI = [
  'event ContestantRegistered(uint256 indexed contestantId, address indexed creator, string metadataURI, uint256 royaltyTokenId, uint16 royaltyBps)',
  'event EpisodeTokenized(uint256 indexed episodeId, uint256 indexed contestantId, string metadataURI, uint256 royaltyTokenId, uint16 royaltyBps)',
  'event FanContributionRegistered(uint256 indexed contributionId, uint256 indexed episodeId, address indexed contributor, string metadataURI, uint16 royaltyBps)',
];

export async function startIndexer(opts: {
  rpcUrl: string;
  contractAddress: string;
  startBlock?: number;
}) {
  const provider = new ethers.JsonRpcProvider(opts.rpcUrl);
  const contract = new ethers.Contract(opts.contractAddress, ABI, provider);

  contract.on('ContestantRegistered', async (id, creator, metadataURI) => {
    await prisma.iPAsset.upsert({
      where: { assetId: id.toString() },
      update: {},
      create: {
        chainId: Number(process.env.STORY_CHAIN_ID || 1513),
        contract: opts.contractAddress,
        assetType: 'contestant',
        assetId: id.toString(),
        metadataURI,
        creator,
        royaltyBps: 0,
      },
    });
  });

  contract.on('EpisodeTokenized', async (episodeId, contestantId, metadataURI) => {
    await prisma.iPAsset.upsert({
      where: { assetId: episodeId.toString() },
      update: {},
      create: {
        chainId: Number(process.env.STORY_CHAIN_ID || 1513),
        contract: opts.contractAddress,
        assetType: 'episode',
        assetId: episodeId.toString(),
        metadataURI,
        creator: 'onchain',
        parentId: contestantId.toString(),
        royaltyBps: 0,
      },
    });
  });

  contract.on('FanContributionRegistered', async (contributionId, episodeId, contributor, metadataURI) => {
    await prisma.iPAsset.upsert({
      where: { assetId: contributionId.toString() },
      update: {},
      create: {
        chainId: Number(process.env.STORY_CHAIN_ID || 1513),
        contract: opts.contractAddress,
        assetType: 'contribution',
        assetId: contributionId.toString(),
        metadataURI,
        creator: contributor,
        parentId: episodeId.toString(),
        royaltyBps: 0,
      },
    });
  });

  return { provider, contract };
}

