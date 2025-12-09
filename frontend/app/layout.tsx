import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RealityOS',
  description: 'IP-native reality competition stack on Story Protocol',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="pill">Story Protocol · RealityOS</div>
              <h1 style={{ margin: '8px 0 0' }}>RealityOS Control Room</h1>
            </div>
            <a href="https://storyprotocol.xyz" target="_blank" rel="noreferrer">
              Story Docs
            </a>
          </header>
          <main style={{ marginTop: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}

