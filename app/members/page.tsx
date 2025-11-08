"use client"

import { MenuButton } from "@/components/menu-button"
import { GlitterBackground } from "@/components/glitter-background"
import { RainBackground } from "@/components/rain-background"
import { Github, Twitter, Mail, Send } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const gradientColors = {
  default: { start: "#000000", middle: "#000033", end: "#000099" }, // black -> dark navy -> medium blue (matches homepage)
  pink: { start: "#2d0a1f", middle: "#4a1530", end: "#5c1a3d" }, // darker, less vibrant pink
  blue: { start: "#000000", middle: "#0f172a", end: "#052e16" }, // black -> very dark blue -> very dark green
  red: { start: "#000000", middle: "#450a0a", end: "#7f1d1d" }, // black -> red-950 -> red-900 (matches Sky Vouches)
  green: { start: "#000000", middle: "#14532d", end: "#14532d" }, // dark green
  orange: { start: "#000000", middle: "#7c2d12", end: "#c2410c" }, // black -> dark orange -> medium orange
  applePie: { start: "#000000", middle: "#1e3a8a", end: "#831843" }, // black -> dark blue -> dark pink
  gray: { start: "#000000", middle: "#1f2937", end: "#4b5563" }, // black -> gray-800 -> gray-600
}

const glitterColors = {
  default: "0, 0, 153", // medium blue (matches homepage gradient end color)
  pink: "140, 50, 90", // muted pink
  blue: "29, 78, 216",
  red: "220, 38, 38", // red
  green: "34, 197, 94", // green
  orange: "rgba(234, 88, 12, 0.3)", // orange
  applePie: "255, 215, 0", // gold glitter for Apple Pie
  gray: "156, 163, 175", // gray-400
}

const rainColors = {
  default: "rgba(0, 0, 153, 0.3)", // medium blue (matches homepage gradient end color)
  pink: "rgba(140, 50, 90, 0.3)", // muted pink
  blue: "rgba(29, 78, 216, 0.3)",
  red: "rgba(220, 38, 38, 0.3)", // red
  green: "rgba(34, 197, 94, 0.3)", // green
  orange: "rgba(234, 88, 12, 0.3)", // orange
  applePie: "rgba(138, 43, 226, 0.3)", // purple rain for Apple Pie
  gray: "rgba(156, 163, 175, 0.3)", // gray-400
}

const mainMembers = [
  {
    name: "Bmw",
    role: "CO OWNER", // Updated role from "Exchanger" to "CO OWNER"
    bio: (
      <>
        <a
          href="https://www.imissherbruh.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          imissherbruh
        </a>
      </>
    ),
    gradient: "pink",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a_e0bf2860f0d33497a39767f27cf920a6-8j6D7EwArUUr3opPIdOB2PYta7xson.gif",
    telegram: "https://t.me/mrbmw31",
    discord: "https://discord.com/users/300387060089487360",
  },
  {
    name: "Tay",
    role: "OWNER",
    bio: "Gang is NEVER online </3",
    gradient: "blue",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-36fba3d030ae6575-oUiW73X2wOa3pPqK0SxNuS8pd40T4p.gif",
    isAnimated: true,
    discord: "https://discord.com/users/1346646019693215744",
    telegram: "https://t.me/umtay0",
    oguser: "https://oguser.com//87",
  },
  {
    name: "Latek",
    role: "Exchanger",
    bio: "W exchanger", // Updated bio from "Driving product strategy and user growth." to "W exchanger"
    gradient: "gray", // Updated gradient from red to gray
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3a15c7bda2536e491c9de707a254f628-FBnqyvfkvv6FzFAzDsZr4rmXgVJGmV.png",
    discord: "https://discord.com/users/1267221377971257408", // Replaced github, twitter, email with discord and telegram
    telegram: "https://t.me/latekexc",
  },
]

const additionalMembers = [
  {
    name: "smalls",
    role: "cool peeps",
    bio: (
      <>
        Owner of{" "}
        <a
          href="https://discord.gg/betterlist"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          betterlist
        </a>
      </>
    ),
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f1e99fcc73b9177317ee6584425b6356-zHuD6fTDIcRu4waJZ67KML13vP32lq.png",
    discord: "https://discord.com/users/1315660965555208256",
    gradient: "green",
  },
  {
    name: "Apple Pie",
    role: "cool peeps",
    bio: "OG Garry",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-3853c487283222c1-OZFvojfImsrFsDPiswxBBzcgkGsNbX.gif",
    gradient: "applePie",
  },
]

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.077.077 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

const OGUserIcon = () => (
  <img
    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-11-08-00-46-55-removebg-preview-1SgOWGnBisQhpZbeok0n5vwPTNrtcF.png"
    alt="OGUser"
    className="w-5 h-5 object-contain"
  />
)

