import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { uploadJsonToIPFS } from './ipfs';

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

export interface RegisterIPInput {
  kind: StoryAssetKind;
  metadata: Record<string, unknown>;
  parentId?: string;
  royaltyBps?: number;
  ipfsApiUrl?: string;
  ipfsApiKey?: string;
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
    const { data } = await this.postWithRetry<StoryAssetResponse>('/v1/assets', body);
    return data as StoryAssetResponse;
  }

  async mintRoyaltyToken(assetId: string, amount: string): Promise<{ txHash: string }> {
    const { data } = await this.postWithRetry<{ txHash: string }>(`/v1/assets/${assetId}/royalty/mint`, { amount });
    return data as { txHash: string };
  }

  private async postWithRetry<T>(
    url: string,
    body: unknown,
    maxRetries = 2,
    retryDelayMs = 500
  ): Promise<AxiosResponse<T>> {
    let attempt = 0;
    // simple linear retry with delay
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        return await this.client.post<T>(url, body);
      } catch (err) {
        attempt += 1;
        if (attempt > maxRetries) throw err;
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }
}

export async function registerIPAsset(
  input: RegisterIPInput & { storyApiKey?: string }
): Promise<StoryAssetResponse & { metadataURI: string }> {
  const story = new StoryClient({ apiKey: input.storyApiKey });
  const upload = await uploadJsonToIPFS(input.metadata, { apiUrl: input.ipfsApiUrl, apiKey: input.ipfsApiKey });
  const resp = await story.registerAsset({
    kind: input.kind,
    metadataURI: upload.uri,
    parentId: input.parentId,
    royaltyBps: input.royaltyBps,
  });
  return { ...resp, metadataURI: upload.uri };
}


