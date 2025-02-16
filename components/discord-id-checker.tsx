"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DiscordIdChecker() {
  const [discordId, setDiscordId] = useState("")
  const [message, setMessage] = useState("")

  const handleCheck = () => {
    if (discordId === "1334528441445257318") {
      setMessage("THAT IS ME")
    } else {
      setMessage("THAT IS NOT ME")
    }
  }

  return (
    <Card className="w-full bg-white bg-opacity-10 backdrop-blur-md rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Discord ID Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter Discord ID"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          className="bg-gray-800 text-white border-gray-600 rounded-md"
        />
        <Button onClick={handleCheck} className="w-full bg-blue-500 hover:bg-blue-600 rounded-md">
          Is this me?
        </Button>
        {message && (
          <p className={`text-center font-bold ${message === "THAT IS ME" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

