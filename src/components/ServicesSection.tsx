function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6" aria-hidden="true">
      <path d="M8 5 3 12l5 7M16 5l5 7-5 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DeviceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6" aria-hidden="true">
      <rect x="3" y="4" width="13" height="11" rx="2" />
      <path d="M8 19h8m-4-4v4M19 8h2v9h-4" strokeLinecap="round" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6" aria-hidden="true">
      <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6.3 6.3l2.8 2.8m5.8 5.8 2.8 2.8m0-11.4-2.8 2.8m-5.8 5.8-2.8 2.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

const services = [
  {
    icon: <CodeIcon />,
    title: 'Web Development',
    description: 'Fast, accessible interfaces with clean data flows and a design system that stays consistent.',
  },
  {
    icon: <DeviceIcon />,
    title: 'Data Pipelines',
    description: 'Scheduled scrapers and extraction with clean output schemas and cost guards.',
  },
  {
    icon: <SparkIcon />,
    title: 'AI Automation',
    description: 'Workers and agents that run on schedule, with guardrails and a human in the loop.',
  },
]

const stack = ['Python', 'TypeScript', 'React', 'Node.js', 'Next.js', 'FastAPI', 'PostgreSQL', 'AWS', 'Ollama', 'Apify', 'Tailwind CSS', 'systemd']

function MarqueeGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="marquee-group" aria-hidden={hidden}>
      {stack.map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section id="services" className="border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="marquee py-8">
          <div className="marquee-track">
            <MarqueeGroup />
            <MarqueeGroup hidden />
          </div>
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/70">
          02 — What I Do
        </p>
        <h2 className="mt-4 max-w-[18ch] text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
          Three ways I can help.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="reveal-on-scroll rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:border-cyan-300/25"
            >
              <div className="text-cyan-300">{service.icon}</div>
              <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
