import { FormEvent, useEffect, useMemo, useState } from 'react'
import { formatUnits, isAddress, parseAbiItem, parseUnits, zeroAddress } from 'viem'
import { useAccount, useConnect, useDisconnect, useReadContract, useSwitchChain, useWatchContractEvent } from 'wagmi'
import { Hooks } from 'wagmi/tempo'
import { createInvoice, Invoice, loadInvoices, saveInvoices } from './invoices'
import { decodeMemo, encodeMemo } from './memo'
import { PaymentNetwork } from './PaymentNetwork'
import {
  defaultPaymentToken,
  docsUrl,
  explorerBaseUrl,
  faucetApiUrl,
  faucetUrl,
  feeTokens,
  findStableToken,
  stableTokens,
  tempoChainId,
  tempoSwitchParameter,
} from './tempo'

const transferWithMemoEvent = parseAbiItem(
  'event TransferWithMemo(address indexed from, address indexed to, uint256 value, bytes32 indexed memo)',
)
const balanceOfAbi = [parseAbiItem('function balanceOf(address account) view returns (uint256)')]

type Language = 'zh' | 'en'
type FaucetStatus = 'idle' | 'pending' | 'success' | 'error'
type ActionState = {
  tone: 'neutral' | 'success' | 'error'
  text: string
}

