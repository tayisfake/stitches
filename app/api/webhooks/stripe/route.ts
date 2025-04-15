import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        // Handle successful payment
        console.log(`💰 Payment successful: ${session.id}`)
        // Here you would update your database, notify your team, etc.
        break
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`💰 PaymentIntent successful: ${paymentIntent.id}`)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }
}
