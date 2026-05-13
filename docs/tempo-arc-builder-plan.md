# Tempo and Arc Stablecoin Payment Builder Plan

Status: Public planning draft
Owner: LiuNengBoy
Last updated: 2026-05-13

## 1. Objective

Build a public, reproducible builder track around stablecoin payment infrastructure.

The near-term focus is Tempo because prior work already exists:

- A published Tempo testnet guide.
- Hands-on protocol-level interaction experience.
- Existing public evidence of early builder activity.

Arc should be treated as a second track:

- Use current market attention to perform structured research.
- Build a comparable USDC checkout or invoice demo.
- Publish a measured Tempo vs Arc analysis.

The desired public identity is not "airdrop participant". It is:

> Early builder and researcher for stablecoin payment chains.

## 2. Strategic Positioning

### Tempo Track

Tempo is the primary builder track.

Core thesis:

- Stripe and Paradigm are pushing a payment-first L1.
- Tempo is designed around stablecoin-native payment flows rather than generic DeFi trading.
- The best contribution angle is practical payment infrastructure: invoice, memo, reconciliation, fee sponsorship, batch payouts, and agentic payments.

Current state to reflect in content:

- Mainnet is live according to Tempo's website and status page.
- Testnet Moderato remains useful for development experiments.
- Some docs still mix testnet and mainnet language, so all guides should explicitly label the network used.
- No official token or airdrop information should be assumed.

### Arc Track

Arc is the secondary research and comparison track.

Core thesis:

- Arc is Circle's USDC-first stablecoin finance infrastructure.
- Arc is more about USDC-native settlement, Circle App Kit, CCTP, Gateway, and institutional financial flows.
- Arc's market heat can be used for a well-timed research and demo series, but claims around token or ICO expectations must be clearly separated from official facts.

## 3. Immediate Deliverables

### Deliverable A: Tempo Latest State Research Note

Purpose:

- Update the prior Tempo guide with current status.
- Explain why the next step should move from basic transaction testing to real payment workflow construction.

Output:

- X long-form post.
- Optional GitHub markdown note.

Suggested title:

> Tempo latest status: after mainnet live, where are the builder opportunities for a payment-first L1?

Content outline:

1. Tempo current status.
2. Mainnet vs testnet distinction.
3. Why stablecoin-native gas matters.
4. Why TIP-20 matters.
5. Why payment memos and reconciliation are the practical entry point.
6. Next builder target: Tempo StablePay Demo.

### Deliverable B: Tempo StablePay Demo

Purpose:

- Build a small but real payment product demo, not another generic interaction script.
- Demonstrate Tempo's payment-specific primitives.

Working title:

> Tempo StablePay

Core flow:

1. Merchant creates an invoice.
2. User pays with a Tempo TIP-20 stablecoin.
3. Payment includes a `bytes32` memo such as `INV-1001`.
4. App watches `TransferWithMemo` events.
5. App updates invoice status from `pending` to `paid`.
6. App displays transaction hash and explorer link.

Priority features:

- Invoice creation.
- `transferWithMemo`.
- `TransferWithMemo` event listener.
- Transaction receipt display.
- Fee token awareness.
- Sponsored fee support if feasible.

Deferred features:

- Stablecoin DEX swap.
- Agentic payments.
- Passkey account onboarding.
- Full database backend.
- Production payment risk controls.

Suggested article title:

> Tempo hands-on part 2: building stablecoin invoice reconciliation with Transfer Memo and sponsored fees

### Deliverable C: Arc Research and Comparable Demo

Purpose:

- Use the current Arc attention window without becoming a pure hype participant.
- Build a comparable USDC payment demo so the eventual comparison has real evidence.

Working title:

> Arc USDC Checkout

Core flow:

1. Merchant creates a USDC invoice.
2. User pays on Arc testnet.
3. App records gas cost, confirmation time, and explorer link.
4. Optional: App Kit, CCTP, Gateway, or Unified Balance integration.

Suggested article title:

> Arc public testnet hands-on: USDC gas, Circle stack, and a simple checkout flow

### Deliverable D: Tempo vs Arc Comparison

Purpose:

- Convert both implementation tracks into a higher-level market and product thesis.

Suggested title:

> Tempo vs Arc: Stripe's payment rails route vs Circle's USDC settlement route

Comparison dimensions:

- Asset model.
- Gas and fee UX.
- Payment metadata.
- Reconciliation.
- Stablecoin interoperability.
- Merchant distribution.
- Institutional distribution.
- Developer experience.
- Mainnet/testnet maturity.
- Token expectation and official information boundary.

## 4. Technical Plan for Tempo StablePay

### Feasibility Assessment

This project should be feasible as a local-first demo because the v1 scope uses Tempo's existing TIP-20 primitives rather than custom payment contracts.

High-confidence components:

