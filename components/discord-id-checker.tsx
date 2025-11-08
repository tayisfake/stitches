"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DiscordIdChecker() {
  const [discordId, setDiscordId] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleCheck = () => {
    if (discordId.toLowerCase().includes("@everyone") || discordId.toLowerCase().includes("@here")) {
      setError("Nice try buddy")
      setMessage("")
      return
    }

    setError("")
    if (
      discordId === "1334528441445257318" ||
      discordId === "1346646019693215744" ||
      discordId === "1385734267627245569"
    ) {
      setMessage("THAT IS ME")
    } else {
      setMessage("THAT IS NOT ME")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDiscordId(value)
    if (value.toLowerCase().includes("@everyone") || value.toLowerCase().includes("@here")) {
      setError("Nice try buddy")
    } else {
      setError("")
    }
  }

  return (
    <Card className="w-full bg-card/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border-gray-600/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white text-center">Discord ID Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="Enter Discord ID"
            value={discordId}
            onChange={handleInputChange}
            className="bg-transparent text-white border-gray-600/30 placeholder-gray-400 rounded-xl flex-grow"
          />
          <Button
            onClick={handleCheck}
            className="bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl w-full sm:w-auto transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Is this me?
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <p className={`text-center font-bold ${message === "THAT IS ME" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
