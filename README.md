# Stablecoin Payment Infrastructure Research

This repository tracks a builder-oriented research and implementation plan for stablecoin payment infrastructure, with an initial focus on Tempo and a follow-up comparison track for Arc.

Start with:

- [Tempo and Arc Stablecoin Payment Builder Plan](docs/tempo-arc-builder-plan.md)
- [Tempo Build Gate](docs/tempo-build-gate.md)
- [Vercel Deployment](docs/vercel-deployment.md)
- [Tempo StablePay App](apps/tempo-stablepay/README.md)

Primary near-term focus:

1. Deploy the Tempo StablePay preview through Vercel.
2. Validate a self-paid AlphaUSD memo transfer on Tempo Testnet.
3. Confirm `TransferWithMemo` reconciliation from the live transaction.
4. Use Arc's current attention window for a comparable USDC checkout research/demo track.
5. Publish a Tempo vs Arc comparison based on real implementation evidence.

Public repo principles:

- Keep protocol claims source-backed and date-aware.
- Separate official facts from market expectations.
- Build demos around real payment workflows rather than token speculation.
- Avoid committing private keys, local artifacts, or internal working notes.
