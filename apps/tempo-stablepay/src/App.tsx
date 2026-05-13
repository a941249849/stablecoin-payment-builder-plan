import { FormEvent, useEffect, useMemo, useState } from 'react'
import { formatUnits, isAddress, parseAbiItem, parseUnits } from 'viem'
import { useAccount, useConnect, useDisconnect, useSwitchChain, useWatchContractEvent } from 'wagmi'
import { Hooks } from 'wagmi/tempo'
import { createInvoice, Invoice, loadInvoices, saveInvoices } from './invoices'
import { decodeMemo, encodeMemo } from './memo'
import { explorerBaseUrl, feeTokens, paymentToken } from './tempo'

const transferWithMemoEvent = parseAbiItem(
  'event TransferWithMemo(address indexed from, address indexed to, uint256 value, bytes32 indexed memo)',
)

export function App() {
  const [recipient, setRecipient] = useState<`0x${string}`>('0x0000000000000000000000000000000000000000')
  const [amount, setAmount] = useState('100')
  const [feeToken, setFeeToken] = useState(paymentToken.address)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>()
  const { address, chainId, isConnected } = useAccount()
  const { connectors, connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const transfer = Hooks.token.useTransferSync()
  const balance = Hooks.token.useGetBalance({
    account: address,
    token: paymentToken.address,
  })

  useEffect(() => {
    setInvoices(loadInvoices())
  }, [])

  useEffect(() => {
    saveInvoices(invoices)
  }, [invoices])

  const selectedInvoice = useMemo(
    () => invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? invoices[0],
    [invoices, selectedInvoiceId],
  )

  useWatchContractEvent({
    address: paymentToken.address,
    event: transferWithMemoEvent,
    args: selectedInvoice
      ? {
          to: selectedInvoice.recipient,
          memo: selectedInvoice.memo,
        }
      : undefined,
    onLogs: (logs) => {
      if (!selectedInvoice) return

      setInvoices((current) =>
        current.map((invoice) => {
          const match = logs.find((log) => {
            const memo = log.args.memo
            const to = log.args.to?.toLowerCase()
            return memo === invoice.memo && to === invoice.recipient.toLowerCase()
          })

          if (!match) return invoice

          return {
            ...invoice,
            status: 'paid',
            txHash: match.transactionHash,
            matchedAt: new Date().toISOString(),
          }
        }),
      )
    },
  })

  function addInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isAddress(recipient)) return

    const id = `INV-${Date.now().toString(36).toUpperCase()}`
    const invoice = createInvoice({
      id,
      recipient,
      amount,
      token: paymentToken.address,
      memo: encodeMemo(id),
    })

    setInvoices((current) => [invoice, ...current])
    setSelectedInvoiceId(invoice.id)
  }

  function sendInvoice(invoice: Invoice) {
    transfer.mutate(
      {
        token: invoice.token,
        to: invoice.recipient,
        amount: parseUnits(invoice.amount, paymentToken.decimals),
        memo: invoice.memo,
        feeToken,
      },
      {
        onSuccess: (result) => {
          setInvoices((current) =>
            current.map((item) =>
              item.id === invoice.id
                ? {
                    ...item,
                    status: 'pending',
                    txHash: result.receipt.transactionHash,
                  }
                : item,
            ),
          )
        },
      },
    )
  }

  return (
    <main className="shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Tempo Testnet</p>
            <h1>StablePay</h1>
          </div>
          <div className="wallet">
            {isConnected ? (
              <>
                <span>{shortAddress(address)}</span>
                {chainId !== 42431 ? (
                  <button type="button" onClick={() => switchChain({ chainId: 42431 })}>
                    Switch
                  </button>
                ) : null}
                <button type="button" onClick={() => disconnect()}>
                  Disconnect
                </button>
              </>
            ) : (
              connectors.map((connector) => (
                <button
                  type="button"
                  disabled={isConnecting}
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                >
                  Connect
                </button>
              ))
            )}
          </div>
        </header>

        <div className="grid">
          <section className="panel">
            <div className="panelHeader">
              <h2>Invoice</h2>
              <span>{paymentToken.symbol}</span>
            </div>

            <form onSubmit={addInvoice} className="stack">
              <label>
                Recipient
                <input value={recipient} onChange={(event) => setRecipient(event.target.value as `0x${string}`)} />
              </label>
              <label>
                Amount
                <input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
              </label>
              <label>
                Fee token
                <select value={feeToken} onChange={(event) => setFeeToken(event.target.value as `0x${string}`)}>
                  {feeTokens.map((token) => (
                    <option key={token.address} value={token.address}>
                      {token.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Create</button>
            </form>

            <div className="balance">
              <span>AlphaUSD balance</span>
              <strong>
                {balance.data === undefined ? '0.00' : formatUnits(balance.data, paymentToken.decimals)}
              </strong>
            </div>
          </section>

          <section className="panel wide">
            <div className="panelHeader">
              <h2>Payments</h2>
              <span>{invoices.length}</span>
            </div>

            <div className="invoiceList">
              {invoices.length === 0 ? <p className="empty">No invoices yet.</p> : null}
              {invoices.map((invoice) => (
                <article
                  className={invoice.id === selectedInvoice?.id ? 'invoice active' : 'invoice'}
                  key={invoice.id}
                  onClick={() => setSelectedInvoiceId(invoice.id)}
                >
                  <div>
                    <h3>{invoice.id}</h3>
                    <p>{shortAddress(invoice.recipient)}</p>
                  </div>
                  <div>
                    <strong>
                      {invoice.amount} {paymentToken.symbol}
                    </strong>
                    <span className={`status ${invoice.status}`}>{invoice.status}</span>
                  </div>
                  <div className="memo">{decodeMemo(invoice.memo)}</div>
                  <div className="actions">
                    <button
                      type="button"
                      disabled={!isConnected || transfer.isPending}
                      onClick={(event) => {
                        event.stopPropagation()
                        sendInvoice(invoice)
                      }}
                    >
                      Send
                    </button>
                    {invoice.txHash ? (
                      <a href={`${explorerBaseUrl}/tx/${invoice.txHash}`} target="_blank" rel="noreferrer">
                        Receipt
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function shortAddress(value: string | undefined) {
  if (!value) return 'Not connected'
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}
