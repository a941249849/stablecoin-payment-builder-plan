# Tempo StablePay

Tempo StablePay is an engineering workspace for building and validating a stablecoin payment workflow on Tempo Testnet.

The first demo focuses on a practical payment loop:

1. Create a local invoice.
2. Encode the invoice reference as a TIP-20 `bytes32` memo.
3. Send a selected test stablecoin with `transferWithMemo`.
4. Reconcile payment status from the `TransferWithMemo` event.

This repository is used to keep the build reproducible through GitHub and Vercel. Broader market or protocol comparisons should be treated as separate research notes, not as the purpose of the app itself.

Start with:

- [Tempo Build Gate](docs/tempo-build-gate.md)
- [Vercel Deployment](docs/vercel-deployment.md)
- [Tempo StablePay App](apps/tempo-stablepay/README.md)
- [Seven-Day Build and Content Plan](docs/tempo-seven-day-plan.md)
- [Planning Notes](docs/tempo-arc-builder-plan.md)

Current engineering focus:

1. Keep the Vercel deployment green.
2. Validate wallet connection across Tempo Wallet, OKX Wallet, and MetaMask where available.
3. Validate faucet funding on Tempo Testnet.
4. Send a self-paid memo transfer with pathUSD, AlphaUSD, BetaUSD, or ThetaUSD.
5. Confirm `TransferWithMemo` reconciliation from the live transaction.

Public repo principles:

- Keep protocol claims source-backed and date-aware.
- Separate official facts from market expectations.
- Build demos around real payment workflows rather than token speculation.
- Avoid committing private keys, local artifacts, or internal working notes.
