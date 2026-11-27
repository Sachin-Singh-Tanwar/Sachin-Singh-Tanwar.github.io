type Props = {
  index: number
  category: string
  capture?: string | null
  stage?: string
  className?: string
}

export default function ProjectCover({ index, category, capture, stage, className }: Props) {
  const number = String(index + 1).padStart(2, '0')
  const label = category.toUpperCase()
  const captureDate = capture?.match(/(\d{4}-\d{2}-\d{2})\.webp$/)?.[1]

  if (capture) {
    return (
      <img
        data-project-cover="image"
        src={capture}
        alt={`${label.toLowerCase()} capture, verified ${captureDate ?? 'date unavailable'} ${number}`}
        className={className ?? 'absolute inset-0 h-full w-full object-cover'}
        loading="lazy"
      />
    )
  }

  return (
    <div
      data-project-cover="none"
      role="img"
      aria-label={`${label} project ${number}. No verified capture available. ${stage ?? 'Stage unavailable'}.`}
      className={
        className ??
        'absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#08080a] px-6 text-center'
      }
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
        {number} / {label}
      </span>
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
        NO CAPTURE
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
        {stage ?? 'VERIFIED PROOF ONLY'}
      </span>
    </div>
  )
}
