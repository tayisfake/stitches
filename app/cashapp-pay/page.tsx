"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { MenuButton } from "@/components/menu-button"
import { useRouter, useSearchParams } from "next/navigation"
import RainBackground from "@/components/rain-background"
import GlitterBackground from "@/components/glitter-background"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import CashAppPayCheckout from "@/components/stripe-checkout"

export default function CashappPayPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [amount, setAmount] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success">("idle")

  // Check for success or canceled payment from Stripe
  const success = searchParams.get("success")
  const canceled = searchParams.get("canceled")
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    if (success === "true" && sessionId) {
    }
  }, [success, sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000066] via-[#4B0082] to-[#9933FF] dark:from-black dark:to-[#1a0033] p-6 relative overflow-hidden">
      <GlitterBackground />
      <RainBackground />
      <MenuButton />
      <Button
        onClick={() => router.push("/")}
        className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go Back
      </Button>

      <div className="max-w-md mx-auto space-y-8 pt-16 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Cash App Payment</h1>
          <p className="text-gray-300">Send payments quickly and securely with Cash App</p>
        </div>

        {canceled === "true" && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
            <AlertTitle>Payment Canceled</AlertTitle>
            <AlertDescription>Your payment was canceled. Please try again when you're ready.</AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/[0.03] backdrop-blur-md border-white/5 shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-center text-white">Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            {success === "true" && sessionId ? (
              <div className="flex flex-col items-center space-y-4 py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Payment Initiated</h3>
                <p className="text-gray-300 text-center">
                  Please complete your payment in the Cash App. Once payment is confirmed, our team will process your
                  exchange.
                </p>
                <Button
                  onClick={() => {
                    router.push("/cashapp-pay")
                  }}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Make Another Payment
                </Button>
              </div>
            ) : (
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">
                    Amount (USD)
                  </Label>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "")
                      if (value === "" || (!isNaN(Number.parseFloat(value)) && isFinite(Number(value)))) {
                        setAmount(value)
                      }
                    }}
                    className="bg-black/20 text-white border-gray-700 focus:border-purple-500"
                  />
                </div>

                <div className="border border-gray-700 rounded-lg p-4 bg-black/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="relative w-6 h-6 mr-2">
                        <Image
                          src="/stylized-cash-symbol.png"
                          alt="Cash App"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-white font-medium">Cash App Pay</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3">
                    Pay directly with Cash App - quick, secure, and convenient.
                  </p>

                  <CashAppPayCheckout amount={amount} />
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-12 h-12">
              <Image
                src="/stylized-cash-symbol.png"
                alt="Cash App Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">How It Works</h3>
          <ol className="text-gray-300 text-sm space-y-2 text-left list-decimal pl-5">
            <li>Enter the amount you wish to send</li>
            <li>Click "Pay with Cash App" to initiate payment</li>
            <li>Complete the payment with a few taps in Cash App</li>
            <li>Our team will process your exchange once payment is confirmed</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
