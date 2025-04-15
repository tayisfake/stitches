"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CashAppPayCheckoutProps {
  amount: string
}

export default function CashAppPayCheckout({ amount }: CashAppPayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Call the server action to create a Cash App Pay session
      const response = await fetch("/api/create-cashapp-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Number(amount) }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("Failed to create Cash App Pay session")
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError("Failed to process payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <Button
        onClick={handleCheckout}
        disabled={isLoading || !amount || isNaN(Number(amount)) || Number(amount) <= 0}
        className="w-full bg-[#00D632] hover:bg-[#00B82A] text-white font-bold py-3 rounded-xl"
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
          </div>
        ) : (
          "Pay with Cash App"
        )}
      </Button>
    </div>
  )
}
