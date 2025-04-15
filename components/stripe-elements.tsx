"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
let stripePromise: Promise<any> | null = null

const getStripe = async () => {
  if (!stripePromise) {
    const response = await fetch("/api/stripe-config")
    const { publishableKey } = await response.json()
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

export function StripeElementsProvider({
  clientSecret,
  children,
}: {
  clientSecret: string
  children: React.ReactNode
}) {
  const [stripe, setStripe] = useState<any>(null)

  useEffect(() => {
    const loadStripeJs = async () => {
      const stripeInstance = await getStripe()
      setStripe(stripeInstance)
    }
    loadStripeJs()
  }, [])

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      {children}
    </Elements>
  )
}

export function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return
    }

    setIsLoading(true)
    setMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/cashapp-pay?success=true`,
      },
      redirect: "if_required",
    })

    if (error) {
      setMessage(error.message || "An unexpected error occurred.")
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!")
      window.location.href = `${window.location.origin}/cashapp-pay?success=true&payment_intent=${paymentIntent.id}`
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${message.includes("successful") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
        >
          {message}
        </div>
      )}
      <Button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[#635BFF] hover:bg-[#4F46E5] text-white font-bold py-3 rounded-xl"
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
          </div>
        ) : (
          "Pay now"
        )}
      </Button>
    </form>
  )
}
