"use client";

import { useState } from 'react';
import { Card } from './Card';
import { backendPost } from '../lib/api';

export function FanVote() {
  const [assetId, setAssetId] = useState('');
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState<string>();

  const submit = async () => {
    try {
      setStatus('Sending vote...');
      await backendPost('/api/events/ingest', {
        type: 'vote',
        payload: { wallet, assetRef: Number(assetId), weight: 1 },
      });
      setStatus('Vote recorded on backend indexer hook.');
    } catch (err) {
      setStatus('Vote failed, check backend URL.');
    }
  };

  return (
    <Card
      title="Fan Vote (On-chain action)"
      subtitle="Submit a vote; backend hook can relay to contract."
      cta={<button onClick={submit}>Send Vote</button>}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          placeholder="Asset ID"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Wallet"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          style={inputStyle}
        />
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

