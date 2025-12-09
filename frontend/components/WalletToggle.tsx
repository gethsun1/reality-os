import { enabledWallets } from '../lib/wallets';

export function WalletToggle() {
  const wallets = enabledWallets();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <span className="pill" style={{ background: wallets.coinbaseEmbedded ? 'rgba(125,241,180,0.15)' : undefined }}>
        {wallets.coinbaseEmbedded ? 'Coinbase Embedded On' : 'Coinbase Embedded Off'}
      </span>
      <span className="pill" style={{ background: wallets.dynamic ? 'rgba(125,241,180,0.15)' : undefined }}>
        {wallets.dynamic ? 'Dynamic On' : 'Dynamic Off'}
      </span>
    </div>
  );
}

