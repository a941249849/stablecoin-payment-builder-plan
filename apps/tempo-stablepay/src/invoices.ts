export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'needs-review'

export type Invoice = {
  id: string
  recipient: `0x${string}`
  amount: string
  token: `0x${string}`
  memo: `0x${string}`
  status: InvoiceStatus
  txHash?: `0x${string}`
  blockNumber?: string
  sender?: `0x${string}`
  feeToken?: `0x${string}`
  memoMatched?: boolean
  transferLogIndex?: number
  matchedAt?: string
  createdAt: string
}

const storageKey = 'tempo-stablepay-invoices'

export function loadInvoices(): Invoice[] {
  const raw = window.localStorage.getItem(storageKey)
  if (!raw) return []

  try {
    const value = JSON.parse(raw)
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function saveInvoices(invoices: Invoice[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(invoices))
}

export function createInvoice(input: {
  id: string
  recipient: `0x${string}`
  amount: string
  token: `0x${string}`
  memo: `0x${string}`
}): Invoice {
  return {
    ...input,
    status: 'draft',
    createdAt: new Date().toISOString(),
  }
}
