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
    if (discordId === "1334528441445257318") {
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
            onChange={handleInputChange}
            className="bg-gray-800 text-white border-gray-600 rounded-xl flex-grow"
          />
          <Button onClick={handleCheck} className="bg-blue-500 hover:bg-blue-600 rounded-xl w-full sm:w-auto">
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

