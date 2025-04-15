"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import RainBackground from "@/components/rain-background"
import GlitterBackground from "@/components/glitter-background"
import { MenuButton } from "@/components/menu-button"
import ThemeToggle from "@/components/theme-toggle"
import Logo from "@/components/logo"
import { loadStripe } from "@stripe/stripe-js"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function PayMePage() {
  const [amount, setAmount] = useState("")
  // Update the payment method state type and default value
  const [paymentMethod, setPaymentMethod] = useState<"cashapp" | "wallets">("cashapp")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const router = useRouter()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    if (value === "" || (!isNaN(Number.parseFloat(value)) && isFinite(Number(value)))) {
      setAmount(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate input
      if (!amount || Number.parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (!termsAccepted) {
        throw new Error("You must accept the terms of service")
      }

      // Create payment session
      const response = await fetch("/api/create-payment-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          paymentMethod,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create payment session")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to initialize")
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center relative">
          <AnimatedText>Pay Me</AnimatedText>
        </h1>
        <Card className="w-full bg-card/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-foreground">Quick Payment</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Fast and secure payments via Cash App or Apple Pay
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
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
                  onChange={handleAmountChange}
                  className="bg-white bg-opacity-20 text-white placeholder-gray-400 rounded-xl"
                />
              </div>

              {/* Update the RadioGroup section to show Google Pay/Apple Pay as a single option */}
              <div className="space-y-2">
                <Label className="text-white">Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as "cashapp" | "wallets")}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/15 transition-colors">
                    <RadioGroupItem value="cashapp" id="cashapp" className="text-white" />
                    <Label htmlFor="cashapp" className="text-white cursor-pointer flex-1">
                      Cash App
                    </Label>
                    <div className="h-6 w-6 bg-green-500 rounded flex items-center justify-center text-white font-bold">
                      $
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/15 transition-colors">
                    <RadioGroupItem value="wallets" id="wallets" className="text-white" />
                    <Label htmlFor="wallets" className="text-white cursor-pointer flex-1">
                      Google Pay / Apple Pay
                    </Label>
                    <div className="flex">
                      <svg className="h-6 w-6 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6.25 4C4.45 4 3 5.45 3 7.25V16.75C3 18.55 4.45 20 6.25 20H17.75C19.55 20 21 18.55 21 16.75V7.25C21 5.45 19.55 4 17.75 4H6.25Z"
                          fill="black"
                        />
                        <path
                          d="M10.54 6.49C10.21 6.89 9.73 7.22 9.25 7.15C9.18 6.67 9.44 6.15 9.74 5.8C10.07 5.4 10.59 5.09 11.13 5.09C11.18 5.6 10.87 6.09 10.54 6.49Z"
                          fill="white"
                        />
                        <path
                          d="M11.13 7.32C10.4 7.28 9.77 7.73 9.44 7.73C9.11 7.73 8.58 7.35 8.01 7.36C7.27 7.37 6.59 7.79 6.23 8.47C5.49 9.84 6.03 11.85 6.74 12.96C7.09 13.51 7.51 14.11 8.08 14.09C8.61 14.07 8.81 13.75 9.46 13.75C10.1 13.75 10.28 14.09 10.84 14.08C11.42 14.07 11.79 13.53 12.13 12.98C12.53 12.36 12.69 11.76 12.7 11.73C12.69 11.72 11.87 11.41 11.86 10.38C11.85 9.5 12.5 9.12 12.54 9.09C12.12 8.47 11.47 8.38 11.13 7.32Z"
                          fill="white"
                        />
                      </svg>
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 11.5C13.1046 11.5 14 10.6046 14 9.5C14 8.39543 13.1046 7.5 12 7.5C10.8954 7.5 10 8.39543 10 9.5C10 10.6046 10.8954 11.5 12 11.5Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M19.77 12.66C19.77 12.24 19.74 11.77 19.69 11.31H12V13.96H16.43C16.22 14.99 15.57 15.85 14.59 16.39V18.29H17.27C18.7 16.94 19.77 14.95 19.77 12.66Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 20C14.2 20 16.05 19.25 17.27 18.29L14.59 16.39C13.93 16.83 13.06 17.1 12 17.1C9.91 17.1 8.14 15.66 7.5 13.69H4.72V15.65C5.9 18.2 8.73 20 12 20Z"
                          fill="#34A853"
                        />
                        <path
                          d="M7.5 13.69C7.33 13.25 7.23 12.78 7.23 12.3C7.23 11.82 7.33 11.35 7.5 10.91V8.95H4.72C4.26 9.96 4 11.11 4 12.3C4 13.49 4.26 14.64 4.72 15.65L7.5 13.69Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 7.5C13.19 7.5 14.27 7.93 15.09 8.72L17.47 6.34C16.05 5.01 14.2 4.2 12 4.2C8.73 4.2 5.9 6 4.72 8.55L7.5 10.51C8.14 8.54 9.91 7.5 12 7.5Z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-black/20 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-white font-semibold">Terms of Service</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
                  <li>Payments have to be sent by you</li>
                  <li>Payments must be sent with balance and not from a linked card</li>
                  <li>DO NOT USE THE CARD OPTION - IT IS JUST A PLACEHOLDER FOR APPLE PAY</li>
                  <li>
                    You must provide a screen recording of you sending the payment (Discord/Telegram chats must be shown
                    within the screen recording)
                  </li>
                  <li>No sussy business</li>
                  <li>
                    Payments sent from a 3rd party must be in a gc with me to confirm everything is right and the deal
                    went smooth (Basically a middleman)
                  </li>
                </ul>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="rounded border-gray-500 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="terms" className="text-white text-sm">
                    I agree to the terms of service
                  </Label>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-xl text-sm">{error}</div>
              )}
            </CardContent>
            <CardFooter>
              {/* Update the submit button text */}
              <Button
                type="submit"
                disabled={loading || !termsAccepted}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                {loading
                  ? "Processing..."
                  : `Pay with ${paymentMethod === "cashapp" ? "Cash App" : "Google Pay/Apple Pay"}`}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}

function AnimatedText({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block transition-transform duration-200 hover:scale-110 cursor-default">{children}</span>
  )
}
