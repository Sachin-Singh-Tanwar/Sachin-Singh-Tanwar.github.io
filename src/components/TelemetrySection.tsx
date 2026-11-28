import { useEffect, useState } from 'react'

const queries = [
  { id: 'source', label: 'By source', code: 'SELECT source_state FROM public_board' },
  { id: 'delivery', label: 'By delivery', code: 'SELECT delivery_stage FROM run_history' },
  { id: 'validation', label: 'By validation', code: 'SELECT validation_state FROM checks' },
]

function istClock(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

export default function TelemetrySection() {
  const [clock, setClock] = useState(istClock)
  const [query, setQuery] = useState(queries[0])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(istClock()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section
      id="telemetry"
      className="section telemetry-section"
      data-scroll-progress
      data-scroll-section
    >
      <div
        className="telemetry-strip"
        data-reveal
        data-scroll-progress
        data-scroll-detail
        data-scroll-offset="0.08"
      >
        <div className="telemetry-clock">
          <span className="live-dot" aria-hidden="true" />
          <span>Local time · IST</span>
          <strong>{clock}</strong>
        </div>

        <div className="telemetry-labels" aria-label="Delivery states">
          <span>Frontend</span>
          <span>API core</span>
          <span>Data engine</span>
          <span>Validation</span>
        </div>

        <div className="telemetry-query">
          <p>Query lens · STAGED DEMO</p>
          <div className="query-pills" role="group" aria-label="Preset query filters">
            {queries.map((item) => (
              <button
                key={item.id}
                type="button"
                data-active={query.id === item.id}
                aria-pressed={query.id === item.id}
                onClick={() => setQuery(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <code>{query.code}</code>
        </div>
      </div>
    </section>
  )
}
