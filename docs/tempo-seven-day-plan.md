# Tempo Seven-Day Build and Content Plan

Last updated: 2026-05-13

This plan connects the previous Tempo testnet article with a second-phase build: update Tempo's current state, build a reproducible StablePay demo, collect live transaction evidence, and publish a long-form X thread.

Arc research and demo work belongs to the next phase after the Tempo build has a clear public artifact and article.

## Day 1: Tempo Latest State Research and Article Outline

Goals:

- Refresh Tempo's current public status from official docs, GitHub, token list, status page, and examples.
- Compare the current docs against the earlier Tempo testnet walkthrough.
- Identify what changed: SDKs, wallet support, faucet, TIP-20 memo flow, fee sponsorship, Tempo Wallet, supported tokens, explorer behavior.
- Draft the article outline before writing code.

Outputs:

- Current-state notes.
- Article outline.
- Updated build assumptions.

## Day 2: StablePay Frontend and Invoice Flow

Goals:

- Build the Vercel-deployed frontend shell.
- Support Chinese and English.
- Explain what the demo does and what it is built with.
- Add wallet entry points for Tempo Wallet and injected wallets such as OKX Wallet and MetaMask.
- Create local invoices with token, recipient, amount, memo, and status.

Outputs:

- Working Vercel preview.
- Invoice creation flow.
- Four test stablecoins available as payment tokens: pathUSD, AlphaUSD, BetaUSD, ThetaUSD.

## Day 3: Run `transferWithMemo`

Goals:

- Fund a test wallet from the official faucet.
- Send a TIP-20 `transferWithMemo` transaction using the selected stablecoin.
- Preserve the tx hash and explorer link.
- Document wallet behavior and any fee-token quirks.

Outputs:

- Successful tx hash.
- Screenshot of the send flow.
- Notes for the X thread.

## Day 4: Listen to `TransferWithMemo` and Reconcile

Goals:

- Watch `TransferWithMemo` logs for the selected invoice token.
- Match invoice status by token address, recipient, and memo.
- Update invoice status automatically after log detection.

Outputs:

- Automatic reconciliation working in the demo.
- Screenshot or short clip showing status transition.
- Event decoding notes.

## Day 5: Fee Sponsorship and Transaction Display

Goals:

- Test the public testnet sponsor path if it is stable.
- If sponsorship is not reliable, document it as deferred rather than weakening the core demo.
- Improve tx display: tx hash, selected payment token, selected fee token, explorer link, matched event metadata.

Outputs:

- Fee sponsorship result: working or explicitly deferred.
- Transaction details panel.
- Limitations section updated.

## Day 6: README, Screenshots, and Evidence

Goals:

- Update README with setup, architecture, token list, wallet support, faucet path, limitations, and known quirks.
- Add screenshots and tx hash evidence.
- Keep the public repo framed as a Tempo StablePay engineering artifact.

Outputs:

- Final README.
- Screenshots.
- Tx hash list.
- Article evidence pack.

## Day 7: Publish X Long-Form Article

Goals:

- Publish the second-phase Tempo article.
- Connect it to the earlier Tempo testnet article.
- Explain what was rebuilt, what worked, what was harder than expected, and what the demo proves about payment infrastructure.
- Link GitHub repo, Vercel demo, tx hash, and screenshots.

Outputs:

- X long-form post.
- GitHub issue/comment with publication link.
- Backlog for Arc comparison and demo.

## Next Phase: Arc Comparison Track

After the Tempo demo and article are published:

- Refresh Arc's latest status.
- Build a comparable Arc payment or checkout demo if docs and network access allow.
- Write a comparison report based on actual implementation evidence rather than market attention alone.

