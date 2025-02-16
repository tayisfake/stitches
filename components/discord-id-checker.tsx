"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DiscordIdChecker() {
  const [discordId, setDiscordId] = useState("")
  const [message, setMessage] = useState("")
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldown])

  const handleCheck = () => {
    if (cooldown > 0) return

    if (discordId === "1334528441445257318") {
      setMessage("THAT IS ME")
    } else {
      setMessage("THAT IS NOT ME")
    }

    setCooldown(60) // Set 60-second cooldown
  }

  return (
    <Card className="w-full bg-white bg-opacity-10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white text-center">Discord ID Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="Enter Discord ID"
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
            className="bg-gray-800 text-white border-gray-600 rounded-xl flex-grow"
          />
          <Button
            onClick={handleCheck}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl w-full sm:w-auto"
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Wait ${Math.floor(cooldown / 60)}m ${cooldown % 60}s` : "Is this me?"}
          </Button>
        </div>
        {message && (
          <p className={`text-center font-bold ${message === "THAT IS ME" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

