"use client";

import { useEffect, useState } from 'react';
import { Card } from './Card';

type Asset = {
  id: string;
  type: 'contestant' | 'episode' | 'contribution';
  metadataURI: string;
  parent?: string;
};

export function IpDashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    // Placeholder: in a real deployment, fetch from backend indexer
    setAssets([
      { id: '1', type: 'contestant', metadataURI: 'ipfs://contestant-1' },
      { id: '2', type: 'episode', parent: '1', metadataURI: 'ipfs://episode-1' },
      { id: '3', type: 'contribution', parent: '2', metadataURI: 'ipfs://contrib-1' },
    ]);
  }, []);

  return (
    <Card title="IP Dashboard" subtitle="Contestants · Episodes · Fan Contributions">
      <div className="grid">
        {assets.map((a) => (
          <div key={a.id} className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="pill">{a.type}</div>
            <p style={{ marginBottom: 4 }}>ID: {a.id}</p>
            {a.parent && <p style={{ marginTop: 0, color: 'var(--muted)' }}>Parent: {a.parent}</p>}
            <a href={a.metadataURI} target="_blank" rel="noreferrer">
              Metadata
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}

