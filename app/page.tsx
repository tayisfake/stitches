"use client"

import type React from "react"

import { useState } from "react"
import CryptoExchange from "@/components/crypto-exchange"
import RainBackground from "@/components/rain-background"
import DiscordIdChecker from "@/components/discord-id-checker"
import SocialLinks from "@/components/social-links"
import EntranceOverlay from "@/components/entrance-overlay"
import GlitterBackground from "@/components/glitter-background"
import Logo from "@/components/logo"

export default function Home() {
  const [showContent, setShowContent] = useState(false)

  return (
    <>
      <EntranceOverlay onEnter={() => setShowContent(true)} />
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-24 relative overflow-hidden transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <GlitterBackground />
        <RainBackground />
        <Logo />
        <div className="z-10 w-full max-w-5xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center relative">
            <AnimatedText>Stitches Exchanges</AnimatedText>
          </h1>
          <div className="flex flex-col gap-6 sm:gap-8 justify-center items-center">
            <div className="w-full max-w-md">
              <DiscordIdChecker />
            </div>
            <div className="w-full max-w-md">
              <CryptoExchange />
            </div>
          </div>
        </div>
        <SocialLinks />
      </main>
    </>
  )
}

function AnimatedText({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block transition-transform duration-200 hover:scale-110 cursor-default">{children}</span>
  )
}

