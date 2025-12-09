"use client";

import { useState } from 'react';
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
      cta={<button onClick={simulateBuy}>Buy Royalty Tokens</button>}
    >
      <div className="grid">
        {sampleHoldings.map((h) => (
          <div key={h.assetId} className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="pill">Asset {h.assetId}</div>
            <p>Balance: {h.balance}</p>
            <p style={{ color: 'var(--muted)' }}>Vesting ends: {h.vestingEnds}</p>
          </div>
        ))}
      </div>
      {status && <p style={{ color: 'var(--muted)' }}>{status}</p>}
    </Card>
  );
}

