"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles } from 'lucide-react';
import { Card } from './Card';
import { SignalWaves } from './patterns/SignalWaves';

type Asset = {
  id: string;
  type: 'contestant' | 'episode' | 'contribution';
  metadataURI: string;
  parent?: string;
};

const filters: Array<Asset['type'] | 'all'> = ['all', 'contestant', 'episode', 'contribution'];

export function IpDashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>('all');

  useEffect(() => {
    setAssets([
      { id: '1', type: 'contestant', metadataURI: 'ipfs://contestant-1' },
      { id: '2', type: 'episode', parent: '1', metadataURI: 'ipfs://episode-1' },
      { id: '3', type: 'contribution', parent: '2', metadataURI: 'ipfs://contrib-1' },
    ]);
  }, []);

  const visible = useMemo(
    () => assets.filter((a) => filter === 'all' || a.type === filter),
    [assets, filter]
  );

  return (
    <Card
      title="IP Dashboard"
      subtitle="Contestants · Episodes · Fan Contributions"
      cta={
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 12px',
                background: filter === f ? 'linear-gradient(120deg, #ff7a1a, #ff3faf)' : 'rgba(255,255,255,0.06)',
                color: filter === f ? '#05060f' : '#f4f5fb',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      }
      pattern={<SignalWaves />}
    >
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {visible.map((a) => (
          <motion.div
            key={a.id}
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="pill" style={{ textTransform: 'capitalize' }}>
                <Layers size={14} />
                {a.type}
              </div>
              <Sparkles size={16} color="#ff7a1a" />
            </div>
            <p style={{ marginBottom: 4, fontWeight: 700 }}>ID: {a.id}</p>
            {a.parent && <p style={{ marginTop: 0, color: 'var(--muted)' }}>Parent: {a.parent}</p>}
            <a href={a.metadataURI} target="_blank" rel="noreferrer">
              Metadata
            </a>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

