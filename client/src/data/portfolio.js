/* =============================================================================
   Curated portfolio content.

   This is the single source of truth for the public-facing presentation.
   All copy here is realistic SAMPLE content written to demonstrate the design —
   replace the name, contact details, metrics and history with your own before
   publishing. Live records from the Express/Mongo API are merged in at runtime
   by `useProjects()` / `useQualifications()` and appear after these entries.
   ============================================================================= */

export const profile = {
  name: 'Xiaoxing Dang',
  initials: 'XD',
  role: 'Senior Software Engineer',
  discipline: 'Distributed systems · Cloud-native · Applied AI',
  location: 'Toronto, ON, Canada',
  timezone: 'EST / UTC−5',
  email: 'hello@xiaoxingdang.dev',
  phone: '+1 (416) 555-0147',
  availability: 'Open to senior engineering roles & architecture consulting',
  resumePath: '/resume/Xiaoxing-Dang-Resume.pdf',
  headline: 'I build systems that hold up in production.',
  intro:
    'I design and ship software where reliability is a feature, not an afterthought — distributed services, event-driven platforms, and AI systems that do useful work instead of just demoing well.',
  bio: [
    'I am a senior software engineer with a decade of building production systems across commerce, platform infrastructure and applied AI. My work sits at the boundary between architecture and delivery: I care as much about the diagram as I do about the deployment pipeline, the on-call runbook and the p99 latency.',
    'Most of my recent work has been in cloud-native backends — decomposing monoliths into services that can be deployed independently, designing event contracts that survive schema changes, and making failure modes explicit rather than accidental. More recently I have been building agent runtimes: giving language models real tools, bounded permissions and observable execution.',
    'I like small, sharp teams, written design documents, and code that a new engineer can understand on their first day. When I am not shipping, I am usually writing architecture notes, mentoring, or tearing down a home lab Kubernetes cluster for the third time.',
  ],
  stats: [
    { value: '8+', label: 'Years shipping production software' },
    { value: '30+', label: 'Systems delivered end-to-end' },
    { value: '12', label: 'Services on the largest platform' },
    { value: '99.95%', label: 'SLO sustained across critical paths' },
  ],
  facts: [
    { label: 'Core stack', value: 'Java / Spring Boot, TypeScript / React, Go, Python' },
    { label: 'Infrastructure', value: 'Kubernetes, Docker, Terraform, Azure, GitHub Actions' },
    { label: 'Data & messaging', value: 'PostgreSQL, Redis, Kafka, Elasticsearch' },
    { label: 'How I work', value: 'Design docs, trunk-based development, measurable SLOs' },
  ],
  socials: [
    { label: 'GitHub', icon: 'github', href: 'https://github.com/' },
    { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/' },
    { label: 'Email', icon: 'mail', href: 'mailto:hello@xiaoxingdang.dev' },
  ],
  stack: [
    'Java', 'Spring Boot', 'Spring Cloud', 'Kubernetes', 'Kafka', 'PostgreSQL',
    'TypeScript', 'React', 'Node.js', 'Python', 'Redis', 'Terraform',
    'Azure', 'gRPC', 'OpenTelemetry', 'LangGraph', 'Docker', 'Elasticsearch',
  ],
  practices: [
    'Event-driven design', 'Bounded contexts', 'Contract testing', 'Progressive delivery',
    'SLO & error budgets', 'Durable execution', 'Human-in-the-loop', 'Observability first',
    'Idempotency by default', 'Trunk-based development',
  ],
}

/* -----------------------------------------------------------------------------
   Featured case studies. `visual` selects a custom SVG architecture diagram,
   `hue` maps to a semantic category token in index.css.
   ----------------------------------------------------------------------------- */

export const projects = [
  {
    id: 'atlas-agent-studio',
    index: '01',
    title: 'Atlas Agent Studio',
    category: 'AI Agent Platform',
    year: '2025',
    role: 'Lead Engineer · Runtime & Architecture',
    wide: true,
    visual: 'agent',
    hue: 'var(--hue-ai)',
    tagline: 'A production runtime for autonomous, tool-using agents that survive real workloads.',
    description:
      'An orchestration platform where multi-agent workflows plan, call tools, and recover from failure — with bounded permissions, full trace replay and human approval gates.',
    challenge:
      'Most agent demos work once. In production they loop, hallucinate tool arguments, silently burn budget and become impossible to debug. The team needed a runtime where every decision is durable, replayable and observable, and where an agent can never take an action outside its granted scope.',
    approach: [
      'Designed a durable execution graph: each plan, tool call and observation is an append-only event, so any run can be resumed or replayed after a crash.',
      'Built a typed tool registry with JSON-schema validation, per-tool rate limits and scoped credentials — an agent can only reach the systems its policy explicitly names.',
      'Implemented a planner/executor split with a retry budget and cycle detection, cutting runaway loops without killing legitimate long-running research tasks.',
      'Added human-in-the-loop approval steps for side-effecting actions, plus a trace UI that reconstructs the full reasoning chain for audits.',
      'Shipped an evaluation harness that replays a golden set of tasks on every change and reports task success, cost and latency regressions.',
    ],
    architecture: [
      { label: 'Runtime', detail: 'Durable execution graph · checkpoint / resume' },
      { label: 'Planning', detail: 'Planner + executor split, cycle detection' },
      { label: 'Tools', detail: 'Typed registry, scoped credentials, rate limits' },
      { label: 'Memory', detail: 'pgvector retrieval + conversation checkpoints' },
      { label: 'Observability', detail: 'OpenTelemetry spans, trace replay, eval harness' },
    ],
    outcomes: [
      { value: '94%', label: 'Task completion on the internal evaluation suite' },
      { value: '−38%', label: 'Median cost per completed task' },
      { value: '100%', label: 'Side-effecting actions behind an approval gate' },
      { value: '<2s', label: 'Time to replay any historical run' },
    ],
    techStack: ['Python', 'FastAPI', 'LangGraph', 'PostgreSQL', 'pgvector', 'Redis', 'OpenTelemetry', 'React', 'Docker'],
    completionDate: '2025-09-15',
    image: null,
    alt: 'Architecture diagram of the Atlas Agent Studio orchestration runtime',
    links: [
      { label: 'Discuss this project', href: '/contact', kind: 'internal', icon: 'arrow-right' },
      { label: 'Source: private · available on request', kind: 'muted', icon: 'lock' },
    ],
  },
  {
    id: 'nova-commerce',
    index: '02',
    title: 'Nova Commerce',
    category: 'Full-Stack E-commerce',
    year: '2024',
    role: 'Full-Stack Lead',
    wide: false,
    visual: 'commerce',
    hue: 'var(--hue-commerce)',
    tagline: 'A headless storefront built for a catalogue that changes every hour.',
    description:
      'A complete commerce platform — storefront, checkout, catalog and back-office — with sub-second browsing, resilient payments and an admin surface merchandisers actually use.',
    challenge:
      'A growing retailer was running a coupled monolith where a merchandising bulk-upload could take checkout down, and every seasonal campaign meant a risky weekend deploy. The brief was a storefront that stayed fast under flash-sale traffic and let non-technical staff manage the catalogue without an engineer in the loop.',
    approach: [
      'Split reads and writes: a denormalised catalog projection served by Redis and Elasticsearch, with the transactional core kept in PostgreSQL.',
      'Built checkout as an idempotent state machine so retried payment webhooks, duplicate taps and network timeouts can never double-charge or double-ship.',
      'Implemented optimistic UI with server-driven cache invalidation, keeping catalogue edits visible to merchandisers in seconds without a full rebuild.',
      'Added a React-based back office with bulk editing, staged previews and an audit trail for every price or inventory change.',
      'Wired contract tests plus a load-test gate into CI so a regression in the p95 browse path blocks the release.',
    ],
    architecture: [
      { label: 'Client', detail: 'React + TypeScript, server-state caching' },
      { label: 'Edge', detail: 'CDN, rate limiting, cache tags' },
      { label: 'API', detail: 'Node.js / NestJS, REST + typed contracts' },
      { label: 'Data', detail: 'PostgreSQL, Redis, Elasticsearch' },
      { label: 'Integrations', detail: 'Stripe, tax, fulfilment webhooks' },
    ],
    outcomes: [
      { value: '280ms', label: 'p95 product page response under load' },
      { value: '3.2×', label: 'Flash-sale traffic handled vs. legacy' },
      { value: '0', label: 'Duplicate-charge incidents after idempotency' },
      { value: '−60%', label: 'Time to publish a merchandising campaign' },
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Stripe', 'Docker'],
    completionDate: '2024-11-20',
    image: null,
    alt: 'Layered architecture diagram of the Nova Commerce platform',
    links: [
      { label: 'Discuss this project', href: '/contact', kind: 'internal', icon: 'arrow-right' },
      { label: 'Source: private · available on request', kind: 'muted', icon: 'lock' },
    ],
  },
  {
    id: 'bluemart-platform',
    index: '03',
    title: 'BlueMart Platform',
    category: 'Cloud-Native Microservices',
    year: '2025',
    role: 'Platform Architect',
    wide: false,
    visual: 'mesh',
    hue: 'var(--hue-mesh)',
    tagline: 'An event-driven commerce backbone decomposed into independently deployable services.',
    description:
      'Twelve services on official Spring Boot / Spring Cloud, choreographed with Kafka, deployed to Kubernetes — with saga-based consistency, contract testing and full observability.',
    challenge:
      'A single deployable commerce backend had become the bottleneck: any team shipping a small change had to coordinate a release with everyone else, and a slow downstream inventory call could cascade into a site-wide outage. The goal was independent deployability without turning data consistency into guesswork.',
    approach: [
      'Mapped bounded contexts first — catalog, cart, ordering, inventory, payment, fulfilment, notification — and gave each its own datastore and deploy pipeline.',
      'Built on official Spring Boot and Spring Cloud (no vendor fork): config server, service discovery, Gateway, Resilience4j circuit breakers and timeouts.',
      'Designed Kafka event contracts with schema evolution rules and a saga orchestrator for the order flow, so a failed payment reliably compensates reserved inventory.',
      'Packaged every service with health probes, graceful shutdown and Helm charts for Kubernetes, with horizontal autoscaling driven by consumer lag.',
      'Standardised OpenTelemetry tracing, structured logs and RED dashboards, plus consumer-contract tests in CI to stop breaking event changes.',
    ],
    architecture: [
      { label: 'Edge', detail: 'Spring Cloud Gateway, JWT, rate limits' },
      { label: 'Services', detail: '12 Spring Boot services, own datastores' },
      { label: 'Events', detail: 'Kafka, schema registry, saga orchestration' },
      { label: 'Runtime', detail: 'Kubernetes, Helm, HPA on consumer lag' },
      { label: 'Telemetry', detail: 'OpenTelemetry, Prometheus, Grafana' },
    ],
    outcomes: [
      { value: '12', label: 'Independently deployable services' },
      { value: '6×', label: 'More frequent releases per team' },
      { value: '99.95%', label: 'Availability sustained over two quarters' },
      { value: '−71%', label: 'Mean time to recover from incidents' },
    ],
    techStack: ['Java 21', 'Spring Boot', 'Spring Cloud', 'Kafka', 'Kubernetes', 'Helm', 'PostgreSQL', 'OpenTelemetry', 'Grafana'],
    completionDate: '2025-06-30',
    image: null,
    alt: 'Service mesh and event backbone diagram of the BlueMart platform',
    links: [
      { label: 'Discuss this project', href: '/contact', kind: 'internal', icon: 'arrow-right' },
      { label: 'Source: private · available on request', kind: 'muted', icon: 'lock' },
    ],
  },
  {
    id: 'pulse-observability',
    index: '04',
    title: 'Pulse',
    category: 'Reliability Engineering',
    year: '2023',
    role: 'Tech Lead · Observability',
    wide: true,
    visual: 'signal',
    hue: 'var(--hue-signal)',
    tagline: 'Turning a wall of metrics into a short list of things worth waking up for.',
    description:
      'An SLO-driven observability layer that replaced noisy threshold alerts with error-budget signals, correlated traces and actionable incident timelines.',
    challenge:
      'The on-call rotation was receiving hundreds of alerts a week, most of them harmless. Engineers had learned to ignore pages, and real incidents were being found by customers. There was no shared definition of "healthy" and no way to connect a symptom to the deploy that caused it.',
    approach: [
      'Defined SLIs and error budgets with product owners for each critical journey, then derived a small set of burn-rate alerts from them.',
      'Instrumented services with OpenTelemetry and added deploy markers, so a latency shift can be correlated to a release in one click.',
      'Built an incident timeline that stitches together alerts, deploys, config changes and log anomalies into a single chronological view.',
      'Introduced automated weekly reliability reviews driven by error-budget consumption rather than raw alert counts.',
    ],
    architecture: [
      { label: 'Collect', detail: 'OpenTelemetry collector, structured logs' },
      { label: 'Store', detail: 'Prometheus, Loki, Tempo' },
      { label: 'Signal', detail: 'SLO burn-rate alerts, error budgets' },
      { label: 'Context', detail: 'Deploy markers, incident timelines' },
    ],
    outcomes: [
      { value: '−86%', label: 'Pages per on-call week' },
      { value: '4min', label: 'Median time to first useful signal' },
      { value: '100%', label: 'Critical journeys covered by an SLO' },
      { value: '0', label: 'Customer-reported Sev-1s in two quarters' },
    ],
    techStack: ['Go', 'OpenTelemetry', 'Prometheus', 'Grafana', 'Loki', 'Tempo', 'Kubernetes', 'Python'],
    completionDate: '2023-08-10',
    image: null,
    alt: 'Signal and error-budget chart representing the Pulse observability layer',
    links: [
      { label: 'Discuss this project', href: '/contact', kind: 'internal', icon: 'arrow-right' },
      { label: 'Source: private · available on request', kind: 'muted', icon: 'lock' },
    ],
  },
]

/* -----------------------------------------------------------------------------
   Capabilities (rendered on /services and previewed on the home page)
   ----------------------------------------------------------------------------- */

export const capabilities = [
  {
    id: 'distributed-systems',
    icon: 'network',
    title: 'Distributed Systems & Microservices',
    description:
      'Decompose a coupled backend into services teams can ship independently — without losing data consistency or operational clarity.',
    deliverables: ['Bounded-context mapping', 'Event & API contracts', 'Saga / compensation design', 'Strangler-fig migrations'],
  },
  {
    id: 'cloud-native',
    icon: 'cloud',
    title: 'Cloud-Native & Kubernetes',
    description:
      'Production-grade runtime on Kubernetes with infrastructure as code, safe rollouts and autoscaling driven by real signals.',
    deliverables: ['Helm & Kustomize packaging', 'Terraform modules', 'Progressive delivery', 'Cost & capacity tuning'],
  },
  {
    id: 'ai-agents',
    icon: 'spark',
    title: 'AI Agent Engineering',
    description:
      'Agent systems with typed tools, scoped permissions, durable execution and evaluation harnesses — built to be operated, not demoed.',
    deliverables: ['Orchestration runtimes', 'RAG & retrieval pipelines', 'Guardrails & approvals', 'Offline evaluation suites'],
  },
  {
    id: 'fullstack',
    icon: 'layers',
    title: 'Full-Stack Product Engineering',
    description:
      'From data model to interface: accessible React front ends backed by well-tested APIs, shipped through a pipeline that catches regressions.',
    deliverables: ['React / TypeScript UIs', 'Typed API layers', 'Checkout & payment flows', 'Design systems & component libraries'],
  },
  {
    id: 'data-streaming',
    icon: 'database',
    title: 'Event Streaming & Data',
    description:
      'Kafka-based event backbones, schema evolution and analytical projections that keep read paths fast as write volume grows.',
    deliverables: ['Kafka topology design', 'Schema governance', 'CQRS read models', 'PostgreSQL optimisation'],
  },
  {
    id: 'reliability',
    icon: 'gauge',
    title: 'Reliability & Performance',
    description:
      'SLOs, error budgets, tracing and load testing that turn "the site feels slow" into a measurable, fixable engineering problem.',
    deliverables: ['SLI / SLO definition', 'OpenTelemetry rollout', 'Load & soak testing', 'Incident review practice'],
  },
]

/* -----------------------------------------------------------------------------
   Interactive "decision lab" on the home page. Each scenario shows how a system
   is designed to fail — the interesting part of an engineer's portfolio.
   `bars` drives the before/after comparison chart (higher = worse).
   ----------------------------------------------------------------------------- */

export const scenarios = [
  {
    id: 'traffic',
    label: 'Traffic spike · 12×',
    tag: 'LOAD',
    signal: 'p95 latency crosses 800 ms; queue depth climbing on the order path.',
    failure: 'Synchronous checkout calls saturate the shared thread pool and cascade into catalog reads.',
    decision:
      'Shed load at the gateway, serve catalog from cached read projections, and put order creation behind a bounded queue with backpressure.',
    tradeoff:
      'A few seconds of eventual consistency on order confirmation, in exchange for keeping the browse path available.',
    bars: { before: 84, after: 22, beforeLabel: '800ms p95', afterLabel: '210ms p95' },
  },
  {
    id: 'timeout',
    label: 'Downstream timeout',
    tag: 'RESILIENCE',
    signal: 'Inventory service p99 drifts to 4 s; circuit breaker trips on two pods.',
    failure: 'Retries without jitter amplify the slowdown into a retry storm across the mesh.',
    decision:
      'Fail fast with a stale-but-valid inventory projection, exponential backoff with jitter, and a circuit breaker per dependency.',
    tradeoff: 'Occasionally showing conservative stock counts instead of taking the whole checkout down.',
    bars: { before: 92, after: 31, beforeLabel: 'retry storm', afterLabel: 'degraded read' },
  },
  {
    id: 'agent',
    label: 'Agent runs in circles',
    tag: 'AI RUNTIME',
    signal: 'A tool call repeats 14 times; token spend triples with no new observations.',
    failure: 'Unbounded planning loops and untyped tool arguments can trigger real side effects.',
    decision:
      'Durable execution graph with cycle detection, a hard retry budget, typed tool schemas and an approval gate on every side-effecting action.',
    tradeoff: 'Some long-running research tasks need an explicit budget increase rather than running unbounded.',
    bars: { before: 78, after: 18, beforeLabel: '14 loops', afterLabel: '2 loops' },
  },
  {
    id: 'schema',
    label: 'Breaking event schema',
    tag: 'EVOLUTION',
    signal: 'A producer ships a renamed field; consumer lag spikes on the orders topic.',
    failure: 'Twelve independently deployed services silently disagree about the shape of an event.',
    decision:
      'Schema registry with backward-compatibility checks in CI, versioned topics for breaking changes and consumer contract tests at the boundary.',
    tradeoff: 'Breaking changes need a short dual-write migration window instead of a single deploy.',
    bars: { before: 88, after: 26, beforeLabel: 'lag spike', afterLabel: 'gated change' },
  },
]

/* -----------------------------------------------------------------------------
   Sample career timeline. API qualifications are appended after these.
   ----------------------------------------------------------------------------- */

export const experience = [
  {
    period: '2022 — Present',
    title: 'Senior Software Engineer · Platform',
    org: 'Cloud-native commerce team',
    description:
      'Led the decomposition of a commerce monolith into twelve event-driven services. Owned service templates, deployment standards and the reliability programme; mentored four engineers and ran the architecture review forum.',
    tags: ['Spring Boot', 'Kafka', 'Kubernetes', 'OpenTelemetry'],
  },
  {
    period: '2020 — 2022',
    title: 'Software Engineer II · Full Stack',
    org: 'Product engineering',
    description:
      'Built and operated customer-facing commerce features end to end — catalogue, checkout and back-office tooling. Introduced contract testing and the first load-test gate in CI.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
  },
  {
    period: '2018 — 2020',
    title: 'Software Engineer',
    org: 'Application development',
    description:
      'Developed internal line-of-business applications and automation tooling, with a focus on relational data modelling and reducing manual operational work.',
    tags: ['Java', 'Python', 'SQL', 'Azure'],
  },
]

export const education = [
  {
    period: '2018',
    title: 'Advanced Diploma · Software Engineering Technology',
    org: 'Centennial College, Toronto',
    description:
      'Software design, distributed systems foundations, database systems and cloud infrastructure.',
    tags: ['Software Engineering'],
  },
  {
    period: 'Certifications',
    title: 'Azure Developer · Certified Kubernetes Administrator',
    org: 'Microsoft / CNCF',
    description: 'Cloud application development, container orchestration and cluster operations.',
    tags: ['AZ-204', 'CKA'],
  },
]

export const navigation = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Work', path: '/projects' },
  { label: 'Capabilities', path: '/services' },
  { label: 'Experience', path: '/education' },
  { label: 'Contact', path: '/contact' },
]
