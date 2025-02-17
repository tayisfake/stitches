"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BotHealthResponse {
  success: boolean
  status?: string
  error?: string
  details?: string
  botUrl?: string
}

const DEFAULT_BOT_URL = "http://192.99.207.143:3000"

export default function BotStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline" | "error">("checking")
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<string | null>(null)
  const [botUrl, setBotUrl] = useState<string>("http://192.99.207.143:3000")
  const [isEditingUrl, setIsEditingUrl] = useState(false)

  const checkBotStatus = async (url: string = botUrl) => {
    setStatus("checking")
    try {
      console.log("Checking bot status...")
      const response = await fetch(`/api/bot-health?botUrl=${encodeURIComponent(url)}`)
      const data: BotHealthResponse = await response.json()

      console.log("Bot health check response:", data)

      if (data.success) {
        setStatus("online")
        setError(null)
        setDetails(null)
      } else {
        setStatus("offline")
        setError(data.error || "Unknown error")
        setDetails(data.details || null)
      }
      if (data.botUrl) {
        setBotUrl(data.botUrl)
      }
    } catch (error) {
      console.error("Error checking bot status:", error)
      setStatus("error")
      setError("Failed to check bot status")
      setDetails(error instanceof Error ? error.message : String(error))
    }
  }

  useEffect(() => {
    checkBotStatus()
    const interval = setInterval(() => checkBotStatus(), 30000)
    return () => clearInterval(interval)
  }, []) // Fixed: Removed botUrl from dependencies

  const handleUpdateUrl = () => {
    checkBotStatus(botUrl)
    setIsEditingUrl(false)
  }

  return (
    <Alert variant={status === "online" ? "default" : "destructive"} className="max-w-md mx-auto mb-4">
      {status === "online" ? <InfoIcon className="h-4 w-4" /> : <AlertTriangleIcon className="h-4 w-4" />}
      <AlertTitle>Bot Status: {status.charAt(0).toUpperCase() + status.slice(1)}</AlertTitle>
      <AlertDescription className="mt-2">
        {error && <div>{error}</div>}
        {details && <div className="text-sm mt-1 opacity-80">{details}</div>}
        <div className="text-sm mt-1">
          Bot URL:{" "}
          {isEditingUrl ? (
            <div className="flex items-center mt-2">
              <Input
                value={botUrl}
                onChange={(e) => setBotUrl(e.target.value)}
                placeholder="Enter bot URL"
                className="mr-2"
              />
              <Button onClick={handleUpdateUrl} size="sm">
                Update
              </Button>
            </div>
          ) : (
            <>
              {botUrl}
              <Button onClick={() => setIsEditingUrl(true)} variant="link" className="p-0 h-auto font-normal">
                Edit
              </Button>
            </>
          )}
        </div>
        <Button onClick={() => checkBotStatus()} className="mt-2" size="sm">
          Retry Connection
        </Button>
      </AlertDescription>
    </Alert>
  )
}

