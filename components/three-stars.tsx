'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface ThreeStarsProps {
  containerRef: React.RefObject<HTMLDivElement>
}

export default function ThreeStars({ containerRef }: ThreeStarsProps) {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const starsRef = useRef<THREE.Points | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    
    const currentContainer = containerRef.current
    
    // Scene setup
    sceneRef.current = new THREE.Scene()
    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    cameraRef.current.position.z = 1

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(rendererRef.current.domElement)

    // Create stars
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const colors = []

    for (let i = 0; i < 8000; i++) {
      vertices.push((Math.random() - 0.5) * 3)
      vertices.push((Math.random() - 0.5) * 3)
      vertices.push((Math.random() - 0.5) * 3)
      colors.push(1, 1, 1)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.003,
      vertexColors: true,
      transparent: true,
      sizeAttenuation: true,
      depthWrite: false,
    })

    starsRef.current = new THREE.Points(geometry, material)
    sceneRef.current.add(starsRef.current)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      if (starsRef.current) {
        starsRef.current.rotation.x += 0.0001
        starsRef.current.rotation.y += 0.00015
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    // Cleanup
    return () => {
      if (currentContainer && rendererRef.current) {
        currentContainer.removeChild(rendererRef.current.domElement)
      }
    }
  }, [containerRef])

  return null
}

