import { FormEvent, useEffect, useMemo, useState } from 'react'
import { formatUnits, isAddress, parseAbiItem, parseUnits } from 'viem'
import { useAccount, useConnect, useDisconnect, useSwitchChain, useWatchContractEvent } from 'wagmi'
import { Hooks } from 'wagmi/tempo'
import { createInvoice, Invoice, loadInvoices, saveInvoices } from './invoices'
import { decodeMemo, encodeMemo } from './memo'
import { docsUrl, explorerBaseUrl, faucetApiUrl, faucetUrl, feeTokens, paymentToken } from './tempo'

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
      '一个用于验证 Tempo 稳定币支付工作流的测试网 demo：创建发票、写入 TIP-20 memo、发送 AlphaUSD，并用 TransferWithMemo 事件完成对账。',
    stack: '基于 Vite、React、Wagmi、Viem 和 tempo.ts 构建。',
    supportedWallets: '连接入口覆盖 Tempo Wallet，并通过浏览器注入钱包支持 OKX Wallet、MetaMask 等可添加 Tempo 网络的钱包。',
    language: 'English',
    invoice: '发票',
    recipient: '收款地址',
    amount: '金额',
    feeToken: '手续费代币',
    create: '创建发票',
    balance: 'AlphaUSD 余额',
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
      'A testnet demo for validating a Tempo stablecoin payment workflow: create an invoice, encode a TIP-20 memo, send AlphaUSD, and reconcile with TransferWithMemo events.',
    stack: 'Built with Vite, React, Wagmi, Viem, and tempo.ts.',
    supportedWallets:
      'Wallet access includes Tempo Wallet plus injected wallets such as OKX Wallet and MetaMask when they support or can add the Tempo network.',
    language: '中文',
    invoice: 'Invoice',
    recipient: 'Recipient',
    amount: 'Amount',
    feeToken: 'Fee token',
    create: 'Create invoice',
    balance: 'AlphaUSD balance',
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
  const [recipient, setRecipient] = useState<`0x${string}`>('0x0000000000000000000000000000000000000000')
  const [amount, setAmount] = useState('100')
  const [feeToken, setFeeToken] = useState<`0x${string}`>(paymentToken.address)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>()
  const [faucetStatus, setFaucetStatus] = useState<FaucetStatus>('idle')
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
  const t = copy[language]

  useWatchContractEvent({
    address: paymentToken.address,
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
            <span>AlphaUSD</span>
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
              <span>{paymentToken.symbol}</span>
            </div>

            <form onSubmit={addInvoice} className="stack">
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
                {balance.data === undefined ? '0.00' : formatUnits(balance.data, paymentToken.decimals)}
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
                      {t.send}
                    </button>
                    {invoice.txHash ? (
                      <a href={`${explorerBaseUrl}/tx/${invoice.txHash}`} target="_blank" rel="noreferrer">
                        {t.receipt}
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
