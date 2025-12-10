"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { Card } from './Card';

type Holding = { assetId: string; balance: number; vestingEnds: string };

const sampleHoldings: Holding[] = [
  { assetId: '1', balance: 1200, vestingEnds: '2025-06-01' },
  { assetId: '2', balance: 400, vestingEnds: '2025-04-15' },
];

export function InvestmentDashboard() {
  const [status, setStatus] = useState<string>();

  const simulateBuy = () => {
    setStatus('Pretend purchase sent. Wire to contract in production.');
  };

  return (
    <Card
      title="Fan Investment"
      subtitle="Royalty token buy + vesting overview"
      cta={
        <button onClick={simulateBuy}>
          <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <Wallet size={16} />
            Buy Royalty Tokens
          </span>
        </button>
      }
    >
      <div className="grid">
        {sampleHoldings.map((h) => (
          <motion.div
            key={h.assetId}
            className="card"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            style={{ background: 'rgba(255,255,255,0.02)', position: 'relative' }}
          >
            <div className="radial-glow" style={{ top: -120, left: -160 }} />
            <div className="pill">Asset {h.assetId}</div>
            <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{h.balance} RFT</p>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Vesting ends: {h.vestingEnds}</p>
          </motion.div>
        ))}
      </div>
      {status && <p style={{ color: 'var(--muted)' }}>{status}</p>}
    </Card>
  );
}