const copy = {
  zh: {
    network: 'Tempo 测试网',
    title: 'Tempo StablePay',
    subtitle:
      '一个用于验证 Tempo 稳定币支付工作流的测试网 demo：选择 pathUSD、AlphaUSD、BetaUSD 或 ThetaUSD 创建发票，写入 TIP-20 memo，并用 TransferWithMemo 事件完成对账。',
    stack: '基于 Vite、React、Wagmi、Viem 和 tempo.ts 构建。',
    supportedWallets: '连接入口覆盖 Tempo Wallet，并通过浏览器注入钱包支持 OKX Wallet、MetaMask 等可添加 Tempo 网络的钱包。',
    designTitle: '从支付逻辑出发的链',
    designBody:
      'Tempo 的关键不是再做一个通用交易链，而是把稳定币支付需要的低成本、支付元数据、确定性结算和可赞助手续费放到第一层体验里。这个 demo 用发票、memo、事件监听和手续费代币选择去验证这条路径。',
    language: 'English',
    invoice: '发票',
    paymentToken: '付款代币',
    recipient: '收款地址',
    useWallet: '使用当前钱包',
    amount: '金额',
    feeToken: '手续费代币',
    create: '创建发票',
    balance: '当前付款代币余额',
    payments: '支付记录',
    empty: '还没有发票。',
    send: '发送',
    receipt: '凭证',
    switch: '切换网络',
    switching: '正在请求钱包切换网络...',
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
    wrongNetwork: '当前钱包不在 Tempo Testnet，请先切换网络。',
    balanceLoading: '读取中...',
    walletConfirm: '已提交发送请求，请在钱包中确认交易。',
    paymentSent: '交易已上链，等待 TransferWithMemo 事件对账。',
    paymentError: '发送失败',
    switchSuccess: '已切换到 Tempo Testnet。',
    switchError: '网络切换失败，请在钱包中手动添加 Tempo Testnet。',
    invalidRecipient: '收款地址不可用。请使用有效地址，不能是 0x000...000。',
    invalidInvoice: '这张发票的收款地址无效，请重新创建。',
  },
  en: {
    network: 'Tempo Testnet',
    title: 'Tempo StablePay',
    subtitle:
      'A testnet demo for validating a Tempo stablecoin payment workflow: choose pathUSD, AlphaUSD, BetaUSD, or ThetaUSD, create an invoice, encode a TIP-20 memo, and reconcile with TransferWithMemo events.',
    stack: 'Built with Vite, React, Wagmi, Viem, and tempo.ts.',
    supportedWallets:
      'Wallet access includes Tempo Wallet plus injected wallets such as OKX Wallet and MetaMask when they support or can add the Tempo network.',
    designTitle: 'A chain shaped around payment logic',
    designBody:
      'Tempo is not just another general trading chain. Its payment thesis is low cost, payment metadata, deterministic settlement, and fee sponsorship as first-layer UX. This demo validates that path through invoices, memos, event listeners, and fee-token selection.',
    language: '中文',
    invoice: 'Invoice',
    paymentToken: 'Payment token',
    recipient: 'Recipient',
    useWallet: 'Use current wallet',
    amount: 'Amount',
    feeToken: 'Fee token',
    create: 'Create invoice',
    balance: 'Selected payment token balance',
    payments: 'Payments',
    empty: 'No invoices yet.',
    send: 'Send',
    receipt: 'Receipt',
    switch: 'Switch network',
    switching: 'Requesting wallet network switch...',
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
    wrongNetwork: 'The wallet is not on Tempo Testnet. Switch networks first.',
    balanceLoading: 'Loading...',
    walletConfirm: 'Send request submitted. Confirm the transaction in your wallet.',
    paymentSent: 'Transaction landed. Waiting for TransferWithMemo reconciliation.',
    paymentError: 'Send failed',
    switchSuccess: 'Switched to Tempo Testnet.',
    switchError: 'Network switch failed. Add Tempo Testnet manually in the wallet.',
    invalidRecipient: 'Recipient is not usable. Use a valid non-zero address.',
    invalidInvoice: 'This invoice has an invalid recipient. Create a new one.',
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
  const [actionState, setActionState] = useState<ActionState>()
  const { address, chainId, isConnected } = useAccount()
  const { connectors, connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()
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
  const balance = useReadContract({
    address: selectedPaymentToken.address,
    abi: balanceOfAbi,
    functionName: 'balanceOf',
    chainId: tempoChainId,
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: isConnected ? 4_000 : false,
      staleTime: 0,
    },
  })
  const t = copy[language]
  const isTempoNetwork = chainId === tempoChainId
  const recipientIsValid = isUsableAddress(recipient)

  useEffect(() => {
    if (address) void balance.refetch()
  }, [address, selectedPaymentToken.address])

  useEffect(() => {
    if (address && !isUsableAddress(recipient)) {
      setRecipient(address)
    }
  }, [address, recipient])

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
      void balance.refetch()
      setActionState({ tone: 'success', text: t.paymentSent })
    },
  })

  function addInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!recipientIsValid) {
      setActionState({ tone: 'error', text: t.invalidRecipient })
      return
    }
    if (!amount || Number(amount) <= 0) return

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
    setActionState(undefined)
  }

  function sendInvoice(invoice: Invoice) {
    if (!isConnected) return
    if (!isUsableAddress(invoice.recipient)) {
      setActionState({ tone: 'error', text: t.invalidInvoice })
      return
    }
    if (!isTempoNetwork) {
      void switchToTempo()
      return
    }

    const invoiceToken = findStableToken(invoice.token)
    setActionState({ tone: 'neutral', text: t.walletConfirm })

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
          void balance.refetch()
          setActionState({ tone: 'success', text: t.paymentSent })
        },
        onError: (error) => {
          setActionState({ tone: 'error', text: `${t.paymentError}: ${error.message}` })
        },
      },
    )
  }

  async function switchToTempo() {
    setActionState({ tone: 'neutral', text: t.switching })

    try {
      await switchChainAsync({
        chainId: tempoChainId,
        addEthereumChainParameter: tempoSwitchParameter,
      })
      setActionState({ tone: 'success', text: t.switchSuccess })
    } catch (error) {
      const message = error instanceof Error ? error.message : t.switchError
      setActionState({ tone: 'error', text: `${t.switchError} ${message}` })
    }
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
          <div className="heroCopy">
            <p>{t.subtitle}</p>
            <div className="heroMeta">
              <span>TIP-20 memo</span>
              <span>pathUSD / AlphaUSD / BetaUSD / ThetaUSD</span>
              <span>TransferWithMemo</span>
            </div>
            <p className="muted">{t.stack}</p>
            <p className="muted">{t.supportedWallets}</p>
          </div>
          <PaymentNetwork />
        </section>

        <section className="logicPanel">
          <div>
            <p className="eyebrow">{t.network}</p>
            <h2>{t.designTitle}</h2>
          </div>
          <p>{t.designBody}</p>
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
                {!isTempoNetwork ? (
                  <button type="button" disabled={isSwitching} onClick={() => void switchToTempo()}>
                    {isSwitching ? t.switching : t.switch}
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
          {actionState ? <p className={`actionState ${actionState.tone}`}>{actionState.text}</p> : null}
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
                <div className="recipientControl">
                  <input value={recipient} onChange={(event) => setRecipient(event.target.value as `0x${string}`)} />
                  <button type="button" className="secondary" disabled={!address} onClick={() => address && setRecipient(address)}>
                    {t.useWallet}
                  </button>
                </div>
              </label>
              {!recipientIsValid ? <p className="fieldHint error">{t.invalidRecipient}</p> : null}
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
              <button type="submit" disabled={!recipientIsValid}>
                {t.create}
              </button>
            </form>

            <div className="balance">
              <span>{t.balance}</span>
              <strong>
                {balance.isFetching
                  ? t.balanceLoading
                  : balance.data === undefined
                    ? '0.00'
                    : formatUnits(balance.data, selectedPaymentToken.decimals)}{' '}
                {selectedPaymentToken.symbol}
              </strong>
            </div>
            {isConnected && !isTempoNetwork ? <p className="fieldHint">{t.wrongNetwork}</p> : null}
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
                  isTempoNetwork={isTempoNetwork}
                  isPending={transfer.isPending}
                  isSwitching={isSwitching}
                  invalidLabel={t.invalidInvoice}
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
  isTempoNetwork,
  isPending,
  isSwitching,
  invalidLabel,
  onSelect,
  onSend,
  receiptLabel,
  sendLabel,
}: {
  invoice: Invoice
  isActive: boolean
  isConnected: boolean
  isTempoNetwork: boolean
  isPending: boolean
  isSwitching: boolean
  invalidLabel: string
  onSelect: () => void
  onSend: () => void
  receiptLabel: string
  sendLabel: string
}) {
  const token = findStableToken(invoice.token)
  const invoiceRecipientIsValid = isUsableAddress(invoice.recipient)

  return (
    <article className={isActive ? 'invoice active' : 'invoice'} onClick={onSelect}>
      <div>
        <h3>{invoice.id}</h3>
        <p>{invoiceRecipientIsValid ? shortAddress(invoice.recipient) : invalidLabel}</p>
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
          disabled={!isConnected || isPending || isSwitching || !invoiceRecipientIsValid}
          onClick={(event) => {
            event.stopPropagation()
            onSend()
          }}
        >
          {isConnected && !isTempoNetwork ? 'Switch' : sendLabel}
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

function isUsableAddress(value: string | undefined): value is `0x${string}` {
  return Boolean(value && isAddress(value) && value.toLowerCase() !== zeroAddress)
}
