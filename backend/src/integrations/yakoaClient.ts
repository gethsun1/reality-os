import axios, { type AxiosInstance } from 'axios';

export interface YakoaVerificationInput {
  url?: string;
  content?: string; // base64 or raw text
  mimeType?: string;
}

export interface YakoaVerificationResult {
  score: number;
  creator?: string;
  references?: Array<{ source: string; url?: string; confidence?: number }>;
  raw?: unknown;
}

export class YakoaClient {
  private client: AxiosInstance;

  constructor(opts?: { baseURL?: string; apiKey?: string }) {
    this.client = axios.create({
      baseURL: opts?.baseURL || process.env.YAKOA_BASE_URL || 'https://api.yakoa.xyz',
      headers: {
        'Content-Type': 'application/json',
        ...(opts?.apiKey ? { 'x-api-key': opts.apiKey } : {}),
      },
      timeout: 30_000,
    });
  }

  async verify(input: YakoaVerificationInput): Promise<YakoaVerificationResult> {
    const { data } = await this.client.post('/v1/verify', input);
    return {
      score: data.score ?? 0,
      creator: data.creator,
      references: data.references,
      raw: data,
    };
  }
}


