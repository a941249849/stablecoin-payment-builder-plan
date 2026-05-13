import { createConfig, http } from 'wagmi'
import { injected, metaMask, tempoWallet } from 'wagmi/connectors'
import { tempoModerato } from 'viem/chains'

export const tokens = {
  pathUsd: {
    name: 'PathUSD',
    symbol: 'pathUSD',
    address: '0x20c0000000000000000000000000000000000000',
    decimals: 6,
  },
  alphaUsd: {
    name: 'AlphaUSD',
    symbol: 'alphaUSD',
    address: '0x20c0000000000000000000000000000000000001',
    decimals: 6,
  },
  betaUsd: {
    name: 'BetaUSD',
    symbol: 'betaUSD',
    address: '0x20c0000000000000000000000000000000000002',
    decimals: 6,
  },
  thetaUsd: {
    name: 'ThetaUSD',
    symbol: 'thetaUSD',
    address: '0x20c0000000000000000000000000000000000003',
    decimals: 6,
  },
} as const

export const stableTokens = [tokens.pathUsd, tokens.alphaUsd, tokens.betaUsd, tokens.thetaUsd] as const
export type StableToken = (typeof stableTokens)[number]
export const defaultPaymentToken = tokens.alphaUsd
export const feeTokens = stableTokens

export function findStableToken(address: `0x${string}`) {
  return stableTokens.find((token) => token.address.toLowerCase() === address.toLowerCase()) ?? defaultPaymentToken
}

export const tempoExplorerUrl = 'https://explore.tempo.xyz'
export const explorerBaseUrl = tempoExplorerUrl
export const faucetUrl = 'https://docs.tempo.xyz/quickstart/faucet'
export const faucetApiUrl = 'https://docs.tempo.xyz/api/faucet'
export const docsUrl = 'https://docs.tempo.xyz'
export const tempoChainId = tempoModerato.id
export const tempoRpcUrl = 'https://rpc.moderato.tempo.xyz'
export const tempoSwitchParameter = {
  nativeCurrency: {
    decimals: 18,
    name: 'USD',
    symbol: 'USD',
  },
  rpcUrls: [tempoRpcUrl],
  blockExplorerUrls: [tempoExplorerUrl],
}

export const config = createConfig({
  chains: [tempoModerato.extend({ feeToken: defaultPaymentToken.address })],
  connectors: [tempoWallet({ testnet: true }), metaMask(), injected()],
  multiInjectedProviderDiscovery: true,
  transports: {
    [tempoModerato.id]: http(tempoRpcUrl),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
