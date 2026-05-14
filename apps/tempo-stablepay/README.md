# Tempo StablePay

Tempo StablePay is a testnet payment workflow for invoice-style stablecoin transfers on Tempo.

The v1 demo targets Tempo Testnet (Moderato) and uses TIP-20 memo transfers:

- payment-token options: PathUSD, AlphaUSD, BetaUSD, ThetaUSD
- fee-token options: PathUSD and AlphaUSD
- transfer primitive: `transferWithMemo(address,uint256,bytes32)`
- reconciliation event: `TransferWithMemo`
- payment proof: RPC receipt, block number, transaction hash, from/to, token, fee token, memo, matched log index, copyable proof bundle
- invoice storage: browser local storage
- wallet access: Tempo Wallet, plus injected wallets such as OKX Wallet and MetaMask when available
- faucet access: official Tempo faucet link, with an in-app request path for connected wallets

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Vercel

The root `vercel.json` builds this app with:

```sh
npm --workspace apps/tempo-stablepay run build
```

Output directory:

```txt
apps/tempo-stablepay/dist
```

## Current Limitations

- Testnet only.
- No backend invoice database.
- No custom contracts.
- Fee sponsorship is not enabled until a live sponsored transaction is validated.
- Tempo Wallet is the preferred send path. Injected wallets may connect or add Tempo Testnet, but transaction submission can still fail if the wallet/RPC path does not support Tempo stablecoin-fee transactions.
- Explorer transaction links use `https://explore.tempo.xyz/tx/{transactionHash}`. The app also stores block-number proof because Tempo Explorer can lag or fail to render individual WebAuthn wallet transactions even when RPC receipts are available.

## Evidence Package

- Delivery package: `../../docs/tempo-delivery-package.md`
- X long-form draft: `../../docs/tempo-x-thread-draft.md`
