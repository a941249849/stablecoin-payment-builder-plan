import { FormEvent, useEffect, useMemo, useState } from 'react'
import { formatUnits, isAddress, parseAbiItem, parseUnits } from 'viem'
import { useAccount, useConnect, useDisconnect, useSwitchChain, useWatchContractEvent } from 'wagmi'
import { Hooks } from 'wagmi/tempo'
import { createInvoice, Invoice, loadInvoices, saveInvoices } from './invoices'
import { decodeMemo, encodeMemo } from './memo'
import {
  defaultPaymentToken,
  docsUrl,
  explorerBaseUrl,
  faucetApiUrl,
  faucetUrl,
  feeTokens,
  findStableToken,
  stableTokens,
} from './tempo'

const transferWithMemoEvent = parseAbiItem(
  'event TransferWithMemo(address indexed from, address indexed to, uint256 value, bytes32 indexed memo)',
)

type Language = 'zh' | 'en'
type FaucetStatus = 'idle' | 'pending' | 'success' | 'error'

const copy = {
  zh: {
    network: 'Tempo 测试网',
    title: 'Tempo StablePay',
    subtitle:
      '一个用于验证 Tempo 稳定币支付工作流的测试网 demo：选择 pathUSD、AlphaUSD、BetaUSD 或 ThetaUSD 创建发票，写入 TIP-20 memo，并用 TransferWithMemo 事件完成对账。',
    stack: '基于 Vite、React、Wagmi、Viem 和 tempo.ts 构建。',
    supportedWallets: '连接入口覆盖 Tempo Wallet，并通过浏览器注入钱包支持 OKX Wallet、MetaMask 等可添加 Tempo 网络的钱包。',
    language: 'English',
    invoice: '发票',
    paymentToken: '付款代币',
    recipient: '收款地址',
    amount: '金额',
    feeToken: '手续费代币',
    create: '创建发票',
    balance: '当前付款代币余额',
    payments: '支付记录',
    empty: '还没有发票。',
    send: '发送',
    receipt: '凭证',
    switch: '切换网络',
    disconnect: '断开连接',
    faucet: '官方领水',
    docs: 'Tempo 文档',
    requestFaucet: '给当前钱包领水',
    faucetPending: '正在请求测试币...',
    faucetSuccess: '领水请求已提交，稍后刷新余额。',
    faucetError: '网页端领水请求失败，请使用官方领水页面。',
    connectTitle: '连接钱包',
    connectHint: '如果你安装了 OKX Wallet 或 MetaMask，浏览器注入入口会显示对应钱包名称。',
    noWallet: '未检测到浏览器钱包时，可先使用 Tempo Wallet 或打开官方领水页面填写地址。',
  },
  en: {
    network: 'Tempo Testnet',
    title: 'Tempo StablePay',
    subtitle:
      'A testnet demo for validating a Tempo stablecoin payment workflow: choose pathUSD, AlphaUSD, BetaUSD, or ThetaUSD, create an invoice, encode a TIP-20 memo, and reconcile with TransferWithMemo events.',
    stack: 'Built with Vite, React, Wagmi, Viem, and tempo.ts.',
    supportedWallets:
      'Wallet access includes Tempo Wallet plus injected wallets such as OKX Wallet and MetaMask when they support or can add the Tempo network.',
    language: '中文',
    invoice: 'Invoice',
    paymentToken: 'Payment token',
    recipient: 'Recipient',
    amount: 'Amount',
    feeToken: 'Fee token',
    create: 'Create invoice',
    balance: 'Selected payment token balance',
    payments: 'Payments',
    empty: 'No invoices yet.',
    send: 'Send',
    receipt: 'Receipt',
    switch: 'Switch network',
    disconnect: 'Disconnect',
    faucet: 'Official faucet',
    docs: 'Tempo docs',
    requestFaucet: 'Fund connected wallet',
    faucetPending: 'Requesting test funds...',
    faucetSuccess: 'Faucet request submitted. Refresh the balance shortly.',
    faucetError: 'In-app faucet request failed. Use the official faucet page.',
    connectTitle: 'Connect wallet',
    connectHint: 'If OKX Wallet or MetaMask is installed, the injected wallet entry should show its wallet name.',
    noWallet: 'If no browser wallet is detected, use Tempo Wallet or open the official faucet page with an address.',
  },
} as const

