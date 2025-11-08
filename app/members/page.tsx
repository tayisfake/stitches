"use client"

import { MenuButton } from "@/components/menu-button"
import { GlitterBackground } from "@/components/glitter-background"
import { RainBackground } from "@/components/rain-background"
import { Github, Twitter, Mail } from "lucide-react"
import { useState } from "react"

const gradients = {
  default: "from-black via-purple-950 to-purple-900",
  red: "from-black via-red-950 to-red-900",
  orange: "from-black via-orange-950 to-orange-900",
  blue: "from-black via-blue-950 to-blue-900",
  purple: "from-black via-purple-950 to-purple-900",
  green: "from-black via-green-950 to-green-900",
}

const glitterColors = {
  default: "rgb(147, 51, 234)", // purple
  red: "rgb(220, 38, 38)",
  orange: "rgb(234, 88, 12)",
  blue: "rgb(29, 78, 216)",
  purple: "rgb(147, 51, 234)",
  green: "rgb(21, 128, 61)",
}

const rainColors = {
  default: "rgba(147, 51, 234, 0.3)", // purple
  red: "rgba(220, 38, 38, 0.3)",
  orange: "rgba(234, 88, 12, 0.3)",
  blue: "rgba(29, 78, 216, 0.3)",
  purple: "rgba(147, 51, 234, 0.3)",
  green: "rgba(21, 128, 61, 0.3)",
}

const mainMembers = [
  {
    name: "Alex Chen",
    role: "Lead Developer",
    bio: "Full-stack developer specializing in blockchain and crypto.",
    gradient: "red",
    github: "https://github.com",
    twitter: "https://twitter.com",
    email: "alex@stitchesexchanges.com",
  },
  {
    name: "Sarah Martinez",
    role: "UI/UX Designer",
    bio: "Crafting beautiful interfaces and seamless experiences.",
    gradient: "orange",
    github: "https://github.com",
    twitter: "https://twitter.com",
    email: "sarah@stitchesexchanges.com",
  },
  {
    name: "Michael Park",
    role: "Backend Engineer",
    bio: "Building robust APIs and managing infrastructure.",
    gradient: "blue",
    github: "https://github.com",
    twitter: "https://twitter.com",
    email: "michael@stitchesexchanges.com",
  },
  {
    name: "Emma Thompson",
    role: "Product Manager",
    bio: "Driving product strategy and user growth.",
    gradient: "purple",
    github: "https://github.com",
    twitter: "https://twitter.com",
    email: "emma@stitchesexchanges.com",
  },
  {
    name: "David Lee",
    role: "Security Specialist",
    bio: "Ensuring platform security and user safety.",
    gradient: "green",
    github: "https://github.com",
    twitter: "https://twitter.com",
    email: "david@stitchesexchanges.com",
  },
]

const additionalMembers = [
  {
    name: "Jessica Wu",
    role: "Marketing Director",
    bio: "Building brand presence and community engagement.",
    github: "https://github.com",
    twitter: "https://twitter.com",
    email: "jessica@stitchesexchanges.com",
  },
  {
    name: "Tom Anderson",
    role: "DevOps Engineer",
    bio: "Optimizing deployment pipelines and infrastructure.",
    github: "https://github.com",
    twitter: "https://twitter.com",
    email: "tom@stitchesexchanges.com",
  },
]

export default function MembersPage() {
  const [activeGradient, setActiveGradient] = useState<keyof typeof gradients>("default")

  console.log("[v0] Members page rendering, activeGradient:", activeGradient)

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${gradients[activeGradient]} text-white overflow-hidden relative transition-all duration-700`}
    >
      {typeof window !== "undefined" && (
        <>
          <GlitterBackground color={glitterColors[activeGradient]} />
          <RainBackground color={rainColors[activeGradient]} />
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
              The talented people behind Stitches Exchanges, working together to build the best crypto exchange
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {mainMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
                onMouseEnter={() => setActiveGradient(member.gradient as keyof typeof gradients)}
                onMouseLeave={() => setActiveGradient("default")}
              >
                {/* Avatar Placeholder */}
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4 flex items-center justify-center text-2xl font-bold mx-auto">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* Member Info */}
                <h3 className="text-xl font-bold mb-1 text-center">{member.name}</h3>
                <p className="text-purple-400 text-xs font-semibold mb-3 uppercase tracking-wide text-center">
                  {member.role}
                </p>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed text-center">{member.bio}</p>

                {/* Social Links */}
                <div className="flex gap-3 justify-center">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {additionalMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex flex-col md:flex-row items-center gap-6"
              >
                {/* Avatar Placeholder */}
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* Member Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-purple-400 text-xs font-semibold mb-2 uppercase tracking-wide">{member.role}</p>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{member.bio}</p>

                  {/* Social Links */}
                  <div className="flex gap-3 justify-center md:justify-start">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Join Us Section */}
          <div className="mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Want to Join Us?</h2>
              <p className="text-gray-300 mb-6 text-lg">
                We're always looking for talented people to join our team. If you're passionate about crypto and
                building amazing products, we'd love to hear from you.
              </p>
              <a
                href="mailto:careers@stitchesexchanges.com"
                className="inline-block px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
