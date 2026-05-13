import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
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
} as const

export const paymentToken = tokens.alphaUsd
export const feeTokens = [tokens.pathUsd, tokens.alphaUsd, tokens.betaUsd]

export const explorerBaseUrl = 'https://explore.testnet.tempo.xyz'

export const config = createConfig({
  chains: [tempoModerato.extend({ feeToken: paymentToken.address })],
  connectors: [injected()],
  transports: {
    [tempoModerato.id]: http('https://rpc.moderato.tempo.xyz'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
