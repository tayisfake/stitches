"use server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function createCashAppPaySession(amount: number, currency = "usd") {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["cashapp"],
      line_items: [
        {
          price_data: {
            currency,
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

    return { url: session.url }
  } catch (error) {
    console.error("Error creating Cash App Pay session:", error)
    throw new Error("Failed to create Cash App Pay session")
  }
}

// We can remove the createPaymentIntent function since we won't be using the regular card payment flow
