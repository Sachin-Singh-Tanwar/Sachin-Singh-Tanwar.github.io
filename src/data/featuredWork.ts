export type WorkCategory = 'Data' | 'Web' | 'Tools'
export type Viewport = 'desktop' | 'tablet' | 'mobile'

export type FeaturedWork = {
  id: string
  no: string
  title: string
  category: WorkCategory
  type: string
  summary: string
  detail: string
  image?: string
  imageAlt?: string
  imageLabel?: string
  imageByViewport?: Partial<Record<Viewport, string>>
  imageLabelByViewport?: Partial<Record<Viewport, string>>
  imageAspectByViewport?: Partial<Record<Viewport, string>>
  diagram?: { from: string; to: string; result: string }
  tags: string[]
  href: string
  hrefLabel: string
}

export const featuredWork: FeaturedWork[] = [
  {
    id: 'retailnova',
    no: '01',
    title: 'RetailNova Analytics',
    category: 'Data',
    type: 'Analytics product',
    summary: 'One clear view for sales, returns and logistics.',
    detail:
      'MySQL and Python preparation paired with Power BI views for sales, returns and logistics. Built for daily use, not a one-off report.',
    image: '/thumbnails/retailnova-dashboard-1.webp',
    imageAlt: 'RetailNova Power BI dashboard with sales and returns views',
    imageLabel: 'DASHBOARD · REPOSITORY CAPTURE',
    imageLabelByViewport: {
      desktop: 'DASHBOARD · DESKTOP CAPTURE',
      tablet: 'DASHBOARD CAPTURE · NO TABLET VIEW',
      mobile: 'DASHBOARD CAPTURE · NO MOBILE VIEW',
    },
    tags: ['MySQL', 'Python', 'Pandas', 'Power BI'],
    href: 'https://github.com/Sachin-Singh-Tanwar/RetailNova-Enterprise-Analytics',
    hrefLabel: 'View project',
  },
  {
    id: 'sentinel',
    no: '02',
    title: 'Sentinel Board',
    category: 'Web',
    type: 'Monitoring product',
    summary: 'Source health and data drift in one public board.',
    detail:
      'A public board that keeps the latest source state, drift and run history readable at a glance. Designed for quick decisions during delivery.',
    image: '/thumbnails/sentinel-board-2026-11-27.webp',
    imageAlt: 'Sentinel public board captured at desktop, tablet and mobile widths',
    imageLabel: 'PUBLIC BOARD · 2026-11-27',
    imageByViewport: {
      desktop: '/thumbnails/sentinel-board-desktop-2026-11-28.webp',
      tablet: '/thumbnails/sentinel-board-tablet-2026-11-28.webp',
      mobile: '/thumbnails/sentinel-board-mobile-2026-11-28.webp',
    },
    imageLabelByViewport: {
      desktop: 'PUBLIC BOARD · DESKTOP CAPTURE',
      tablet: 'PUBLIC BOARD · TABLET CAPTURE',
      mobile: 'PUBLIC BOARD · MOBILE CAPTURE',
    },
    imageAspectByViewport: {
      desktop: '1440 / 900',
      tablet: '834 / 1112',
      mobile: '390 / 844',
    },
    tags: ['TypeScript', 'JSON', 'Playwright', 'Scheduling'],
    href: 'https://sachin-singh-tanwar.github.io/sentinel/',
    hrefLabel: 'Open board',
  },
  {
    id: 'phishing-detector',
    no: '03',
    title: 'Phishing Detector',
    category: 'Tools',
    type: 'Browser tool',
    summary: 'A quick verdict on the page in front of you.',
    detail:
      'A Chrome popup sends the active URL to a Django REST endpoint and returns a clear verdict. The public link opens the API demo; the service has no marketing page.',
    diagram: {
      from: 'Chrome popup',
      to: 'Django REST API',
      result: 'Clear verdict',
    },
    tags: ['Django', 'Django REST', 'JavaScript', 'Chrome API'],
    href: 'https://phishing-detector-nhel.onrender.com/api/https://google.com',
    hrefLabel: 'Open API demo',
  },
]

export const coreStack = [
  'React',
  'TypeScript',
  'Next.js',
  'Python',
  'FastAPI',
  'Django',
  'PostgreSQL',
  'MySQL',
  'Pandas',
  'Power BI',
  'Playwright',
  'Tailwind CSS',
]
