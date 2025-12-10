"use client";

import { useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ThumbsUp } from 'lucide-react';
import { Card } from './Card';
import { backendPost } from '../lib/api';

export function FanVote() {
  const [assetId, setAssetId] = useState('');
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState<string>();
  const [celebrate, setCelebrate] = useState(false);

  const submit = async () => {
    try {
      setStatus('Sending vote...');
      await backendPost('/analytics/ingest', {
        type: 'vote',
        payload: { wallet, assetRef: Number(assetId), weight: 1 },
      });
      setStatus('Vote recorded on backend indexer hook.');
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1400);
    } catch (err) {
      setStatus('Vote failed, check backend URL.');
    }
  };

  return (
    <Card
      title="Fan Vote (On-chain action)"
      subtitle="Submit a vote; backend hook can relay to contract."
      cta={
        <button onClick={submit} style={{ position: 'relative', overflow: 'hidden' }}>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <ThumbsUp size={16} />
            Send Vote
          </span>
        </button>
      }
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
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
        <div className="badge">
          <Sparkles size={14} />
          Neon vote signal
        </div>
      </div>
      {status && <p style={{ color: 'var(--muted)' }}>{status}</p>}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'relative', marginTop: 8, minHeight: 60 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10, x: 0, scale: 0.8 }}
                animate={{
                  opacity: [0.8, 1, 0],
                  y: [-10 - i * 0.4, -30 - i * 0.8],
                  x: (i % 2 === 0 ? 1 : -1) * (6 + i * 0.6),
                  scale: [1, 1.3, 0.9],
                }}
                transition={{ duration: 1.2, delay: i * 0.015, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: i % 3 === 0 ? '#ff7a1a' : '#ff3faf',
                  filter: 'drop-shadow(0 0 6px rgba(255,63,175,0.4))',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
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

