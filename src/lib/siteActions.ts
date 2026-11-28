import { isAudioEnabled, playCopyChord, playTick, setAudioEnabled } from './audioBus'
import { scrollToSection } from './useSmoothScroll'

export const EMAIL = 'sachin.singh.tanwar325@gmail.com'

export function requestReshatter(): void {
  window.dispatchEvent(new Event('site:reshatter'))
}

export function toggleAudio(): boolean {
  const next = !isAudioEnabled()
  setAudioEnabled(next)
  if (next) playTick()
  return next
}

export async function copyEmail(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(EMAIL)
    playCopyChord()
    window.dispatchEvent(new Event('site:email-copied'))
    return true
  } catch {
    return false
  }
}

export function jumpTo(id: string): void {
  scrollToSection(id)
}