export default function MembersPage() {
  const [activeGradient, setActiveGradient] = useState<keyof typeof gradientColors>("default")
  const applePieAudioRef = useRef<HTMLAudioElement | null>(null)
  const latekAudioRef = useRef<HTMLAudioElement | null>(null)
  const bmwAudioRef = useRef<HTMLAudioElement | null>(null)
  const tayAudioRef = useRef<HTMLAudioElement | null>(null)
  const smallsAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    applePieAudioRef.current = new Audio(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tame%20Impala%20-%20Loser-4nRn5h2ssuFNGYkyILSuT7DSbpkvJ8.mp3",
    )
    applePieAudioRef.current.loop = true
    latekAudioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EsDeeKid%20-%20Cali%20Man-r8mLhKV7A52NXFYPRfQd9f6Xfli5Nb.mp3")
    latekAudioRef.current.loop = true
    bmwAudioRef.current = new Audio(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Don%20Toliver%20-%20Slow%20Motion%20%28feat.%20Wizkid%29-f0Wp6nTu6Izn8s8ptKCsdjPUL1EMnG.mp3",
    )
    bmwAudioRef.current.loop = true
    tayAudioRef.current = new Audio(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Scratch%20My%20Paint%20-%20Lil%20Uzi%20-%20Lil%20Uzi%20Vert%20-%20SoundLoadMate.com-tG6rfC2KVr2aol8JrP3dAKTsmaBjgD.mp3",
    )
    tayAudioRef.current.loop = true
    smallsAudioRef.current = new Audio(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Freddie%20Gibbs%20-%20Skinny%20Suge%20II-EfblScl3EStgsdxHGNvjva2NBeEfoC.mp3",
    )
    smallsAudioRef.current.loop = true
    return () => {
      if (applePieAudioRef.current) {
        applePieAudioRef.current.pause()
        applePieAudioRef.current = null
      }
      if (latekAudioRef.current) {
        latekAudioRef.current.pause()
        latekAudioRef.current = null
      }
      if (bmwAudioRef.current) {
        bmwAudioRef.current.pause()
        bmwAudioRef.current = null
      }
      if (tayAudioRef.current) {
        tayAudioRef.current.pause()
        tayAudioRef.current = null
      }
      if (smallsAudioRef.current) {
        smallsAudioRef.current.pause()
        smallsAudioRef.current = null
      }
    }
  }, [])

  const handleGradientChange = (gradient: keyof typeof gradientColors) => {
    setActiveGradient(gradient)

    if (applePieAudioRef.current) {
      if (gradient === "applePie") {
        applePieAudioRef.current.play()
      } else {
        applePieAudioRef.current.pause()
      }
    }

    if (latekAudioRef.current) {
      if (gradient === "gray") {
        latekAudioRef.current.play()
      } else {
        latekAudioRef.current.pause()
      }
    }

    if (bmwAudioRef.current) {
      if (gradient === "pink") {
        bmwAudioRef.current.play()
      } else {
        bmwAudioRef.current.pause()
      }
    }

    if (tayAudioRef.current) {
      if (gradient === "blue") {
        tayAudioRef.current.play()
      } else {
        tayAudioRef.current.pause()
      }
    }

    if (smallsAudioRef.current) {
      if (gradient === "green") {
        smallsAudioRef.current.play()
      } else {
        smallsAudioRef.current.pause()
      }
    }
  }

  const currentGradient = gradientColors[activeGradient]

  return (
    <div
      className="min-h-screen text-white overflow-hidden relative"
      style={{
        background: `linear-gradient(to bottom right, ${currentGradient.start}, ${currentGradient.middle}, ${currentGradient.end})`,
        transition: "background 1000ms ease-in-out",
      }}
    >
      {typeof window !== "undefined" && (
        <>
          <GlitterBackground key={`glitter-${activeGradient}`} color={glitterColors[activeGradient]} />
          <RainBackground key={`rain-${activeGradient}`} color={rainColors[activeGradient]} />
        </>
      )}

      <div className="relative z-20">
        <MenuButton />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Meet the Team</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto text-balance">
              Stitches would be NOTHING without these gang members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            {mainMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
                onMouseEnter={() => handleGradientChange(member.gradient as keyof typeof gradientColors)}
              >
                {/* Avatar */}
                {member.avatar ? (
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-contain mx-auto mb-6 bg-white/5"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6 flex items-center justify-center text-3xl font-bold mx-auto">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}

                {/* Member Info */}
                <h3 className="text-2xl font-bold mb-2 text-center">{member.name}</h3>
                <p className="text-purple-400 text-sm font-semibold mb-4 uppercase tracking-wide text-center">
                  {member.role}
                </p>
                <div className="text-gray-300 text-base mb-6 leading-relaxed text-center">{member.bio}</div>

                {/* Social Links */}
                <div className="flex gap-3 justify-center">
                  {"telegram" in member && member.telegram && "oguser" in member ? (
                    <>
                      <a
                        href={member.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <DiscordIcon />
                      </a>
                      <a
                        href={member.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <Send className="w-5 h-5" />
                      </a>
                      <a
                        href={member.oguser}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <OGUserIcon />
                      </a>
                    </>
                  ) : "telegram" in member && member.telegram ? (
                    <>
                      <a
                        href={member.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <DiscordIcon />
                      </a>
                      <a
                        href={member.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <Send className="w-5 h-5" />
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href={"github" in member ? member.github : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={"twitter" in member ? member.twitter : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a
                        href={`mailto:${"email" in member ? member.email : ""}`}
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {additionalMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex flex-col md:flex-row items-center gap-6 cursor-pointer"
                onMouseEnter={() =>
                  "gradient" in member
                    ? handleGradientChange(member.gradient as keyof typeof gradientColors)
                    : undefined
                }
              >
                {/* Avatar Placeholder */}
                {member.avatar ? (
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-contain flex-shrink-0 bg-white/5"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}

                {/* Member Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-purple-400 text-xs font-semibold mb-2 uppercase tracking-wide">{member.role}</p>
                  <div className="text-gray-300 text-sm mb-3 leading-relaxed">{member.bio}</div>

                  {/* Social Links */}
                  {member.name !== "Apple Pie" && (
                    <div className="flex gap-3 justify-center md:justify-start">
                      {"discord" in member && member.discord ? (
                        <a
                          href={member.discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                        >
                          <DiscordIcon />
                        </a>
                      ) : (
                        <>
                          <a
                            href={"github" in member ? member.github : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                          <a
                            href={"twitter" in member ? member.twitter : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                          <a
                            href={`mailto:${"email" in member ? member.email : ""}`}
                            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
