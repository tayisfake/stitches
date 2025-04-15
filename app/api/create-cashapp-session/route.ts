import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil", // Use the latest API version
})

export async function POST(request: Request) {
  try {
    const { amount } = await request.json()

    // Validate amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount provided" }, { status: 400 })
    }

    // Create a Stripe Checkout Session with Cash App Pay
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["cashapp"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Crypto Exchange Service",
              description: "Secure payment for cryptocurrency exchange",
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/cashapp-pay?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/cashapp-pay?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating Cash App Pay session:", error)
    return NextResponse.json({ error: "Failed to create Cash App Pay session" }, { status: 500 })
  }
}
