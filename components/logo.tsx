"use client"

import Image from "next/image"
import { useTheme } from "next-themes"

export default function Logo() {
  const { theme } = useTheme()

  return (
    <a
      href="https://en.wikipedia.org/wiki/Stitch_(Lilo_%26_Stitch)"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-4 z-40 w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300 cursor-pointer hover:scale-105 hover:-rotate-6"
    >
      <div className="relative w-full h-full group">
        {/* Stitch Background */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-300">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7158-cartoon-15.jpg-ENyLK1Kwl6lTX94i9Ci2zRgwOEBqns.jpeg"
            alt="Stitch"
            fill
            className="object-contain rounded-full"
          />
        </div>
        {/* Glowing S */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-4xl sm:text-5xl font-bold transition-all duration-300 logo-s
            ${
              theme === "dark"
                ? "text-white/30 group-hover:text-white/50 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                : "text-white/40 group-hover:text-white/60 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]"
            }`}
          >
            S
          </span>
        </div>
      </div>
    </a>
  )
}