export function App() {
  const [language, setLanguage] = useState<Language>('zh')
  const [paymentTokenAddress, setPaymentTokenAddress] = useState<`0x${string}`>(defaultPaymentToken.address)
  const [recipient, setRecipient] = useState<`0x${string}`>('0x0000000000000000000000000000000000000000')
  const [amount, setAmount] = useState('100')
  const [feeToken, setFeeToken] = useState<`0x${string}`>(defaultPaymentToken.address)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>()
  const [faucetStatus, setFaucetStatus] = useState<FaucetStatus>('idle')
  const { address, chainId, isConnected } = useAccount()
  const { connectors, connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const transfer = Hooks.token.useTransferSync()
  const selectedPaymentToken = findStableToken(paymentTokenAddress)

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
  const selectedInvoiceToken = selectedInvoice ? findStableToken(selectedInvoice.token) : selectedPaymentToken
  const balance = Hooks.token.useGetBalance({
    account: address,
    token: selectedPaymentToken.address,
  })
  const t = copy[language]

  useWatchContractEvent({
    address: selectedInvoiceToken.address,
    abi: [transferWithMemoEvent],
    eventName: 'TransferWithMemo',
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
            txHash: match.transactionHash ?? undefined,
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
      token: selectedPaymentToken.address,
      memo: encodeMemo(id),
    })

    setInvoices((current) => [invoice, ...current])
    setSelectedInvoiceId(invoice.id)
  }

  function sendInvoice(invoice: Invoice) {
    const invoiceToken = findStableToken(invoice.token)

    transfer.mutate(
      {
        token: invoice.token,
        to: invoice.recipient,
        amount: parseUnits(invoice.amount, invoiceToken.decimals),
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

  async function requestFaucet() {
    if (!address) return

    setFaucetStatus('pending')

    try {
      const response = await fetch(faucetApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.toLowerCase() }),
      })

      if (!response.ok) throw new Error(`Faucet returned ${response.status}`)
      setFaucetStatus('success')
      await balance.refetch()
    } catch {
      setFaucetStatus('error')
    }
  }

  return (
    <main className="shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.network}</p>
            <h1>{t.title}</h1>
          </div>
          <div className="topActions">
            <button type="button" className="secondary" onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}>
              {t.language}
            </button>
            <a className="secondary" href={docsUrl} target="_blank" rel="noreferrer">
              {t.docs}
            </a>
            <a href={faucetUrl} target="_blank" rel="noreferrer">
              {t.faucet}
            </a>
          </div>
        </header>

        <section className="hero">
          <p>{t.subtitle}</p>
          <div className="heroMeta">
            <span>TIP-20 memo</span>
            <span>pathUSD / AlphaUSD / BetaUSD / ThetaUSD</span>
            <span>TransferWithMemo</span>
          </div>
          <p className="muted">{t.stack}</p>
          <p className="muted">{t.supportedWallets}</p>
        </section>

        <section className="walletPanel">
          <div>
            <h2>{t.connectTitle}</h2>
            <p>{t.connectHint}</p>
            <p>{t.noWallet}</p>
          </div>
          <div className="wallet">
            {isConnected ? (
              <>
                <span>{shortAddress(address)}</span>
                {chainId !== 42431 ? (
                  <button type="button" onClick={() => switchChain({ chainId: 42431 })}>
                    {t.switch}
                  </button>
                ) : null}
                <button type="button" onClick={() => disconnect()}>
                  {t.disconnect}
                </button>
                <button type="button" className="secondary" disabled={faucetStatus === 'pending'} onClick={requestFaucet}>
                  {t.requestFaucet}
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
                  {connector.name}
                </button>
              ))
            )}
          </div>
          {faucetStatus !== 'idle' ? (
            <p className={`faucetStatus ${faucetStatus}`}>
              {faucetStatus === 'pending'
                ? t.faucetPending
                : faucetStatus === 'success'
                  ? t.faucetSuccess
                  : t.faucetError}
            </p>
          ) : null}
        </section>

        <div className="grid">
          <section className="panel">
            <div className="panelHeader">
              <h2>{t.invoice}</h2>
              <span>{selectedPaymentToken.symbol}</span>
            </div>

            <form onSubmit={addInvoice} className="stack">
              <label>
                {t.paymentToken}
                <select
                  value={paymentTokenAddress}
                  onChange={(event) => setPaymentTokenAddress(event.target.value as `0x${string}`)}
                >
                  {stableTokens.map((token) => (
                    <option key={token.address} value={token.address}>
                      {token.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.recipient}
                <input value={recipient} onChange={(event) => setRecipient(event.target.value as `0x${string}`)} />
              </label>
              <label>
                {t.amount}
                <input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
              </label>
              <label>
                {t.feeToken}
                <select value={feeToken} onChange={(event) => setFeeToken(event.target.value as `0x${string}`)}>
                  {feeTokens.map((token) => (
                    <option key={token.address} value={token.address}>
                      {token.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">{t.create}</button>
            </form>

            <div className="balance">
              <span>{t.balance}</span>
              <strong>
                {balance.data === undefined ? '0.00' : formatUnits(balance.data, selectedPaymentToken.decimals)}{' '}
                {selectedPaymentToken.symbol}
              </strong>
            </div>
          </section>

          <section className="panel wide">
            <div className="panelHeader">
              <h2>{t.payments}</h2>
              <span>{invoices.length}</span>
            </div>

            <div className="invoiceList">
              {invoices.length === 0 ? <p className="empty">{t.empty}</p> : null}
              {invoices.map((invoice) => (
                <InvoiceRow
                  invoice={invoice}
                  isActive={invoice.id === selectedInvoice?.id}
                  isConnected={isConnected}
                  isPending={transfer.isPending}
                  key={invoice.id}
                  onSelect={() => setSelectedInvoiceId(invoice.id)}
                  onSend={() => sendInvoice(invoice)}
                  receiptLabel={t.receipt}
                  sendLabel={t.send}
                />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function InvoiceRow({
  invoice,
  isActive,
  isConnected,
  isPending,
  onSelect,
  onSend,
  receiptLabel,
  sendLabel,
}: {
  invoice: Invoice
  isActive: boolean
  isConnected: boolean
  isPending: boolean
  onSelect: () => void
  onSend: () => void
  receiptLabel: string
  sendLabel: string
}) {
  const token = findStableToken(invoice.token)

  return (
    <article className={isActive ? 'invoice active' : 'invoice'} onClick={onSelect}>
      <div>
        <h3>{invoice.id}</h3>
        <p>{shortAddress(invoice.recipient)}</p>
      </div>
      <div>
        <strong>
          {invoice.amount} {token.symbol}
        </strong>
        <span className={`status ${invoice.status}`}>{invoice.status}</span>
      </div>
      <div className="memo">{decodeMemo(invoice.memo)}</div>
      <div className="actions">
        <button
          type="button"
          disabled={!isConnected || isPending}
          onClick={(event) => {
            event.stopPropagation()
            onSend()
          }}
        >
          {sendLabel}
        </button>
        {invoice.txHash ? (
          <a href={`${explorerBaseUrl}/tx/${invoice.txHash}`} target="_blank" rel="noreferrer">
            {receiptLabel}
          </a>
        ) : null}
      </div>
    </article>
  )
}

function shortAddress(value: string | undefined) {
  if (!value) return 'Not connected'
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}
