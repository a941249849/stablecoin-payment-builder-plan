# Tempo Current State Review

Last updated: 2026-05-14

This note is the source-backed build checkpoint for Tempo StablePay. It separates official facts, builder assumptions, and the next Arc comparison phase.

## Official Facts Checked

- Tempo presents itself as a purpose-built Layer 1 for payments, with stablecoin payments, high throughput, low cost, machine payments, dedicated payment lanes, stablecoin-native gas, payment metadata, deterministic settlement, and modern wallet signing as the core product logic.
- The official docs describe Tempo as a general-purpose blockchain optimized for payments and state that the docs cover wallet creation, payment systems, and protocol specifications.
- Tempo Testnet Moderato uses chain ID `42431`, RPC `https://rpc.moderato.tempo.xyz`, WebSocket `wss://rpc.moderato.tempo.xyz`, currency symbol `USD`, and explorer `https://explore.tempo.xyz`.
- The testnet faucet funds four test stablecoins: `pathUSD`, `AlphaUSD`, `BetaUSD`, and `ThetaUSD`, each at `1M`.
- The token list endpoint for chain `42431` is the canonical metadata path for testnet assets.
- The wallet guide supports EVM-compatible browser wallets that support Tempo or can add custom networks, including the `multiInjectedProviderDiscovery: true` Wagmi path and a manual add-network path. The same docs also warn that some wallets may not support Tempo yet, so wallet connection should not be treated as proof that Tempo transaction submission works.
- `transferWithMemo` attaches a 32-byte memo to a TIP-20 transfer and emits `TransferWithMemo` for reconciliation.
- The accept-payment guide frames memo reconciliation as watching `TransferWithMemo` events and matching recipient plus memo.
- Fee selection is protocol-specific. Tempo has no native gas token; fees are paid in USD-denominated native TIP-20 stablecoins with sufficient Fee AMM liquidity. The demo currently exposes `pathUSD` and `AlphaUSD` as fee-token options and keeps `BetaUSD` / `ThetaUSD` as payment-token options until fee-token support is validated with live transactions.
- Tempo publishes a public testnet fee payer service at `https://sponsor.moderato.tempo.xyz` for development, but sponsorship should be validated separately before being presented as a working demo feature.
- The Tempo GitHub organization is active and public, including `tempo`, `tempo-apps`, `tempo-ts`, `accounts`, `docs`, `mpp`, and related SDK/spec repositories.

## Builder Interpretation

Tempo-first is still a rational route, but not because it is hotter than Arc. It is rational because there is already prior hands-on context, public docs, faucet assets, wallet paths, SDK examples, and a concrete `transferWithMemo` flow that can produce verifiable transaction evidence.

Arc currently has stronger token-expectation and market-attention momentum. That makes Arc useful for a second-phase comparison, but it also makes premature Arc work more likely to become narrative chasing unless there is a comparable build artifact.

The near-term edge is therefore:

1. Finish a working Tempo payment demo.
2. Publish the second Tempo article with code, screenshots, tx hash, and caveats.
3. Then build or test Arc with the same evidence standard.
4. Publish a comparison report based on implementation friction, payment semantics, wallet/dev experience, and ecosystem positioning.

## Demo Scope Correction

The demo must not be AlphaUSD-only. It should treat `pathUSD`, `AlphaUSD`, `BetaUSD`, and `ThetaUSD` as selectable payment assets, while clearly explaining any fee-token behavior that differs from the visible selector because of SDK, wallet, or protocol rules.

Wallet connection and transaction submission must be tracked separately. Tempo Wallet is the preferred browser send path. Injected wallets such as MetaMask or OKX can be useful for connection and network-add testing, but failures during `eth_sendTransaction` / `wallet_sendTransaction` should be documented as compatibility evidence rather than hidden behind generic policy errors.

The current demo is still in Day 2/Day 3 territory until these are verified:

- Selected payment-token balance changes immediately when the selector changes.
- Invoice creation stores the selected token.
- Send action gives wallet, network, success, and error feedback.
- Network switch either succeeds through the wallet or shows a manual add-network fallback.
- A real `transferWithMemo` tx hash is captured.
- `TransferWithMemo` event detection marks the invoice as paid.

## Sources

- Tempo website: https://tempo.xyz/
- Tempo docs home: https://docs.tempo.xyz/
- Connect to network: https://docs.tempo.xyz/quickstart/connection-details
- Faucet: https://docs.tempo.xyz/quickstart/faucet
- Token list registry: https://docs.tempo.xyz/quickstart/tokenlist
- Connect wallets: https://docs.tempo.xyz/guide/use-accounts/connect-to-wallets
- Send payment: https://docs.tempo.xyz/guide/payments/send-a-payment
- Transfer memos: https://docs.tempo.xyz/guide/payments/transfer-memos
- Accept payment: https://docs.tempo.xyz/guide/payments/accept-a-payment
- Sponsor user fees: https://docs.tempo.xyz/guide/payments/sponsor-user-fees
- Fee specification: https://docs.tempo.xyz/protocol/fees/spec-fee
- TIP-20 specification: https://docs.tempo.xyz/protocol/tip20/spec
- Tempo GitHub: https://github.com/tempoxyz
