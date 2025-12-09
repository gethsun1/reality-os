import axios from 'axios';

export interface UploadResult {
  cid: string;
  uri: string;
  raw?: unknown;
}

export async function uploadJsonToIPFS(
  metadata: Record<string, unknown>,
  opts?: { apiUrl?: string; apiKey?: string },
): Promise<UploadResult> {
  const apiUrl = opts?.apiUrl || process.env.IPFS_API_URL;
  if (!apiUrl) {
    throw new Error('IPFS_API_URL not set');
  }

  const { data } = await axios.post(apiUrl, metadata, {
    headers: {
      'Content-Type': 'application/json',
      ...(opts?.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : {}),
      ...(process.env.IPFS_API_KEY ? { 'x-api-key': process.env.IPFS_API_KEY } : {}),
    },
  });

  const cid = data.cid || data.Hash || data.IpfsHash;
  if (!cid) {
    throw new Error('IPFS upload failed: missing cid');
  }
  return { cid, uri: `ipfs://${cid}`, raw: data };
}

