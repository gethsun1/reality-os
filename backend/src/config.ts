import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 4000),
  baseUrl: process.env.BACKEND_BASE_URL || 'http://localhost:4000',
  storyApiKey: process.env.STORY_API_KEY,
  yokoaApiKey: process.env.YAKOA_API_KEY,
  ipfsApiUrl: process.env.IPFS_API_URL,
  ipfsApiKey: process.env.IPFS_API_KEY,
  realityContract: process.env.REALITY_CONTRACT_ADDRESS,
  franchiseToken: process.env.FRANCHISE_TOKEN_ADDRESS,
};

