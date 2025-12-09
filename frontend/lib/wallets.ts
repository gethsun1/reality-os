export function enabledWallets() {
  return {
    coinbaseEmbedded: process.env.NEXT_PUBLIC_COINBASE_APP_ID?.length ? true : false,
    dynamic: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID?.length ? true : false,
  };
}

