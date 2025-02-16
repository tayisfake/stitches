"use client"

import { useEffect, useRef } from "react"

export default function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const raindrops: Raindrop[] = []

    class Raindrop {
      x: number
      y: number
      speed: number
      length: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.speed = 5 + Math.random() * 5
        this.length = 10 + Math.random() * 20
      }

      fall() {
        this.y += this.speed
        if (this.y > canvas.height) {
          this.y = -this.length
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        ctx!.beginPath()
        ctx!.moveTo(this.x, this.y)
        ctx!.lineTo(this.x, this.y + this.length)
        ctx!.strokeStyle = "rgba(174, 194, 224, 0.5)"
        ctx!.lineWidth = 1
        ctx!.stroke()
      }
    }

    for (let i = 0; i < 100; i++) {
      raindrops.push(new Raindrop())
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas.width, canvas.height)
      raindrops.forEach((drop) => {
        drop.fall()
        drop.draw()
      })
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
}

