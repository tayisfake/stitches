"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface EntranceOverlayProps {
  onEnter: (mode: "buy" | "sell") => void
}

export default function EntranceOverlay({ onEnter }: EntranceOverlayProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [hoveredButton, setHoveredButton] = useState<"buy" | "sell" | null>(null)

  const handleModeSelect = (mode: "buy" | "sell") => {
    setIsVisible(false)
    setTimeout(() => onEnter(mode), 1000) // Wait for fade out animation
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000B1E]/80 backdrop-blur-sm transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex flex-col items-center gap-8 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 blur-3xl" />
        <div className="relative flex flex-col gap-6">
          <Button
            onClick={() => handleModeSelect("buy")}
            onMouseEnter={() => setHoveredButton("buy")}
            onMouseLeave={() => setHoveredButton(null)}
            className="group relative w-64 h-16 px-8 text-2xl font-bold text-white bg-transparent backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            {/* Pulsating background effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse" />
            </div>

            {/* Glowing border effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-3">
              Buy Crypto
              <ArrowRight
                className={`w-6 h-6 transition-transform duration-300 ${
                  hoveredButton === "buy" ? "translate-x-2" : ""
                }`}
              />
            </div>
          </Button>

          <Button
            onClick={() => handleModeSelect("sell")}
            onMouseEnter={() => setHoveredButton("sell")}
            onMouseLeave={() => setHoveredButton(null)}
            className="group relative w-64 h-16 px-8 text-2xl font-bold text-white bg-transparent backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            {/* Pulsating background effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 animate-pulse" />
            </div>

            {/* Glowing border effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-3">
              Sell Crypto
              <ArrowRight
                className={`w-6 h-6 transition-transform duration-300 ${
                  hoveredButton === "sell" ? "translate-x-2" : ""
                }`}
              />
            </div>
          </Button>
        </div>

        {/* Ambient glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 animate-[pulse_3s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05),transparent)] animate-[ping_4s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}
