import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const { STORY_RPC_URL, STORY_CHAIN_ID, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    storyTestnet: {
      url: STORY_RPC_URL || '',
      chainId: STORY_CHAIN_ID ? Number(STORY_CHAIN_ID) : 1513,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
};

export default config;



