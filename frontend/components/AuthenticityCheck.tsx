"use client";

import { useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, ShieldCheck } from 'lucide-react';
import { Card } from './Card';
import { backendPost } from '../lib/api';
import { ScanningBeam } from './ScanningBeam';
import { WaveformVisualizer } from './WaveformVisualizer';

export function AuthenticityCheck() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>();
  const [status, setStatus] = useState<string>();

  const verify = async () => {
    try {
      setStatus('Verifying with Yakoa...');
      const res = await backendPost<{ result: any }>('/authenticity/verify', { url, content: text });
      setResult(res.result);
      setStatus(`Originality score: ${res.result?.score ?? 'n/a'}`);
    } catch (err) {
      setStatus('Verification failed.');
    }
  };

  const register = async () => {
    setStatus('Trigger registration to Story via backend');
    await backendPost('/ip/register', {
      kind: 'contestant',
      name: 'Auto-registered asset',
      description: 'Generated from authenticity flow',
      media: url,
    });
    setStatus('Registration submitted to backend.');
  };

  return (
    <Card
      title="Authenticity (Yakoa)"
      subtitle="Verify uploaded media/text; if authentic, register as IP on Story"
      cta={
        <button onClick={verify}>
          <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <Fingerprint size={16} />
            Verify
          </span>
        </button>
      }
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input placeholder="Media URL" value={url} onChange={(e) => setUrl(e.target.value)} style={inputStyle} />
        <input placeholder="Text snippet" value={text} onChange={(e) => setText(e.target.value)} style={inputStyle} />
      </div>
      {status && <p style={{ color: 'var(--muted)' }}>{status}</p>}
      <div style={{ marginTop: 10 }}>
        <ScanningBeam />
      </div>
      {result && (
        <motion.div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 16,
            border: '1px solid rgba(125,241,180,0.35)',
            background: 'linear-gradient(120deg, rgba(125,241,180,0.14), rgba(255,63,175,0.08))',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="pill">Score: {result.score ?? 'n/a'}</div>
          <p style={{ color: 'var(--muted)' }}>Creator: {result.creator || 'unknown'}</p>
          <WaveformVisualizer intensity={0.9} />
          <button onClick={register}>
            <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <ShieldCheck size={16} />
              Register as IP on Story
            </span>
          </button>
        </motion.div>
      )}
    </Card>
  );
}

const inputStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 12px',
  color: 'var(--text)',
  minWidth: 200,
};

