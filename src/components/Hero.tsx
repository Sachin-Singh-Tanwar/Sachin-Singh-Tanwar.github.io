import { useRef } from 'react'
import { usePointerTilt } from '../lib/usePointerTilt'

const badges = [
  { label: 'Power BI · Python', href: '#work/retailnova', className: 'badge--one' },
  { label: 'TypeScript · JSON', href: '#work/sentinel', className: 'badge--two' },
  { label: 'Django REST', href: '#work/phishing-detector', className: 'badge--three' },
  { label: 'MySQL · Pandas', href: '#work/retailnova', className: 'badge--four' },
]

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  usePointerTilt(heroRef)

  return (
    <section
      ref={heroRef}
      id="top"
      className="hero hero-optical"
      data-scroll-progress
      data-scroll-mode="exit"
      data-scroll-section
    >
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Web products · dashboards · workflow systems</p>

          <h1 className="hero-title">
            <span className="title-line">
              <span>Builds that <em>look sharp.</em></span>
            </span>
            <span className="title-line">
              <span>Work that <em>holds up</em> in use.</span>
            </span>
          </h1>

          <p className="hero-lede">
            I design and ship interfaces, data views and connected systems for teams that need clean delivery —
            from the first screen to the last API call.
          </p>

          <div className="hero-actions">
            <a href="#work" className="button button-primary">
              See selected work <span aria-hidden="true">↗</span>
            </a>
            <a href="#contact" className="button button-quiet">
              Start a project <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="hero-meta" aria-label="Core technologies">
            <span>React</span>
            <span>TypeScript</span>
            <span>Python</span>
            <span>SQL</span>
          </div>
        </div>

        <div className="hero-visual hero-optical-visual" data-reveal>
          <div className="optical-stage" data-tilt>
            <span className="stage-plane stage-plane--back" aria-hidden="true" />
            <span className="stage-plane stage-plane--mid" aria-hidden="true" />
            <span className="stage-recess" aria-hidden="true" />

            <a
              href="#work/retailnova"
              className="device-laptop optical-laptop"
              aria-label="Open RetailNova Analytics project"
            >
              <span className="device-lid">
                <span className="device-screen">
                  <img
                    src="/thumbnails/retailnova-dashboard-1.webp"
                    alt="RetailNova Power BI dashboard with sales and returns views"
                    width="1280"
                    height="720"
                    fetchPriority="high"
                    decoding="async"
                    sizes="(max-width: 700px) 92vw, 46vw"
                  />
                  <span className="screen-glare" aria-hidden="true" />
                </span>
              </span>
              <span className="device-base" aria-hidden="true" />
              <span className="capture-tag">Real dashboard capture</span>
            </a>

            <div className="device-phone optical-phone">
              <span className="phone-notch" aria-hidden="true" />
              <div className="phone-content">
                <span className="phone-index">01 / 03</span>
                <strong>RetailNova<br />Analytics</strong>
                <span className="phone-rule" aria-hidden="true" />
                <span className="phone-meta">Analytics product</span>
                <span className="phone-meta">Power BI · Python</span>
                <a href="#work/retailnova" className="phone-link">
                  Open case <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div
              className="exploded-layers"
              aria-hidden="true"
              data-scroll-progress
              data-scroll-offset="0.18"
            >
              <span className="exploded-layer layer--canvas">Canvas</span>
              <span className="exploded-layer layer--data">Data cards</span>
              <span className="exploded-layer layer--nav">Nav</span>
            </div>

            <div className="orbit-badges" aria-label="Project technologies">
              {badges.map((badge) => (
                <a
                  key={badge.label}
                  href={badge.href}
                  className={`orbit-badge ${badge.className}`}
                  aria-label={`${badge.label} — open project`}
                >
                  <span>{badge.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div
            className="feature-float"
            aria-hidden="true"
            data-scroll-progress
            data-scroll-detail
            data-scroll-offset="0.18"
          >
            <span>Use</span>
            <span>Delivery</span>
            <span>Performance</span>
          </div>
        </div>
      </div>

      <div
        className="scroll-cue scroll-cue-tactile"
        aria-hidden="true"
        data-scroll-progress
        data-scroll-detail
        data-scroll-offset="0.24"
      >
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}
