import './globals.css';
import type { Metadata } from 'next';
import { cn } from '../lib/utils';

export const metadata: Metadata = {
  title: 'RealityOS',
  description: 'IP-native reality competition stack on Story Protocol',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen')}>
        <div className="page">
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div>
              <div className="pill">Story Protocol · RealityOS</div>
              <h1 style={{ margin: '8px 0 0', fontFamily: '"Space Grotesk", Sora, sans-serif' }}>
                RealityOS Control Room
              </h1>
              <p style={{ marginTop: 4, color: 'var(--muted)' }}>
                Programmable reality competition · IP, authenticity, staking, fan signals
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="https://storyprotocol.xyz" target="_blank" rel="noreferrer" className="pill">
                Story Docs
              </a>
              <a href="https://docs.realityos" target="_blank" rel="noreferrer" className="pill">
                RealityOS Docs
              </a>
            </div>
          </header>
          <main style={{ marginTop: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}

