'use client'

import React, { useEffect, useRef, useState } from 'react'

export function StarsBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ThreeStars, setThreeStars] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    import('./three-stars').then((module) => {
      setThreeStars(() => module.default)
    })
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none">
      {ThreeStars && <ThreeStars containerRef={containerRef} />}
    </div>
  )
}

