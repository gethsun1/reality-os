"use client";

import { motion } from 'framer-motion';
import { WalletToggle } from '../components/WalletToggle';
import { IpDashboard } from '../components/IpDashboard';
import { FanVote } from '../components/FanVote';
import { InvestmentDashboard } from '../components/InvestmentDashboard';
import { EpisodeCreator } from '../components/EpisodeCreator';
import { FranchiseStaking } from '../components/FranchiseStaking';
import { AuthenticityCheck } from '../components/AuthenticityCheck';
import { SignalWaves } from '../components/patterns/SignalWaves';
import { LightGrid } from '../components/patterns/LightGrid';
import { ThreeFloatingOrb } from '../components/ThreeFloatingOrb';

export default function Home() {
  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="hero card" style={{ padding: 24, background: 'var(--card)' }}>
        <div className="radial-glow" style={{ top: -120, left: -60 }} />
        <div className="radial-glow pink" style={{ bottom: -140, right: -80 }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,124,40,0.16), transparent 40%), radial-gradient(circle at 80% 10%, rgba(255,63,175,0.14), transparent 45%), linear-gradient(135deg, #0b0424 0%, #120a2f 40%, #1b123b 100%)',
          }}
        />
        <div style={{ position: 'relative', display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'center' }}>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="pill">RealityOS v0.1</span>
              <span className="pill" style={{ borderColor: 'rgba(125,241,180,0.4)', color: '#8bfac5' }}>
                Live on Story Testnet
              </span>
            </div>
            <motion.h2
              className="heading-gradient"
              style={{ margin: 0, fontSize: 36, lineHeight: 1.1 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Cinematic IP control room for fan-driven reality franchises.
            </motion.h2>
            <p style={{ color: 'var(--muted)', maxWidth: 720 }}>
              Register contestants, mint royalty streams, verify authenticity with Yakoa, and choreograph fan signals,
              staking, and investment from one glass cockpit.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button>Launch Producer Flow</button>
              <WalletToggle />
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div className="metric">
                <div className="pill" style={{ marginBottom: 6 }}>
                  Throughput
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>~60 fps target</div>
                <p style={{ margin: 0, color: 'var(--muted)' }}>All animations gated for low-end devices.</p>
              </div>
              <div className="metric">
                <div className="pill" style={{ marginBottom: 6 }}>
                  Contracts
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>RealityShowIP · FranchiseToken</div>
                <p style={{ margin: 0, color: 'var(--muted)' }}>Story Protocol testnet deployments.</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <SignalWaves className="pattern-surface" />
            <ThreeFloatingOrb />
          </div>
        </div>
      </section>

      <div className="grid grid-2">
        <IpDashboard />
        <FanVote />
        <AuthenticityCheck />
        <EpisodeCreator />
        <InvestmentDashboard />
        <FranchiseStaking />
      </div>

      <div className="card" style={{ gridColumn: '1 / -1', marginTop: 12, overflow: 'hidden' }}>
        <LightGrid className="pattern-surface" />
      </div>
    </div>
  );
}

