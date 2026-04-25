import { useEffect, useRef } from 'react'

export function useMarquee(speed: number) {
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const halfWidth = track.scrollWidth / 2

    function tick() {
      if (!pausedRef.current) {
        offsetRef.current += speed
        if (offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth
        }
        if (track) {
          track.style.transform = `translateX(-${offsetRef.current}px)`
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const section = track.parentElement
    const pause = () => { pausedRef.current = true }
    const resume = () => { pausedRef.current = false }
    section?.addEventListener('mouseenter', pause)
    section?.addEventListener('mouseleave', resume)

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      section?.removeEventListener('mouseenter', pause)
      section?.removeEventListener('mouseleave', resume)
    }
  }, [speed])

  return trackRef
}