- Creating invoices in local application state.
- Encoding invoice references into `bytes32` memos.
- Sending TIP-20 payments with `transferWithMemo`.
- Watching `TransferWithMemo` logs for reconciliation.
- Displaying explorer links and transaction receipts.

Medium-confidence components:

- Fee sponsorship through the public testnet sponsor service.
- Wallet compatibility across injected browser wallets.
- Mainnet-compatible examples, because some public docs still contain testnet-specific language.

Defer until the core payment loop is stable:

- Stablecoin DEX routing.
- Agentic payments.
- Passkey account onboarding.
- Custom fee payer infrastructure.
- Persistent production backend.

Build readiness checklist:

- Confirm current Tempo docs and examples still compile.
- Confirm Moderato faucet and RPC are online.
- Confirm the selected TIP-20 token address works with `transferWithMemo`.
- Confirm event logs can be filtered by memo and recipient.
- Confirm the demo can be explained without token or airdrop assumptions.

### Stack

Recommended:

- Vite or Next.js.
- React.
- TypeScript.
- viem and wagmi.
- Tempo testnet Moderato.
- Local JSON or SQLite for initial invoice state.

Avoid for v1:

- Heavy backend.
- Unnecessary smart contracts.
- Complex account abstraction beyond what Tempo SDK requires.

### Network

Use testnet for v1 unless mainnet funds and RPC details are confirmed.

Known testnet configuration:

- Network: Tempo Testnet Moderato.
- Chain ID: `42431`.
- RPC: `https://rpc.moderato.tempo.xyz`.
- WebSocket: `wss://rpc.moderato.tempo.xyz`.
- Explorer: `https://explore.tempo.xyz`.
- Currency symbol: `USD`.

### Core Data Model

Invoice:

```ts
type InvoiceStatus = "pending" | "paid" | "reconciled" | "failed";

type Invoice = {
  id: string;
  amount: string;
  token: `0x${string}`;
  merchantAddress: `0x${string}`;
  memo: `0x${string}`;
  status: InvoiceStatus;
  transactionHash?: `0x${string}`;
  createdAt: string;
  paidAt?: string;
};
```

### Minimal Screens

1. Merchant dashboard.
2. Create invoice form.
3. Invoice payment page.
4. Payment status panel.
5. Event log or reconciliation panel.

### Implementation Steps

1. Bootstrap frontend.
2. Add Tempo network config.
3. Add wallet connection.
4. Add invoice creation.
5. Encode invoice id into `bytes32` memo.
6. Send `transferWithMemo`.
7. Watch `TransferWithMemo` event.
8. Match memo and recipient.
9. Update invoice status.
10. Add explorer links.
11. Add fee sponsorship if stable.
12. Write README and article screenshots.

## 5. Content Plan

### Post 1: Tempo Latest State

Goal:

- Update public narrative.
- Set up why the next demo matters.

Must include:

- Mainnet live note.
- Testnet development note.
- No official token assumption.
- Builder focus.

### Post 2: Tempo StablePay Demo

Goal:

- Show a working payment product.

Must include:

- Demo repo link.
- Screenshots.
- Transaction hash.
- Explanation of `transferWithMemo`.
- Explanation of reconciliation.
- Explanation of fee sponsorship if included.

### Post 3: Arc Research

Goal:

- Enter Arc discussion with technical credibility.

Must include:

- Official status.
- USDC-native gas.
- Circle stack.
- Clear boundary between official facts and market token expectations.

### Post 4: Tempo vs Arc

Goal:

- Establish broader stablecoin payment infra perspective.

Must include:

- Tempo as payment rails / merchant API path.
- Arc as USDC settlement / Circle financial OS path.
- Plasma and Stable as USDT global flow context.
- Builder conclusions.

## 6. Tooling and Work Allocation

### Development Workflow

Use a public-facing, builder-first workflow:

- Keep commits and docs written from the project perspective.
- Avoid references to internal tooling, automation, or private working context.
- Keep implementation notes focused on product decisions, protocol behavior, and reproducible steps.
- Treat all public claims about Tempo and Arc as source-backed and date-sensitive.

### Primary Implementation

Use for:

- Architecture refinement.
- Repository setup.
- Core implementation.
- Debugging.
- Documentation.
- Research synthesis.
- Article drafting.

### Second-Pass Review

Use for:

- Inline code completion.
- Component scaffolding.
- Refactoring.
- Small UI iterations.
- Test suggestions.
- Independent review of implementation assumptions and edge cases.

Review checklist:

- Validate protocol assumptions.
- Catch wallet and network configuration mistakes.
- Review event filtering and memo encoding.
- Review user-facing language for public repo quality.
- Check that no private keys, tokens, local paths, or internal notes are committed.

### VPS

Not required for v1.

Buy only if one of these becomes necessary:

- Persistent webhook listener.
- Public demo endpoint.
- Long-running event indexer.
- Custom fee payer service.
- Dedicated RPC or node experiments.

