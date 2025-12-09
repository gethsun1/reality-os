export function getArg(name: string, fallback?: string): string | undefined {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  if (match) return match.slice(prefix.length);
  return fallback;
}

export function requireArg(name: string): string {
  const value = getArg(name);
  if (!value) {
    throw new Error(`Missing required argument: --${name}=value`);
  }
  return value;
}

