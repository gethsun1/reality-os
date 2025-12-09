"use client";

import { useState } from 'react';
import { Card } from './Card';

export function FranchiseStaking() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<string>();

  const stake = () => {
    setStatus(`Stake request for ${amount} RFT queued. Wire to contract method stake().`);
  };

  const unstake = () => {
    setStatus(`Unstake request for ${amount} RFT queued.`);
  };

  return (
    <Card
      title="Franchise Engine"
      subtitle="Stake franchise tokens to influence rankings, storyline, challenges"
      cta={
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={stake}>Stake</button>
          <button onClick={unstake} style={{ background: '#ffe08a' }}>
            Unstake
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          placeholder="Amount RFT"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
        <div style={{ color: 'var(--muted)' }}>
          Reputation increases with stake (mirrors on-chain RealityShowIP stake()).
        </div>
      </div>
      {status && <p style={{ color: 'var(--muted)' }}>{status}</p>}
    </Card>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 12px',
  color: 'var(--text)',
  minWidth: 160,
};

