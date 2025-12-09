# Dune-Ready Schemas

These definitions align with backend Prisma models and on-chain events for RealityShowIP.

## Tables

### ip_assets
```sql
CREATE TABLE ip_assets (
  asset_id TEXT PRIMARY KEY,
  chain_id INT,
  contract TEXT,
  asset_type TEXT,
  parent_id TEXT,
  metadata_uri TEXT,
  creator TEXT,
  royalty_bps INT,
  created_at TIMESTAMP
);
```

### engagements
```sql
CREATE TABLE engagements (
  id SERIAL PRIMARY KEY,
  wallet TEXT,
  asset_id TEXT,
  action TEXT,
  weight INT,
  created_at TIMESTAMP
);
```

### economic_participation
```sql
CREATE TABLE economic_participation (
  id SERIAL PRIMARY KEY,
  wallet TEXT,
  asset_id TEXT,
  amount NUMERIC,
  kind TEXT,
  tx_hash TEXT,
  created_at TIMESTAMP
);
```

### royalty_flows
```sql
CREATE TABLE royalty_flows (
  id SERIAL PRIMARY KEY,
  asset_id TEXT,
  from_addr TEXT,
  to_addr TEXT,
  amount NUMERIC,
  tx_hash TEXT,
  created_at TIMESTAMP
);
```

### fan_stakes
```sql
CREATE TABLE fan_stakes (
  id SERIAL PRIMARY KEY,
  wallet TEXT,
  amount NUMERIC,
  created_at TIMESTAMP
);
```

## Event Mapping
- `ContestantRegistered` → `ip_assets` row with `asset_type='contestant'`.
- `EpisodeTokenized` → `ip_assets` row with `asset_type='episode'`, `parent_id=contestantId`.
- `FanContributionRegistered` → `ip_assets` row with `asset_type='contribution'`, `parent_id=episodeId`.
- `RoyaltyFractionMinted` → `royalty_flows` aggregation per transfer mint.
- Backend `/api/events/ingest` → `engagements`.
- Investment flow (token purchase) → `economic_participation`.
- Staking events → `fan_stakes` and `engagements`.

