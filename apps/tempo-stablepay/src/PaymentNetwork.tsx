const networkNodes = [
  { label: 'Invoice', x: '13%', y: '52%', delay: '0s' },
  { label: 'Wallet', x: '31%', y: '30%', delay: '0.25s' },
  { label: 'TIP-20', x: '48%', y: '57%', delay: '0.5s' },
  { label: 'Fee token', x: '66%', y: '35%', delay: '0.75s' },
  { label: 'Memo event', x: '83%', y: '55%', delay: '1s' },
]

const rails = [
  { width: '22%', left: '16%', top: '44%', rotate: '-16deg', delay: '0s' },
  { width: '23%', left: '34%', top: '45%', rotate: '17deg', delay: '0.4s' },
  { width: '24%', left: '51%', top: '46%', rotate: '-14deg', delay: '0.8s' },
  { width: '23%', left: '67%', top: '45%', rotate: '13deg', delay: '1.2s' },
]

export function PaymentNetwork() {
  return (
    <div className="paymentNetwork" aria-hidden="true">
      <div className="networkBackdrop" />
      {rails.map((rail) => (
        <span
          className="networkRail"
          key={`${rail.left}-${rail.top}`}
          style={{
            animationDelay: rail.delay,
            left: rail.left,
            top: rail.top,
            transform: `rotate(${rail.rotate})`,
            width: rail.width,
          }}
        />
      ))}
      {networkNodes.map((node) => (
        <span
          className="networkNode"
          key={node.label}
          style={{
            animationDelay: node.delay,
            left: node.x,
            top: node.y,
          }}
        >
          <span className="nodePulse" />
          <span className="nodeLabel">{node.label}</span>
        </span>
      ))}
      <span className="networkPacket packetOne" />
      <span className="networkPacket packetTwo" />
    </div>
  )
}
