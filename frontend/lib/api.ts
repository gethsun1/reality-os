const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function backendPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${backend}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Backend error ${res.status}`);
  }
  return res.json() as Promise<T>;
}



