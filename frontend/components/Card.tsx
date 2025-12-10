import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

type CardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  cta?: React.ReactNode;
  tone?: 'default' | 'success' | 'alert';
  pattern?: React.ReactNode;
};

export function Card({ title, subtitle, children, cta, tone = 'default', pattern }: CardProps) {
  const border =
    tone === 'success'
      ? '1px solid rgba(125,241,180,0.4)'
      : tone === 'alert'
        ? '1px solid rgba(255,124,40,0.45)'
        : '1px solid rgba(255,255,255,0.12)';

  return (
    <motion.div
      className="card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        border,
        backdropFilter: 'blur(22px)',
        overflow: 'hidden',
      }}
    >
      {pattern && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        >
          {pattern}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div>
            <h3 className={cn('heading-gradient')} style={{ marginBottom: 4 }}>
              {title}
            </h3>
            {subtitle && <p style={{ marginTop: 0, color: 'var(--muted)' }}>{subtitle}</p>}
          </div>
          {cta}
        </div>
        <div className="divider" />
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </div>
    </motion.div>
  );
}

