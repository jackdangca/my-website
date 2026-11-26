/* Custom architecture diagrams used instead of stock project thumbnails.
   Every project gets a drawing of the system it describes — more useful to a
   technical reader and far more distinctive than a generic photo.
   All colours come from design tokens, so both themes stay legible. */

function Node({ x, y, w = 130, h = 46, label, sub, accent = false }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" className={accent ? 'pv-node pv-node--accent' : 'pv-node'} />
      <text x={x + 12} y={sub ? y + 20 : y + h / 2 + 4} className="pv-label--strong">{label}</text>
      {sub && <text x={x + 12} y={y + 35} className="pv-label">{sub}</text>}
    </g>
  )
}

function Dot({ x, y, r = 2.8 }) {
  return <circle cx={x} cy={y} r={r} className="pv-dot" />
}

function AgentDiagram() {
  return (
    <g>
      {/* replan loop */}
      <path d="M272 112 Q320 74 368 112" className="pv-line pv-line--dash pv-line--accent" />
      <path d="m362 104 6 8-9 3" className="pv-line pv-line--accent" />
      <text x="320" y="70" textAnchor="middle" className="pv-label--accent">REPLAN / EVALUATE</text>

      <path d="M250 186 178 116M250 200 178 200M250 214 178 286" className="pv-line" />
      <path d="M390 186 462 116M390 200 462 200M390 214 462 286" className="pv-line pv-line--accent" />
      <Dot x={178} y={116} /><Dot x={178} y={200} /><Dot x={178} y={286} />
      <Dot x={462} y={116} /><Dot x={462} y={200} /><Dot x={462} y={286} />

      <Node x={48} y={90} label="Planner" sub="PLAN / DECOMPOSE" />
      <Node x={48} y={177} label="Memory" sub="PGVECTOR STORE" />
      <Node x={48} y={263} label="Checkpoints" sub="DURABLE STATE" />

      <Node x={462} y={90} label="Tool registry" sub="TYPED + SCOPED" />
      <Node x={462} y={177} label="LLM gateway" sub="RETRY / BUDGET" />
      <Node x={462} y={263} label="Policy gate" sub="HUMAN APPROVAL" />

      <rect x="248" y="168" width="144" height="64" rx="9" className="pv-node pv-node--accent" />
      <text x="320" y="194" textAnchor="middle" className="pv-label--strong">Agent runtime</text>
      <text x="320" y="213" textAnchor="middle" className="pv-label">DURABLE EXECUTION</text>

      <text x="48" y="330" className="pv-label">TRACE REPLAY · OTel SPANS · EVAL HARNESS</text>
    </g>
  )
}

function CommerceDiagram() {
  return (
    <g>
      <path d="M320 128v26M160 200v24M320 200v24M480 200v24M160 270v22M320 270v22M480 270v22" className="pv-line pv-line--accent" />
      <path d="M160 154v22M320 154v22M480 154v22" className="pv-line" />
      <path d="M90 154h480" className="pv-line pv-line--dash" />

      <text x="90" y="82" className="pv-label">CLIENT → EDGE → CORE → DATA</text>

      <rect x="90" y="90" width="460" height="38" rx="7" className="pv-node pv-node--accent" />
      <text x="320" y="114" textAnchor="middle" className="pv-label--strong">CDN / edge cache</text>

      <Node x={90} y={176} w={140} h={48} label="Storefront" sub="REACT + TS" />
      <Node x={250} y={176} w={140} h={48} label="API gateway" sub="TYPED CONTRACTS" />
      <Node x={410} y={176} w={140} h={48} label="Catalog" sub="READ PROJECTION" />

      <Node x={90} y={246} w={140} h={48} label="Checkout FSM" sub="IDEMPOTENT" />
      <Node x={250} y={246} w={140} h={48} label="Order service" sub="STATE MACHINE" />
      <Node x={410} y={246} w={140} h={48} label="Payments" sub="STRIPE WEBHOOKS" />

      <rect x="90" y="300" width="460" height="32" rx="7" className="pv-node" />
      <text x="320" y="321" textAnchor="middle" className="pv-label">POSTGRESQL · REDIS · ELASTICSEARCH</text>
    </g>
  )
}

