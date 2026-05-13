# Tempo Build Gate

Last updated: 2026-05-13

This document records the implementation gate for the first Tempo payment demo. It is intentionally source-backed and conservative: the goal is to build a reproducible payment workflow before expanding into broader stablecoin infrastructure comparisons.

## Source Set

- Official site: https://tempo.xyz/
- Official docs: https://docs.tempo.xyz/
- Official GitHub organization: https://github.com/tempoxyz
- Payments example: https://github.com/tempoxyz/examples/tree/main/examples/payments
- Accounts fee-payer example: https://github.com/tempoxyz/accounts/tree/main/examples/with-fee-payer
- Token list: https://tokenlist.tempo.xyz/list/42431
- Status page: https://status.tempo.xyz/

## Current Network Target

Use Tempo Testnet (Moderato) for v1.

| Item | Value |
| --- | --- |
| Network | Tempo Testnet (Moderato) |
| Chain ID | `42431` |
| Currency | `USD` |
| HTTP RPC | `https://rpc.moderato.tempo.xyz` |
| WebSocket RPC | `wss://rpc.moderato.tempo.xyz` |
| Explorer | `https://explore.testnet.tempo.xyz` |

Live check on 2026-05-13: `eth_blockNumber` on `https://rpc.moderato.tempo.xyz` returned a valid block number, so the public testnet RPC was reachable at the time of review.

## Token Set

Use official testnet token-list entries for the v1 demo.

| Token | Symbol | Address | Decimals | v1 Role |
| --- | --- | --- | --- | --- |
| PathUSD | `pathUSD` | `0x20c0000000000000000000000000000000000000` | 6 | payment and fee-token option |
| AlphaUSD | `alphaUSD` | `0x20c0000000000000000000000000000000000001` | 6 | default payment and fee-token option |
| BetaUSD | `betaUSD` | `0x20c0000000000000000000000000000000000002` | 6 | payment option |
| ThetaUSD | `thetaUSD` | `0x20c0000000000000000000000000000000000003` | 6 | payment option |
| USDC.e | `USDC.e` | `0x20c0000000000000000000009e8d7eb59b783726` | 6 | later compatibility check |
| EURC.e | `EURC.e` | `0x20c000000000000000000000d72572838bbee59c` | 6 | later non-USD UX check |

## SDK Decision

Use TypeScript with Wagmi, Viem, and Tempo's TS package.

Recommended v1 stack:

- Vite
- React
- TypeScript
- Wagmi
- Viem
- `tempo.ts`
- TanStack Query

Reasoning:

- Tempo docs position Wagmi as the application and wallet integration layer, and Viem as the lower-level tooling and scripting layer.
- The official payments example is a Vite app using React 19, Wagmi 3, Viem 2, `tempo.ts` `~0.14.0`, and TanStack Query 5.
- The demo target is an application workflow, so Wagmi hooks should drive the browser app while Viem utilities handle encoding, parsing, and event queries.

Do not start with Next.js. Vite is closer to the official payment example and keeps the first implementation smaller.

## Payment Primitive

Use TIP-20 `transferWithMemo(address,uint256,bytes32)`.

The core v1 payment flow:

1. Create a local invoice with amount, recipient, token, and short invoice ID.
2. Encode invoice ID as `bytes32`.
3. Submit a selected test-stablecoin `transferWithMemo`.
4. Show the receipt and explorer link.
5. Watch or query `TransferWithMemo` logs for reconciliation.
6. Match logs by recipient, token, and memo.

Memo encoding:

```ts
import { pad, stringToHex } from 'viem'

const memo = pad(stringToHex('INV-12345'), { size: 32 })
```

Event ABI:

```ts
import { parseAbiItem } from 'viem'

const transferWithMemoEvent = parseAbiItem(
  'event TransferWithMemo(address indexed from, address indexed to, uint256 value, bytes32 indexed memo)',
)
```

The TIP-20 spec names the amount parameter `amount`, while the transfer-memo guide's `getLogs` example names it `value`. Implementation should rely on the event signature and viem-decoded argument position, then normalize the UI field to a single internal `amount` name.

## Fee Strategy

Core v1 should support user-paid fees with selectable USD fee tokens.

Fee sponsorship should be optional in v1:

- Tempo docs list a public testnet fee payer service at `https://sponsor.moderato.tempo.xyz`.
- A simple reachability check returned an HTTP response from the service on 2026-05-13, but sponsorship still needs validation with a real transaction.
- Official docs mark `Handler.feePayer` as deprecated and direct custom services toward `Handler.relay`.
- The official payments example still uses a local `/fee-payer` relay path, so the demo can expose sponsorship as an experimental toggle once the non-sponsored path works.

Decision:

- Build the reliable self-paid transfer path first.
- Add public-sponsor support only after a successful live sponsored transfer.
- Defer self-hosted fee payer service until there is a clear need for production-style limits and monitoring.

## Storage Decision

Use local browser storage for v1 invoice state.

Start with a local-first invoice store containing:

- invoice ID
- recipient address
- token address
- amount
- memo bytes32
- status
- transaction hash
- created timestamp
- matched log metadata

Do not add SQLite or a backend in v1. A backend becomes useful only after there is a multi-user dashboard, hosted webhook/indexer, or public demo deployment.

## v1 Feature Scope

Build:

- Wallet connection to Tempo Testnet.
- Faucet/balance visibility if supported cleanly by the SDK.
- Invoice creation.
- Stablecoin transfer with memo for PathUSD, AlphaUSD, BetaUSD, and ThetaUSD.
- Fee token selection among PathUSD and AlphaUSD until live fee liquidity/support is validated for additional test tokens.
- Reconciliation by `TransferWithMemo`.
- Explorer transaction link from transaction hash using `https://explore.tempo.xyz/tx/{hash}` plus block-number proof from the RPC receipt, because explorer tx/address indexing can lag or miss Tempo Wallet WebAuthn transactions even after the RPC receipt is available.
- README with setup, source links, and verified limitations.

Defer:

- Custom contracts.
- Mainnet support.
- Self-hosted fee payer.
- Stablecoin DEX routing.
- Private zones.
- Batch payroll.
- Agentic MPP payments.
- Arc implementation.
- Any token, ICO, or airdrop claims not supported by official sources.

## Build Readiness

Ready to start implementation after these checks:

1. Confirm the latest `tempoxyz/examples` payments app still builds locally.
2. Confirm faucet access for the test wallet.
3. Complete one self-paid memo transfer on Moderato.
4. Confirm `TransferWithMemo` log decoding for that transaction.
5. Test the public sponsor service with one sponsored transaction, or explicitly keep sponsorship disabled.
6. Record final explorer URL behavior because docs and examples reference different explorer hostnames.

## Implementation Path

1. Scaffold `apps/tempo-stablepay` as a Vite React TypeScript app.
2. Add Wagmi, Viem, `tempo.ts`, and TanStack Query.
3. Configure `tempoModerato.extend({ feeToken: alphaUsd })`.
4. Create a small token registry module from the official testnet token list.
5. Build invoice state and memo encoding utilities.
6. Implement send payment with `Hooks.token.useTransferSync`.
7. Implement log watching and historical reconciliation.
8. Add optional fee-token selector.
9. Add optional sponsor toggle only after live sponsorship validation.
10. Write public README and limitations before opening broader review.
