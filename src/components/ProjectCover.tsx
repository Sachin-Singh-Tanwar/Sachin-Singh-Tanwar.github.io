import { useId } from 'react'

type Props = {
  index: number
  category: string
  capture?: string | null
  className?: string
}

export default function ProjectCover({ index, category, capture, className }: Props) {
  const seed = category.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + index * 37
  const hue = 180 + ((seed * 29) % 140)
  const hue2 = 250 + (seed % 80)
  const cx1 = 560 + (seed % 120)
  const cy1 = 90 + (seed % 80)
  const cx2 = 120 + (seed % 80)
  const cy2 = 380 + (seed % 100)
  const uid = 'pc' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const number = String(index + 1).padStart(2, '0')
  const label = category.toUpperCase()
  const captureDate = capture?.match(/(\d{4}-\d{2}-\d{2})\.webp$/)?.[1]

  if (capture) {
    return (
      <img
        data-project-cover="image"
        src={capture}
        alt={`${label.toLowerCase()} screenshot${captureDate ? ` captured ${captureDate}` : ''} ${number}`}
        className={className ?? 'absolute inset-0 h-full w-full object-cover'}
        loading="lazy"
      />
    )
  }

  return (
    <svg
      data-project-cover=""
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className={className ?? 'absolute inset-0 h-full w-full'}
      role="img"
      aria-label={`${label} project cover ${number}`}
    >
      <defs>
        <radialGradient id={`${uid}-g1`}>
          <stop offset="0%" stopColor={`hsl(${hue} 90% 60%)`} />
          <stop offset="100%" stopColor={`hsl(${hue} 90% 60%)`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-g2`}>
          <stop offset="0%" stopColor={`hsl(${hue2} 85% 62%)`} />
          <stop offset="100%" stopColor={`hsl(${hue2} 85% 62%)`} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="60" />
        </filter>
        <pattern id={`${uid}-grid`} width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
        <linearGradient id={`${uid}-accent`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`hsl(${hue} 90% 60%)`} />
          <stop offset="100%" stopColor={`hsl(${hue2} 85% 62%)`} />
        </linearGradient>
        <radialGradient id={`${uid}-vignette`} cx="50%" cy="45%" r="75%">
          <stop offset="42%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="#08080a" />
      <g filter={`url(#${uid}-blur)`}>
        <circle cx={cx1} cy={cy1} r="260" fill={`url(#${uid}-g1)`} opacity="0.22" />
        <circle cx={cx2} cy={cy2} r="240" fill={`url(#${uid}-g2)`} opacity="0.16" />
      </g>
      <rect width="800" height="500" fill={`url(#${uid}-grid)`} />
      <text x="44" y="452" fontFamily="ui-monospace, monospace" fontSize="190" fontWeight="700" fill="rgba(255,255,255,0.05)">
        {number}
      </text>
      <text x="44" y="56" fontFamily="monospace" fontSize="13" letterSpacing="4" fill="rgba(255,255,255,0.45)">
        {label}
      </text>
      <rect x="44" y="470" width="120" height="2" fill={`url(#${uid}-accent)`} />
      <rect width="800" height="500" fill={`url(#${uid}-vignette)`} />
    </svg>
  )
}
