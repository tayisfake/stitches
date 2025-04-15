import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  try {
    const { amount, paymentMethod } = await req.json()
    const headersList = headers()

    // Get the host from headers to build absolute URLs
    const host = headersList.get("host") || "localhost:3000"
    const protocol = host.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!paymentMethod || !["cashapp", "wallets"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    // Create a Stripe Checkout Session with absolute URLs
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Stitches Exchanges Payment",
              description: `Payment via ${paymentMethod === "cashapp" ? "Cash App" : "Google Pay/Apple Pay"}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pay-me`,
    }

    // Configure payment method based on selection
    if (paymentMethod === "cashapp") {
      sessionOptions.payment_method_types = ["cashapp"]
    } else if (paymentMethod === "wallets") {
      // For Apple Pay, we'll use the card payment method
      sessionOptions.payment_method_types = ["card"]
    }

    const session = await stripe.checkout.sessions.create(sessionOptions)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating payment session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payment session" },
      { status: 500 },
    )
  }
}
