import { fromHex, pad, stringToHex } from 'viem'

export function encodeMemo(value: string): `0x${string}` {
  return pad(stringToHex(value.slice(0, 32)), { size: 32 })
}

export function decodeMemo(value: `0x${string}` | undefined) {
  if (!value) return ''
  return fromHex(value, 'string').replace(/\0/g, '')
}
