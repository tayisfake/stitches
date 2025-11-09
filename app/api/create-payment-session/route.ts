import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: Request) {
  try {
    const { amount, paymentMethod } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Determine payment method types based on selection
    let paymentMethodTypes: string[] = []
    if (paymentMethod === "cashapp") {
      paymentMethodTypes = ["cashapp"]
    } else if (paymentMethod === "wallets") {
      paymentMethodTypes = ["card"] // Stripe uses 'card' for Apple Pay/Google Pay
    } else {
      paymentMethodTypes = ["card"]
    }

    const origin =
      request.headers.get("origin") ||
      `https://${request.headers.get("host")}` ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://stitches.vercel.app"

    const successUrl = `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${origin}/pay-me?canceled=true`

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Payment",
              description: "Quick payment",
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating payment session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payment session" },
      { status: 500 },
    )
  }
}
