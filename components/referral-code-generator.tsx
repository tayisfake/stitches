"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function ReferralCodeGenerator() {
  const [referralCode, setReferralCode] = useState("")

  const generateReferralCode = async () => {
    try {
      const response = await fetch("/api/generate-referral-code", {
        method: "POST",
      })
      const data = await response.json()
      if (response.ok) {
        setReferralCode(data.code)
        toast({
          title: "Referral Code Generated",
          description: `Your referral code is: ${data.code}`,
        })
      } else {
        throw new Error(data.error || "Failed to generate referral code")
      }
    } catch (error) {
      console.error("Error generating referral code:", error)
      toast({
        title: "Error",
        description: "Failed to generate referral code. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Referral Program</h3>
      <div className="space-y-2">
        <Label htmlFor="referral-code">Your Referral Code</Label>
        <div className="flex space-x-2">
          <Input id="referral-code" value={referralCode} readOnly placeholder="Generate a code" />
          <Button onClick={generateReferralCode}>Generate</Button>
        </div>
      </div>
    </div>
  )
}