For v1, local dev plus GitHub repo is sufficient.

## 7. Suggested GitHub Issues

### Issue 1: Research Tempo current status

Tasks:

- Verify website status.
- Verify docs status.
- Record mainnet/testnet distinction.
- Summarize builder opportunities.

Acceptance criteria:

- Markdown note committed.
- X post draft prepared.

### Issue 2: Scaffold Tempo StablePay

Tasks:

- Create app skeleton.
- Configure TypeScript.
- Configure Tempo network.
- Add wallet connection.

Acceptance criteria:

- App runs locally.
- Wallet can connect to Tempo testnet.

### Issue 3: Implement invoice creation

Tasks:

- Create invoice form.
- Store invoice locally.
- Generate `bytes32` memo.

Acceptance criteria:

- User can create invoice.
- Invoice status starts as `pending`.

### Issue 4: Implement payment with memo

Tasks:

- Call TIP-20 `transferWithMemo`.
- Display pending and receipt states.
- Link to Tempo explorer.

Acceptance criteria:

- Payment transaction succeeds.
- Memo is visible through event logs.

### Issue 5: Implement reconciliation listener

Tasks:

- Watch `TransferWithMemo`.
- Match recipient and memo.
- Update invoice status.

Acceptance criteria:

- App automatically marks invoice as `paid`.

### Issue 6: Add fee sponsorship

Tasks:

- Integrate public testnet fee payer or local sponsor account.
- Add UI indicator for sponsored fees.

Acceptance criteria:

- User can complete a sponsored payment in testnet.

### Issue 7: Write README and publish article draft

Tasks:

- Document setup.
- Document demo flow.
- Add screenshots.
- Add known limitations.

Acceptance criteria:

- README is clear enough for another developer to run.
- Article draft is ready for X.

### Issue 8: Arc research and demo planning

Tasks:

- Verify current Arc status.
- Identify comparable checkout flow.
- Plan Arc USDC Checkout demo.

Acceptance criteria:

- Arc implementation plan exists.
- Tempo vs Arc comparison outline exists.

## 8. One-Week Execution Plan

Day 1:

- Refresh Tempo latest state from official docs, GitHub, token list, and status sources.
- Draft the second-phase article outline that connects to the earlier Tempo testnet walkthrough.

Day 2:

- Scaffold Tempo StablePay frontend.
- Configure network, wallets, faucet links, and local invoice flow.

Day 3:

- Run `transferWithMemo` with the selected test stablecoin.
- Capture the first successful transaction hash.

Day 4:

- Listen for `TransferWithMemo`.
- Complete automatic invoice reconciliation.

Day 5:

- Test fee sponsorship if stable.
- Add transaction display and explorer links.

Day 6:

- Polish README, screenshots, tx hash evidence, and limitations.

Day 7:

- Publish the X long-form article.
- Move Arc research and comparable demo planning into the next phase.

## 9. Success Criteria

The plan is successful if it produces:

- A public GitHub repo or branch with a working Tempo payment demo.
- A public article showing real Tempo payment infrastructure use.
- At least one explorer-verifiable transaction.
- A coherent follow-up path into Arc.
- A differentiated public profile as a stablecoin payment infra builder.

## 10. Public Repository Hygiene

If this repository becomes public, it should be safe for community members, ecosystem teams, and protocol contributors to inspect.

Do:

- Use neutral project language.
- Cite official sources for protocol details.
- Separate official facts from market expectations.
- Keep testnet private keys out of the repository.
- Use `.env.example` for required environment variables.
- Include reproducible setup instructions.
- Include known limitations and non-production warnings.

Do not:

- Present the project as an airdrop farming guide.
- Reference internal working tools or private implementation context.
- Commit generated cache files, local machine artifacts, or secrets.
- Claim official token, ICO, or airdrop details unless confirmed by official sources.
- Use mainnet funds in examples unless the code is explicitly hardened for production use.

## 11. Build Gate Before Implementation

The Tempo implementation gate is tracked in [Tempo Build Gate](./tempo-build-gate.md).

Current decisions:

1. Use Tempo Testnet (Moderato) for v1.
2. Use Vite, React, TypeScript, Wagmi, Viem, `tempo.ts`, and TanStack Query.
3. Support pathUSD, AlphaUSD, BetaUSD, and ThetaUSD as payment-token options.
4. Support pathUSD, AlphaUSD, BetaUSD, and ThetaUSD as initial fee-token options.
5. Use TIP-20 `transferWithMemo(address,uint256,bytes32)` for invoice references.
6. Reconcile with `TransferWithMemo` logs.
7. Store invoices locally in the browser for v1.
8. Keep fee sponsorship optional until a live sponsored test transaction succeeds.
9. Avoid custom contracts, mainnet funds, backend infrastructure, and token/airdrop claims in v1.

Implementation can proceed after one final live test of the faucet, a self-paid memo transfer, and log decoding against the resulting transaction.
