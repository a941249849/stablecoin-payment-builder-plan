import { useState } from 'react'
import { Language } from './copy'

const content = {
  zh: {
    eyebrow: 'Tempo payment canvas',
    title: '从发票到链上 memo 对账',
    subtitle: '点击步骤，观察一笔稳定币发票如何经过钱包签名、Tempo 结算和 TransferWithMemo 对账。',
    reset: '重置',
    stages: ['创建发票', '签名付款', 'Tempo 结算', '事件对账'],
    business: '商户发票台',
    wallet: '付款钱包',
    tempo: 'Tempo Moderato',
    ledger: '商户账本',
    fee: 'Fee token',
    memo: 'bytes32 memo',
    pending: '等待付款',
    signed: '已签名',
    settled: '已结算',
    reconciled: '已对账',
    invoice: 'INV-TESTNET',
    amount: '100 alphaUSD',
    copy: [
      '选择稳定币、金额和收款地址，生成本地发票。',
      '钱包签署 transferWithMemo，memo 绑定发票编号。',
      'Tempo 使用稳定币费用路径处理交易。',
      '监听 TransferWithMemo，将链上事件匹配回发票。',
    ],
  },
  en: {
    eyebrow: 'Tempo payment canvas',
    title: 'From invoice to memo-based reconciliation',
    subtitle: 'Click through the steps to see how a stablecoin invoice moves through wallet signing, Tempo settlement, and TransferWithMemo accounting.',
    reset: 'Reset',
    stages: ['Create invoice', 'Sign payment', 'Tempo settles', 'Reconcile event'],
    business: 'Merchant invoice desk',
    wallet: 'Payer wallet',
    tempo: 'Tempo Moderato',
    ledger: 'Merchant ledger',
    fee: 'Fee token',
    memo: 'bytes32 memo',
    pending: 'Waiting',
    signed: 'Signed',
    settled: 'Settled',
    reconciled: 'Reconciled',
    invoice: 'INV-TESTNET',
    amount: '100 alphaUSD',
    copy: [
      'Choose stablecoin, amount, and recipient to create a local invoice.',
      'Wallet signs transferWithMemo with the invoice reference in memo.',
      'Tempo processes the transaction through stablecoin fee rules.',
      'TransferWithMemo is matched back to the invoice for accounting.',
    ],
  },
} as const

export function PaymentNetwork({ language }: { language: Language }) {
  const [stage, setStage] = useState(0)
  const copy = content[language]

  return (
    <div className="paymentCanvas">
      <div className="canvasHeader">
        <div>
          <p>{copy.eyebrow}</p>
          <h3>{copy.title}</h3>
          <span>{copy.subtitle}</span>
        </div>
        <button type="button" className="canvasReset" onClick={() => setStage(0)}>
          {copy.reset}
        </button>
      </div>

      <div className={`canvasBoard stage${stage}`}>
        <div className="gridWash" />
        <div className="entityCard businessCard">
          <strong>{copy.business}</strong>
          <span>{copy.invoice}</span>
          <b>{copy.amount}</b>
        </div>
        <div className="entityCard walletCard">
          <strong>{copy.wallet}</strong>
          <span>{stage >= 1 ? copy.signed : copy.pending}</span>
        </div>
        <div className="entityCard tempoCard">
          <strong>{copy.tempo}</strong>
          <span>{stage >= 2 ? copy.settled : copy.fee}</span>
        </div>
        <div className="entityCard ledgerCard">
          <strong>{copy.ledger}</strong>
          <span>{stage >= 3 ? copy.reconciled : copy.pending}</span>
        </div>
        <div className="rail railOne" />
        <div className="rail railTwo" />
        <div className="rail railThree" />
        <div className="memoChip">{copy.memo}</div>
        <div className="movingTx">T</div>
      </div>

      <div className="stageControls">
        {copy.stages.map((label, index) => (
          <button
            type="button"
            className={index <= stage ? 'stageButton active' : 'stageButton'}
            key={label}
            onClick={() => setStage(index)}
          >
            <span>{index + 1}</span>
            {label}
          </button>
        ))}
      </div>

      <p className="stageCopy">{copy.copy[stage]}</p>
    </div>
  )
}
