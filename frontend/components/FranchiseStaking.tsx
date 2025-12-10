"use client";

import { useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ShieldHalf, Unlock } from 'lucide-react';
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
          <button onClick={stake}>
            <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <ShieldHalf size={16} />
              Stake
            </span>
          </button>
          <button onClick={unstake} style={{ background: '#ffe08a', color: '#0a0c15' }}>
            <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <Unlock size={16} />
              Unstake
            </span>
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
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          marginTop: 12,
          padding: 14,
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.12)',
          background:
            'linear-gradient(120deg, rgba(255,124,40,0.12), rgba(255,63,175,0.12)), radial-gradient(circle at 80% 20%, rgba(255,63,175,0.16), transparent 55%)',
        }}
      >
        <div className="badge" style={{ marginBottom: 6 }}>
          Dynamic weight
        </div>
        <p style={{ margin: 0 }}>
          Reputation increases with stake (mirrors on-chain RealityShowIP stake()) and decays smoothly on unstake to
          avoid jolts in rankings.
        </p>
      </motion.div>
    </Card>
  );
}

const inputStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 12px',
  color: 'var(--text)',
  minWidth: 160,
};

