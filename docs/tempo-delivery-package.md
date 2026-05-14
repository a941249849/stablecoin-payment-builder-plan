# Tempo StablePay Delivery Package

Last updated: 2026-05-14

This package closes the Tempo build phase. It records what the demo proves, what is still limited by testnet infrastructure, and which evidence should be used for the follow-up article.

## Delivery Status

Status: ready for public testnet presentation with caveats.

StablePay is not a generic transfer UI. The demo validates an invoice-style payment loop:

1. A merchant creates a local invoice.
2. The invoice id is encoded into a TIP-20 `bytes32` memo.
3. A payer sends a selected test stablecoin through `transferWithMemo`.
4. The app verifies the Tempo RPC receipt.
5. The app matches the `TransferWithMemo` log by token, recipient, and memo.
6. The invoice becomes `paid` and exposes a copyable proof bundle.

## Live Surfaces

- Demo: https://stablecoin-payment-builder-plan.vercel.app/
- Repo: https://github.com/a941249849/stablecoin-payment-builder-plan
- App source: `apps/tempo-stablepay`
- Main proof UI: payment proof console above the payment list.

## Implemented Scope

- Chinese and English UI.
- Tempo Wallet primary send path.
- Injected wallet connection path marked as experimental.
- Four payment-token options: `pathUSD`, `AlphaUSD`, `BetaUSD`, `ThetaUSD`.
- Fee-token options limited to `pathUSD` and `AlphaUSD`.
- Invoice creation with recipient, amount, token, and encoded memo.
- TIP-403 preflight for sender and recipient.
- `useTransferSync` send path.
- RPC receipt proof panel.
- Manual transaction-hash verification against Tempo RPC.
- Copyable proof bundle.
- Explorer link retained as a secondary convenience only.

## Confirmed Transaction Evidence

Successful test transaction:

```txt
tx hash: 0xbaa715f8795f3433292f7ad1ad1d7b41341a99c1e48e47232f4ce1931b6690d6
rpc: https://rpc.moderato.tempo.xyz
status: 0x1
block: 17395745
block hash: 0x4277d08173ba48f41e78cc3b5e08e33b0a3d7410e847c3626c2b69d06a4198a0
transaction index: 3
from: 0x3f2f0d8518cde103b5e0631ac0bfe1088908698b
recipient: 0xeE9d0FE0071361154f633dB6aBfFcaDbe52BB050
token contract: 0x20c0000000000000000000000000000000000001
token: AlphaUSD
fee token: 0x20c0000000000000000000000000000000000001
memo: INV-MP4JBTHK
memo topic: 0x0000000000000000000000000000000000000000494e562d4d50344a4254484b
TransferWithMemo log index: 6
```

The same transaction hash currently returns `404` on the explorer transaction route. The RPC receipt is therefore the primary proof source for this demo, while the explorer is treated as an external indexing surface.

## Why This Is Different From A Normal Transfer

A normal transfer answers only one question: did tokens move from one address to another?

This demo answers the payment-application question: which invoice did the payment settle?

The difference is the memo and reconciliation layer. The app links a business identifier to a TIP-20 transfer, then verifies the receipt log and marks the invoice as paid. That makes it closer to merchant payment infrastructure than to a wallet transfer screen.

## Current Caveats

- Tempo Explorer can return `404` for a transaction that is retrievable through the public RPC receipt endpoint.
- Address search on the explorer may not show the same transaction even when the RPC receipt confirms success.
- The app stores invoices in browser local storage. There is no backend database yet.
- Fee sponsorship is deferred until sponsored transactions are validated end to end.
- Injected wallets are connection/compatibility test paths, not the primary production path.

## Evidence Checklist For Publication

- Demo homepage screenshot.
- Invoice creation screenshot.
- Tempo Wallet confirmation screenshot.
- Payment proof console screenshot after successful transaction.
- Explorer `404` screenshot for the same tx hash.
- RPC receipt snippet from the proof console.
- Copyable proof bundle from the app.

## Article Positioning

The article should not claim that Tempo's developer experience is finished. The honest conclusion is stronger:

- Tempo's payment primitives are concrete enough to build with.
- `transferWithMemo` gives a useful reconciliation hook.
- Stablecoin fee UX is directionally aligned with payment apps.
- Tempo Wallet worked for the browser send path.
- Explorer indexing and wallet compatibility remain visible testnet gaps.

## Next Phase

After publishing the Tempo article, start the Arc phase with the same evidence standard:

1. Refresh Arc docs and current network/product status.
2. Build or test the smallest comparable payment flow.
3. Capture transaction evidence, wallet friction, explorer reliability, and reconciliation semantics.
4. Publish a Tempo vs Arc comparison based on implementation evidence rather than attention or token expectations.
