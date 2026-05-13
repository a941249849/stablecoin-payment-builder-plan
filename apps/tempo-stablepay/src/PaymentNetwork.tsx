const flowSteps = [
  {
    label: '1',
    title: 'Invoice intent',
    body: 'Amount, recipient, selected stablecoin, and invoice ID become a payment instruction.',
    meta: 'Off-chain order',
  },
  {
    label: '2',
    title: 'Wallet signs',
    body: 'Tempo-compatible wallet signs one stablecoin-native transaction on Moderato.',
    meta: 'Tempo tx',
  },
  {
    label: '3',
    title: 'TIP-20 memo',
    body: 'transferWithMemo writes a bytes32 invoice reference into the token transfer.',
    meta: 'Payment metadata',
  },
  {
    label: '4',
    title: 'Fee path',
    body: 'Fee token or sponsorship is resolved by transaction, account, contract, or fallback rules.',
    meta: 'Stablecoin gas',
  },
  {
    label: '5',
    title: 'Reconciliation',
    body: 'TransferWithMemo logs are matched by token, recipient, and memo to close the invoice.',
    meta: 'Auto accounting',
  },
]

export function PaymentNetwork() {
  return (
    <div className="paymentNetwork">
      <div className="flowHeader">
        <span>Tempo payment path</span>
        <strong>Invoice to stablecoin tx to memo event to accounting</strong>
      </div>
      <div className="flowLane" aria-label="Tempo payment flow">
        {flowSteps.map((step, index) => (
          <div className="flowStep" key={step.title}>
            <div className="stepMarker">
              <span>{step.label}</span>
              {index < flowSteps.length - 1 ? <i /> : null}
            </div>
            <div>
              <p className="stepMeta">{step.meta}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flowSettlement">
        <span>payer wallet</span>
        <strong>Tempo Moderato</strong>
        <span>merchant ledger</span>
      </div>
      <span className="flowPulse pulseOne" />
      <span className="flowPulse pulseTwo" />
    </div>
  )
}
