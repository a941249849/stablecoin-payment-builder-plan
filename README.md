# Tempo StablePay

Tempo StablePay is an engineering workspace for building and validating a stablecoin payment workflow on Tempo Testnet.

The first demo focuses on a practical payment loop:

1. Create a local invoice.
2. Encode the invoice reference as a TIP-20 `bytes32` memo.
3. Send a selected test stablecoin with `transferWithMemo`.
4. Reconcile payment status from the `TransferWithMemo` event.

This repository is used to keep the build reproducible through GitHub and Vercel. Broader market or protocol comparisons should be treated as separate research notes, not as the purpose of the app itself.

Start with:

- [Tempo Delivery Package](docs/tempo-delivery-package.md)
- [Tempo X Long-Form Draft](docs/tempo-x-thread-draft.md)
- [Tempo X Publish Pack](docs/tempo-x-publish-pack.md)
- [Tempo Current State Review](docs/tempo-current-state.md)
- [Tempo Build Gate](docs/tempo-build-gate.md)
- [Vercel Deployment](docs/vercel-deployment.md)
- [Tempo StablePay App](apps/tempo-stablepay/README.md)
- [Seven-Day Build and Content Plan](docs/tempo-seven-day-plan.md)
- [Planning Notes](docs/tempo-arc-builder-plan.md)

Current phase status:

1. Tempo StablePay is built and deployed as an invoice-style payment demo.
2. The working proof path is `invoice -> memo -> transferWithMemo -> RPC receipt -> TransferWithMemo match -> paid`.
3. A successful Tempo Wallet transaction has been captured through the public RPC receipt and matched memo log.
4. Tempo Explorer can still return `404` for the confirmed transaction hash, so Explorer is treated as a secondary indexing surface rather than the source of truth.
5. The Tempo article draft and evidence package are ready for publication review.
6. Arc work remains the next implementation-backed comparison phase after the Tempo article is published.

Public repo principles:

- Keep protocol claims source-backed and date-aware.
- Separate official facts from market expectations.
- Build demos around real payment workflows rather than token speculation.
- Avoid committing private keys, local artifacts, or internal working notes.
