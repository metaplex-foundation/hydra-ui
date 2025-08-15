import * as React from 'react'

interface ScrollSpyOptions {
  ids: string[]
  rootMargin?: string
  threshold?: number | number[]
}

export function useScrollSpy({ ids, rootMargin = '0px 0px -60% 0px', threshold = [0.25, 0.5, 0.75] }: ScrollSpyOptions) {
  const [active, setActive] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!ids.length) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible.length > 0) {
        const top = visible[0]!.target as HTMLElement
        const id = top.getAttribute('id')
        if (id && id !== active) setActive(id)
      }
    }, { root: null, rootMargin, threshold })
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    elements.forEach(el => observer.observe(el))
    return () => { elements.forEach(el => observer.unobserve(el)); observer.disconnect() }
  }, [ids.join(','), rootMargin]) // eslint-disable-line react-hooks/exhaustive-deps
  return active
}
