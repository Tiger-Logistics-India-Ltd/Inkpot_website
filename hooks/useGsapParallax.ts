'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useGsapParallax(speed: number = 0.4) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const layer = layerRef.current
    if (!wrapper || !layer) return

    function tick() {
      if (!wrapper || !layer) return
      const rect = wrapper.getBoundingClientRect()
      const vh = window.innerHeight

      if (rect.bottom < -100 || rect.top > vh + 100) return

      // Distance of element center from viewport center.
      // Negative = element above center, positive = below.
      const centerOffset = rect.top + rect.height / 2 - vh / 2
      const targetY = (centerOffset / vh) * vh * 0.12 * speed

      tweenRef.current?.kill()
      tweenRef.current = gsap.to(layer, {
        y: targetY,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    window.addEventListener('scroll', tick, { passive: true })
    tick()

    return () => {
      window.removeEventListener('scroll', tick)
      tweenRef.current?.kill()
    }
  }, [speed])

  return { wrapperRef, layerRef }
}
