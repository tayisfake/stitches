import type React from "react"
import CryptoExchange from "@/components/crypto-exchange"
import RainBackground from "@/components/rain-background"
import DiscordIdChecker from "@/components/discord-id-checker"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden">
      <RainBackground />
      <div className="z-10 w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center relative">
          <AnimatedText>Stitches Exchanges</AnimatedText>
        </h1>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
          <div className="w-full md:w-1/3">
            <DiscordIdChecker />
          </div>
          <div className="w-full md:w-2/3">
            <CryptoExchange />
          </div>
        </div>
      </div>
    </main>
  )
}

function AnimatedText({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block transition-transform duration-200 hover:scale-110 cursor-default">{children}</span>
  )
}

