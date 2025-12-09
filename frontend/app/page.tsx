import { WalletToggle } from '../components/WalletToggle';
import { IpDashboard } from '../components/IpDashboard';
import { FanVote } from '../components/FanVote';
import { InvestmentDashboard } from '../components/InvestmentDashboard';
import { EpisodeCreator } from '../components/EpisodeCreator';
import { FranchiseStaking } from '../components/FranchiseStaking';
import { AuthenticityCheck } from '../components/AuthenticityCheck';

export default function Home() {
  return (
    <div className="grid grid-2">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h2 style={{ marginTop: 0 }}>RealityOS</h2>
        <p style={{ color: 'var(--muted)', marginTop: -8 }}>
          Register IP on Story, mint royalty tokens, verify authenticity with Yakoa, and orchestrate fan-driven
          mechanics.
        </p>
        <WalletToggle />
      </div>
      <IpDashboard />
      <FanVote />
      <InvestmentDashboard />
      <AuthenticityCheck />
      <EpisodeCreator />
      <FranchiseStaking />
    </div>
  );
}

