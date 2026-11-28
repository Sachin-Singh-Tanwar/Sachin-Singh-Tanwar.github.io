import { useEffect, useRef, useState } from 'react'
import { EMAIL, copyEmail, requestReshatter } from '../lib/siteActions'
import { fracturePaths } from '../lib/fracturePaths'

export default function ContactSection() {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef(0)

  useEffect(() => {
    const sync = () => {
      setCopied(true)
      window.clearTimeout(resetTimer.current)
      resetTimer.current = window.setTimeout(() => setCopied(false), 1600)
    }
    window.addEventListener('site:email-copied', sync)
    return () => {
      window.removeEventListener('site:email-copied', sync)
      window.clearTimeout(resetTimer.current)
    }
  }, [])

  const handleCopy = async () => {
    await copyEmail()
  }

  return (
    <section id="contact" className="section contact-section" data-scroll-progress data-scroll-section>
      <div
        className="contact-panel contact-console"
        data-reveal
        data-scroll-progress
        data-scroll-detail
        data-scroll-offset="0.08"
      >
        <svg className="contact-kintsugi" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          {fracturePaths.map((d) => (
            <path key={d} pathLength="100" d={d} />
          ))}
        </svg>

        <p className="section-index section-index-light">03 / Contact</p>
        <h2>Let’s make the next build count.</h2>
        <p className="contact-copy">
          Tell me what you need built. I’ll look at the scope and reply with a clear next step.
        </p>
        <div className="contact-actions">
          <a href={`mailto:${EMAIL}`} className="button button-light">
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            className="copy-email"
            data-copied={copied}
            onClick={() => void handleCopy()}
          >
            <span>{copied ? 'Copied to clipboard' : 'Copy email'}</span>
            <i aria-hidden="true" />
            <span className="copy-spark copy-spark--one" aria-hidden="true" />
            <span className="copy-spark copy-spark--two" aria-hidden="true" />
          </button>
        </div>
        <p className="contact-email" aria-hidden="true">{EMAIL}</p>
        <div className="copy-toast" role="status" aria-live="polite" data-visible={copied}>
          Copied to clipboard
        </div>
      </div>

      <footer
        className="site-footer kintsugi-footer"
        data-scroll-progress
        data-scroll-detail
        data-scroll-offset="0.16"
      >
        <span>© 2026 Sachin Singh Tanwar</span>
        <div
          data-scroll-progress
          data-scroll-detail
          data-scroll-offset="0.22"
        >
          <a href="https://github.com/Sachin-Singh-Tanwar" target="_blank" rel="noreferrer">GitHub</a>
          <a href="/proof/">Proof</a>
          <a href="https://www.linkedin.com/in/sachin-singh-tanwar-5582582b4" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`mailto:${EMAIL}`}>Email</a>
        </div>
        <button type="button" className="reshatter-trigger" onClick={requestReshatter}>
          <span aria-hidden="true">◆</span> [ RE-SHATTER SYSTEM ]
        </button>
      </footer>
    </section>
  )
}
