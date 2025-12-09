export function Card({
  title,
  subtitle,
  children,
  cta,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  cta?: React.ReactNode;
}) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h3>{title}</h3>
          {subtitle && <p style={{ marginTop: -8, color: 'var(--muted)' }}>{subtitle}</p>}
        </div>
        {cta}
      </div>
      {children}
    </div>
  );
}

