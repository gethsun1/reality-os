import axios, { AxiosInstance } from 'axios';

export type StoryAssetKind = 'contestant' | 'episode' | 'contribution';

export interface StoryAssetRequest {
  kind: StoryAssetKind;
  metadataURI: string;
  parentId?: string;
  royaltyBps?: number;
}

export interface StoryAssetResponse {
  assetId: string;
  txHash?: string;
  royaltyTokenId?: string;
}

export class StoryClient {
  private client: AxiosInstance;

  constructor(opts?: { baseURL?: string; apiKey?: string }) {
    this.client = axios.create({
      baseURL: opts?.baseURL || 'https://api.storyprotocol.net',
      headers: {
        'Content-Type': 'application/json',
        ...(opts?.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : {}),
      },
      timeout: 30_000,
    });
  }

  async registerAsset(body: StoryAssetRequest): Promise<StoryAssetResponse> {
    const { data } = await this.client.post('/v1/assets', body);
    return data;
  }

  async mintRoyaltyToken(assetId: string, amount: string): Promise<{ txHash: string }> {
    const { data } = await this.client.post(`/v1/assets/${assetId}/royalty/mint`, { amount });
    return data;
  }
}

