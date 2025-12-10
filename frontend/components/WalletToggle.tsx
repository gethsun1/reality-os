import { PlugZap } from 'lucide-react';
import { enabledWallets } from '../lib/wallets';

export function WalletToggle() {
  const wallets = enabledWallets();

  return (
    <button
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
      onClick={() => {
        // Placeholder: wire to wallet connect flow when available
      }}
    >
      <PlugZap size={16} />
      Connect Wallet
    </button>
  );
}

