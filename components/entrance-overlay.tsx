"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function EntranceOverlay({ onEnter }: { onEnter: () => void }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleEnter = () => {
    setIsVisible(false)
    setTimeout(onEnter, 1000) // Wait for fade out animation
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000B1E]/60 backdrop-blur-[2px] transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative">
        <div className="glitter" />
        <Button
          onClick={handleEnter}
          className="relative px-8 py-4 text-2xl font-bold text-white bg-transparent hover:bg-white/10 border-2 border-white/20 rounded-xl transition-all duration-300 hover:scale-105"
        >
          Enter Here
        </Button>
      </div>
    </div>
  )
}

