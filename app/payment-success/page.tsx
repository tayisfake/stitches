"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import RainBackground from "@/components/rain-background"
import GlitterBackground from "@/components/glitter-background"
import { MenuButton } from "@/components/menu-button"
import ThemeToggle from "@/components/theme-toggle"
import Logo from "@/components/logo"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [paymentSource, setPaymentSource] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get("session_id")
    const source = searchParams.get("source")
    const order = searchParams.get("token") // PayPal order ID comes as 'token' in the URL

    setSessionId(id)
    setPaymentSource(source)

    if (order && source === "paypal") {
      setOrderId(order)
      capturePayPalPayment(order)
    }
  }, [searchParams])

  const capturePayPalPayment = async (orderId: string) => {
    try {
      setLoading(true)

      const response = await fetch("/api/capture-paypal-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to capture payment")
      }

      // Payment captured successfully
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-24 relative overflow-hidden">
      <GlitterBackground />
      <RainBackground />
      <Logo />
      <MenuButton />
      <ThemeToggle />
      <div className="z-10 w-full max-w-md">
        <Card className="w-full bg-card/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {loading ? (
                <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
              ) : (
                <CheckCircle className="h-16 w-16 text-green-500" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              {loading ? "Processing Payment..." : "Payment Successful!"}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Your {paymentSource === "paypal" ? "PayPal" : paymentSource === "cashapp" ? "Cash App" : "payment"} has
              been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-500/20 p-3 rounded-xl">
                <p className="text-sm text-white/90">{error}</p>
              </div>
            )}

            {sessionId && (
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-sm text-white/70">Transaction ID:</p>
                <p className="text-xs font-mono text-white/90 break-all">{sessionId}</p>
              </div>
            )}

            {orderId && (
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-sm text-white/70">Order ID:</p>
                <p className="text-xs font-mono text-white/90 break-all">{orderId}</p>
              </div>
            )}

            <p className="text-center text-white/80">
              Thank you for your payment. You will receive a confirmation email shortly.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
