# Vercel Deployment

Last updated: 2026-05-13

The first Tempo demo is designed to build on Vercel from GitHub, avoiding local dependency installation and local dev-server pressure.

## Project Settings

Recommended Vercel settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Install Command | `pnpm install --frozen-lockfile=false` |
| Build Command | `pnpm --dir apps/tempo-stablepay build` |
| Output Directory | `apps/tempo-stablepay/dist` |

The repository root includes `vercel.json` with these values, so Vercel should detect them after import.

## Import Path

Use the GitHub repository:

```txt
https://github.com/a941249849/stablecoin-payment-builder-plan
```

## Environment Variables

No environment variables are required for v1.

Do not add private keys, wallet mnemonics, or funded production credentials to Vercel. The first demo uses wallet-side signing and public Tempo testnet RPC.

## Deployment Flow

1. Import the GitHub repository into Vercel.
2. Let Vercel run the install and build commands from `vercel.json`.
3. Open the preview URL.
4. Connect a test wallet on Tempo Testnet (Moderato).
5. Confirm faucet funding, invoice creation, memo transfer, and event reconciliation.

## When VPS Becomes Useful

A VPS or backend platform becomes useful only after one of these requirements appears:

- hosted invoice database
- always-on event indexer
- webhook delivery
- self-hosted fee payer service
- scheduled reconciliation jobs
- production monitoring

Until then, Vercel plus GitHub is the lighter deployment path.
