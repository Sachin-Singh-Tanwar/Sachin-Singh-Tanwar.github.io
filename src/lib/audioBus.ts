type Listener = (enabled: boolean) => void

let enabled = true
let ctx: AudioContext | null = null
const listeners = new Set<Listener>()

function audio(): AudioContext | null {
  try {
    const Engine =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Engine) return null
    ctx ??= new Engine()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

export function isAudioEnabled(): boolean {
  return enabled
}

export function setAudioEnabled(next: boolean): void {
  enabled = next
  listeners.forEach((listener) => listener(enabled))
  window.dispatchEvent(new CustomEvent<boolean>('site:audio', { detail: enabled }))
}

export function subscribeAudio(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Short highpass click for palette and ticker navigation. No low frequencies. */
export function playTick(): void {
  if (!enabled) return
  const context = audio()
  if (!context) return
  try {
    const length = Math.max(1, Math.ceil(context.sampleRate * 0.035))
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i += 1) {
      const t = i / context.sampleRate
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 120)
    }
    const source = context.createBufferSource()
    source.buffer = buffer
    const filter = context.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 2600
    const gain = context.createGain()
    gain.gain.setValueAtTime(0.035, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.035)
    source.connect(filter).connect(gain).connect(context.destination)
    source.start()
    source.stop(context.currentTime + 0.035)
  } catch {
    // Sound never blocks an interaction.
  }
}

/** Short positive chord on copy success. Mid/high tones only; no sub-bass. */
export function playCopyChord(): void {
  if (!enabled) return
  const context = audio()
  if (!context) return
  try {
    const start = context.currentTime
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      const at = start + index * 0.045
      gain.gain.setValueAtTime(0.0001, at)
      gain.gain.exponentialRampToValueAtTime(0.018, at + 0.018)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.26)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(at)
      oscillator.stop(at + 0.28)
    })
  } catch {
    // Sound never blocks an interaction.
  }
}

/** User-triggered tone for the Lab synth pad. */
export function playTone(frequency: number, duration = 0.18): void {
  if (!enabled) return
  const context = audio()
  if (!context) return
  try {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + duration)
  } catch {
    // Sound never blocks an interaction.
  }
}
