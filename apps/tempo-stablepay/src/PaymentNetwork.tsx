import { Language } from './copy'

const content = {
  zh: {
    eyebrow: 'Tempo payment canvas',
    title: '从发票到链上 memo 对账',
    subtitle: '一笔稳定币发票经过钱包签名、Tempo 结算和 TransferWithMemo 事件后，回到商户账本。',
    stages: ['创建发票', '确认收款方', '链上付款', '自动对账'],
    business: '商户发票台',
    wallet: '付款钱包',
    tempo: 'Tempo',
    ledger: '商户账本',
    fee: '稳定币费用路径',
    memo: 'bytes32 memo',
    pending: '等待发起',
    signed: '授权通过',
    settled: '已结算',
    reconciled: '已对账',
    invoice: 'INV-TESTNET',
    amount: '测试稳定币',
    flowNote: '商户创建发票后，付款方用稳定币支付。Tempo 把发票编号写进链上 memo，应用再用事件监听自动更新付款状态。',
  },
  en: {
    eyebrow: 'Tempo payment canvas',
    title: 'From invoice to memo-based reconciliation',
    subtitle: 'A stablecoin invoice moves through wallet signing, Tempo settlement, and TransferWithMemo reconciliation back into the merchant ledger.',
    stages: ['Create invoice', 'Check recipient', 'Onchain payment', 'Auto reconcile'],
    business: 'Merchant invoice desk',
    wallet: 'Payer wallet',
    tempo: 'Tempo',
    ledger: 'Merchant ledger',
    fee: 'Stablecoin fee path',
    memo: 'bytes32 memo',
    pending: 'Ready',
    signed: 'Authorized',
    settled: 'Settled',
    reconciled: 'Reconciled',
    invoice: 'INV-TESTNET',
    amount: '4 test stablecoins',
    flowNote: 'A merchant creates an invoice, the payer sends stablecoins, Tempo carries the invoice reference in the onchain memo, and the app updates payment status from events.',
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
        <svg className="flowConnectors" viewBox="0 0 680 320" aria-hidden="true">
          <defs>
            <marker id="paymentArrow" markerHeight="8" markerWidth="8" orient="auto" refX="6" refY="4">
              <path d="M0 0 L8 4 L0 8 Z" />
            </marker>
          </defs>
          <path d="M172 160 C188 160 196 160 212 160" />
          <path d="M356 160 C384 160 354 132 368 132" />
          <path d="M512 132 C532 132 500 160 518 160" />
        </svg>
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
