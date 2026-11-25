import CommandPalette from './components/CommandPalette'
import ContactSection from './components/ContactSection'
import Hero from './components/Hero'
import MagneticCursor from './components/MagneticCursor'
import ProjectsSection from './components/ProjectsSection'
import ServicesSection from './components/ServicesSection'

export default function App() {
  return (
    <div className="relative min-h-screen text-white">
      <div className="page-backdrop" aria-hidden="true" />
      <CommandPalette />
      <MagneticCursor />
      <main className="relative z-10">
        <Hero />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
      </main>
    </div>
  )
}
