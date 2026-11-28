import { useCallback, useEffect, useState } from 'react'

const prefix = '#work/'

function readHash(): string | null {
  const hash = window.location.hash
  if (!hash.startsWith(prefix)) return null
  const id = decodeURIComponent(hash.slice(prefix.length))
  return id || null
}

export function useProjectRoute(validIds: readonly string[]) {
  const [detailId, setDetailId] = useState<string | null>(() => readHash())

  useEffect(() => {
    const sync = () => {
      const next = readHash()
      setDetailId(next && validIds.includes(next) ? next : null)
    }
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [validIds])

  const openProject = useCallback((id: string) => {
    window.history.pushState({ project: id }, '', `${prefix}${encodeURIComponent(id)}`)
    setDetailId(id)
  }, [])

  const closeProject = useCallback(() => {
    window.history.pushState({}, '', '#work')
    setDetailId(null)
  }, [])

  return { detailId, openProject, closeProject }
}
