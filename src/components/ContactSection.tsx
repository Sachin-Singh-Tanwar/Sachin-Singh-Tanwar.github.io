const links = [
  { label: 'sachin.singh.tanwar325@gmail.com', href: 'mailto:sachin.singh.tanwar325@gmail.com', primary: true },
  {
    label: 'GitHub',
    href: 'https://github.com/Sachin-Singh-Tanwar',
    primary: false,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sachin-singh-tanwar-5582582b4',
    primary: false,
  },
]

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="border-t border-white/5 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300/80">
          03 — Contact
        </p>
        <h2 className="gradient-text mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Let&apos;s build something.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/60">
          If you need systems that keep working after the laptop is off, send a note.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.label === 'Email' ? {} : { target: '_blank', rel: 'noreferrer' })}
              className={`break-all rounded-full px-7 py-3 text-sm font-semibold transition ${
                link.primary
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'border border-white/20 text-white hover:border-cyan-300/60 hover:text-cyan-200'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <footer className="mx-auto mt-24 max-w-7xl border-t border-white/5 pt-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
        © 2026 Sachin Singh Tanwar
      </footer>
    </section>
  )
}
