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
        <div className="canvasFlow">
          <div className="entityCard">
            <strong>{copy.business}</strong>
            <span>{copy.invoice}</span>
            <b>{copy.amount}</b>
          </div>
          <div className="flowArrow" aria-hidden="true" />
          <div className="entityCard">
            <strong>{copy.wallet}</strong>
            <span>{copy.signed}</span>
          </div>
          <div className="flowArrow" aria-hidden="true" />
          <div className="entityCard tempoCard">
            <strong>{copy.tempo}</strong>
            <span>{copy.fee}</span>
          </div>
          <div className="flowArrow" aria-hidden="true" />
          <div className="entityCard">
            <strong>{copy.ledger}</strong>
            <span>{copy.reconciled}</span>
          </div>
        </div>
        <div className="flowTrack">
          <span>{copy.memo}</span>
          <i aria-hidden="true">T</i>
        </div>
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
