import axios from 'axios';

export interface UploadResult {
  cid: string;
  uri: string;
  raw?: unknown;
}

export async function uploadJsonToIPFS(
  metadata: Record<string, unknown>,
  opts?: { apiUrl?: string; apiKey?: string; fallbackApiUrls?: string[] },
): Promise<UploadResult> {
  const primary = opts?.apiUrl || process.env.IPFS_API_URL;
  const fallbackEnv = process.env.IPFS_FALLBACK_URLS?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  const urls = [primary, ...(opts?.fallbackApiUrls || []), ...fallbackEnv].filter(Boolean) as string[];

  if (!urls.length) {
    throw new Error('IPFS_API_URL not set');
  }

  let lastError: unknown;
  for (const apiUrl of urls) {
    try {
      const { data } = await axios.post(apiUrl, metadata, {
        headers: {
          'Content-Type': 'application/json',
          ...(opts?.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : {}),
          ...(process.env.IPFS_API_KEY ? { 'x-api-key': process.env.IPFS_API_KEY } : {}),
        },
        timeout: 20_000,
      });

      const cid = data.cid || data.Hash || data.IpfsHash;
      if (!cid) {
        throw new Error('IPFS upload failed: missing cid');
      }
      return { cid, uri: `ipfs://${cid}`, raw: data };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('IPFS upload failed on all providers');
}

