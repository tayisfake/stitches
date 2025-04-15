"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface VideoPlayerProps {
  src: string
  title?: string
  poster?: string
  className?: string
}

export function VideoPlayer({ src, title, poster, className = "" }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      <video
        className={`w-full aspect-video ${className}`}
        controls
        poster={poster}
        onLoadedData={() => setIsLoading(false)}
        title={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
