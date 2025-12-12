import axios, { AxiosInstance } from 'axios';

export interface AbvAnalyzeRequest {
  url: string;
  prompt?: string;
}

export interface AbvAnalyzeResponse {
  metadataURI?: string;
  description?: string;
  tags?: string[];
  raw?: unknown;
}

export class AbvClient {
  private client: AxiosInstance;

  constructor(opts?: { baseURL?: string; apiKey?: string }) {
    this.client = axios.create({
      baseURL: opts?.baseURL || process.env.ABV_BASE_URL || 'https://api.abv.dev',
      headers: {
        'Content-Type': 'application/json',
        ...(opts?.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : {}),
      },
      timeout: 30_000,
    });
  }

  async analyzeMedia(body: AbvAnalyzeRequest): Promise<AbvAnalyzeResponse> {
    const { data } = await this.client.post('/v1/analyze', body);
    return {
      metadataURI: data.metadataUri || data.metadataURI,
      description: data.description,
      tags: data.tags,
      raw: data,
    };
  }
}



