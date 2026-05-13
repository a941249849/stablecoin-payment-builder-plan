# Tempo StablePay

Tempo StablePay is a testnet payment workflow for invoice-style stablecoin transfers on Tempo.

The v1 demo targets Tempo Testnet (Moderato) and uses TIP-20 memo transfers:

- payment token: AlphaUSD
- fee-token options: PathUSD, AlphaUSD, BetaUSD
- transfer primitive: `transferWithMemo(address,uint256,bytes32)`
- reconciliation event: `TransferWithMemo`
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
- Explorer URL behavior should be confirmed after the first live transaction.
