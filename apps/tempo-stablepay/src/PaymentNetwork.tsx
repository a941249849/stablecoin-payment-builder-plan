import { Language } from './copy'

const content = {
  zh: {
    eyebrow: 'Tempo payment canvas',
    title: '从发票到链上 memo 对账',
    subtitle: '一笔稳定币发票经过钱包签名、Tempo 结算和 TransferWithMemo 事件后，回到商户账本。',
    stages: ['创建发票', 'TIP-403 预检', 'transferWithMemo', '事件对账'],
    business: '商户发票台',
    wallet: '付款钱包',
    tempo: 'Tempo Moderato',
    ledger: '商户账本',
    fee: '稳定币费用路径',
    memo: 'bytes32 memo',
    pending: '等待发起',
    signed: '授权通过',
    settled: '已结算',
    reconciled: '已对账',
    invoice: 'INV-TESTNET',
    amount: '四种测试稳定币',
    flowNote: '核心不是“做一个动画”，而是把稳定币支付里最关键的四件事放到同一个流程：收款地址、policy 授权、memo 付款、自动对账。',
  },
  en: {
    eyebrow: 'Tempo payment canvas',
    title: 'From invoice to memo-based reconciliation',
    subtitle: 'A stablecoin invoice moves through wallet signing, Tempo settlement, and TransferWithMemo reconciliation back into the merchant ledger.',
    stages: ['Create invoice', 'TIP-403 preflight', 'transferWithMemo', 'Event match'],
    business: 'Merchant invoice desk',
    wallet: 'Payer wallet',
    tempo: 'Tempo Moderato',
    ledger: 'Merchant ledger',
    fee: 'Stablecoin fee path',
    memo: 'bytes32 memo',
    pending: 'Ready',
    signed: 'Authorized',
    settled: 'Settled',
    reconciled: 'Reconciled',
    invoice: 'INV-TESTNET',
    amount: '4 test stablecoins',
    flowNote: 'The point is not decoration. The flow keeps the payment-critical pieces together: recipient, policy authorization, memo payment, and automatic reconciliation.',
  },
} as const

export function PaymentNetwork({ language }: { language: Language }) {
  const copy = content[language]

  return (
    <div className="paymentCanvas">
      <div className="canvasHeader">
        <div>
          <p>{copy.eyebrow}</p>
          <h3>{copy.title}</h3>
          <span>{copy.subtitle}</span>
        </div>
      </div>

      <div className="canvasBoard">
        <div className="gridWash" />
        <div className="entityCard businessCard">
          <strong>{copy.business}</strong>
          <span>{copy.invoice}</span>
          <b>{copy.amount}</b>
        </div>
        <div className="entityCard walletCard">
          <strong>{copy.wallet}</strong>
          <span>{copy.signed}</span>
        </div>
        <div className="entityCard tempoCard">
          <strong>{copy.tempo}</strong>
          <span>{copy.fee}</span>
        </div>
        <div className="entityCard ledgerCard">
          <strong>{copy.ledger}</strong>
          <span>{copy.reconciled}</span>
        </div>
        <div className="rail railOne" />
        <div className="rail railTwo" />
        <div className="rail railThree" />
        <div className="memoChip">{copy.memo}</div>
        <div className="movingTx">T</div>
      </div>

      <div className="flowSteps" aria-label={copy.title}>
        {copy.stages.map((label, index) => (
          <div className="flowStep" key={label}>
            <span>{index + 1}</span>
            {label}
          </div>
        ))}
      </div>

      <p className="stageCopy">{copy.flowNote}</p>
    </div>
  )
}