function MeshDiagram() {
  return (
    <g>
      <rect x="36" y="76" width="568" height="252" rx="14" className="pv-line pv-line--dash" />
      <text x="52" y="70" className="pv-label">KUBERNETES · HELM · HPA</text>

      <path d="M135 148 268 182M320 148v30M505 148 372 182M135 258 268 224M320 258v-26M505 258 372 224" className="pv-line pv-line--accent pv-line--dash" />
      <Dot x={135} y={148} /><Dot x={320} y={148} /><Dot x={505} y={148} />
      <Dot x={135} y={258} /><Dot x={320} y={258} /><Dot x={505} y={258} />

      <Node x={70} y={108} w={130} h={40} label="Catalog" />
      <Node x={255} y={108} w={130} h={40} label="Cart" />
      <Node x={440} y={108} w={130} h={40} label="Ordering" />
      <Node x={70} y={258} w={130} h={40} label="Inventory" />
      <Node x={255} y={258} w={130} h={40} label="Payment" />
      <Node x={440} y={258} w={130} h={40} label="Fulfilment" />

      <rect x="248" y="178" width="144" height="50" rx="9" className="pv-node pv-node--accent" />
      <text x="320" y="199" textAnchor="middle" className="pv-label--strong">Kafka bus</text>
      <text x="320" y="216" textAnchor="middle" className="pv-label">EVENTS · SAGA</text>
    </g>
  )
}

function SignalDiagram() {
  const points = [
    [70, 246], [116, 238], [162, 252], [208, 230], [254, 240],
    [300, 216], [346, 228], [392, 168], [438, 200], [484, 190],
    [530, 210], [570, 196],
  ]
  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `M70,290 L${points.map(([x, y]) => `${x},${y}`).join(' L')} L570,290 Z`

  return (
    <g>
      {[130, 170, 210, 250, 290].map((y) => (
        <path key={y} d={`M70 ${y}H570`} className="pv-cross" />
      ))}
      {[70, 170, 270, 370, 470, 570].map((x) => (
        <path key={x} d={`M${x} 120V290`} className="pv-cross" />
      ))}

      <text x="70" y="104" className="pv-label">P99 LATENCY · 30 DAY WINDOW</text>
      <path d="M70 170H570" className="pv-line pv-line--dash pv-line--accent" />
      <text x="574" y="173" className="pv-label--accent">SLO</text>

      <path d={area} className="pv-bar" />
      <polyline points={line} className="pv-line pv-line--accent" />
      {points.map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.4" className="pv-dot" />)}

      <path d="M392 120V290" className="pv-line pv-line--dash" />
      <text x="398" y="136" className="pv-label--accent">DEPLOY MARKER</text>
      <circle cx="392" cy="168" r="5" className="pv-node--accent" />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={70 + i * 88} y={310 - i * 3} width="52" height={6 + i * 3} rx="2" className={i === 3 ? 'pv-bar pv-bar--strong' : 'pv-bar'} />
      ))}
      <text x="70" y="334" className="pv-label">ERROR BUDGET BURN · WEEKLY</text>
    </g>
  )
}

const diagrams = {
  agent: AgentDiagram,
  commerce: CommerceDiagram,
  mesh: MeshDiagram,
  signal: SignalDiagram,
}

export default function ProjectVisual({ variant = 'mesh', hue, index, label, image, alt }) {
  const Diagram = diagrams[variant] || MeshDiagram
  return (
    <div className="project-visual" style={{ '--pv-accent': hue || 'var(--accent)' }}>
      {label && <span className="project-visual__tag">{label}</span>}
      {image ? (
        <img className="project-visual__img" src={image} alt={alt || ''} loading="lazy" />
      ) : (
        <>
          <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
            <Diagram />
          </svg>
          <span className="project-visual__scan" aria-hidden="true" />
          <span className="project-visual__live" aria-hidden="true">
            <span className="status-dot" /> LIVE TOPOLOGY
          </span>
        </>
      )}
      {index && <span className="project-visual__index">{index}</span>}
    </div>
  )
}
