import CommandPalette from './components/CommandPalette'
import ContactSection from './components/ContactSection'
import Hero from './components/Hero'
import MagneticCursor from './components/MagneticCursor'
import ProofModules from './components/ProofModules'
import ProjectsSection from './components/ProjectsSection'
import ServicesSection from './components/ServicesSection'

export default function App() {
  return (
    <div className="relative min-h-screen text-white">
      <div className="page-backdrop" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <header
        data-primary-nav
        className="sticky top-0 z-50 h-14 border-b border-white/[0.08] bg-[rgba(8,8,6,0.72)] backdrop-blur"
      >
        <nav
          className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 md:px-8"
          aria-label="Primary"
        >
          <a href="#hero" className="font-mono text-[13px] tracking-[0.2em] text-white/90">
            SST
          </a>
          <div className="flex items-center gap-6">
            <a
              href="#evidence"
              className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 transition hover:text-white md:inline"
            >
              Proof
            </a>
            <a
              href="#projects"
              className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 transition hover:text-white md:inline"
            >
              Work
            </a>
            <a
              href="#services"
              className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 transition hover:text-white md:inline"
            >
              Services
            </a>
            <a
              href="#contact"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
            >
              Contact
            </a>
            <span className="ml-2 hidden font-mono text-[10px] text-white/30 md:inline" aria-hidden="true">
              ⌘K
            </span>
          </div>
        </nav>
      </header>
      <CommandPalette />
      <MagneticCursor />
      <main className="relative">
        <Hero />
        <ProjectsSection />
        <ProofModules />
        <ServicesSection />
        <ContactSection />
      </main>
    </div>
  )
}
