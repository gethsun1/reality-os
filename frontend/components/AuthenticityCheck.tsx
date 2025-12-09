"use client";

import { useState } from 'react';
import { Card } from './Card';
import { backendPost } from '../lib/api';

export function AuthenticityCheck() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>();
  const [status, setStatus] = useState<string>();

  const verify = async () => {
    try {
      setStatus('Verifying with Yakoa...');
      const res = await backendPost<{ result: any }>('/api/verify', { url, content: text });
      setResult(res.result);
      setStatus(`Originality score: ${res.result?.score ?? 'n/a'}`);
    } catch (err) {
      setStatus('Verification failed.');
    }
  };

  const register = async () => {
    setStatus('Trigger registration to Story via backend');
    await backendPost('/api/register/contestant', {
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
      cta={<button onClick={verify}>Verify</button>}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input placeholder="Media URL" value={url} onChange={(e) => setUrl(e.target.value)} style={inputStyle} />
        <input placeholder="Text snippet" value={text} onChange={(e) => setText(e.target.value)} style={inputStyle} />
      </div>
      {status && <p style={{ color: 'var(--muted)' }}>{status}</p>}
      {result && (
        <div style={{ marginTop: 12 }}>
          <div className="pill">Score: {result.score ?? 'n/a'}</div>
          <p style={{ color: 'var(--muted)' }}>Creator: {result.creator || 'unknown'}</p>
          <button onClick={register}>Register as IP on Story</button>
        </div>
      )}
    </Card>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 12px',
  color: 'var(--text)',
  minWidth: 200,
};

