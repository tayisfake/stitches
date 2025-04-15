import { NextResponse } from "next/server"
import Stripe from "stripe"
import { Redis } from "@upstash/redis"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

// Initialize Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get("stripe-signature")

  let event: Stripe.Event

  try {
    if (!sig || !endpointSecret) {
      return NextResponse.json({ error: "Missing signature or endpoint secret" }, { status: 400 })
    }

    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      console.log(`Cash App Pay session ${session.id} completed!`)

      // Store the session in Redis
      await redis.set(`cashapp_payment:${session.id}`, {
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        customer: session.customer,
        paymentStatus: session.payment_status,
        paymentMethod: session.payment_method_types,
        timestamp: new Date().toISOString(),
      })

      break
    case "checkout.session.async_payment_succeeded":
      const asyncSession = event.data.object as Stripe.Checkout.Session
      console.log(`Cash App Pay async payment ${asyncSession.id} succeeded!`)

      // Update the payment status in Redis
      await redis.set(`cashapp_payment:${asyncSession.id}`, {
        amount: asyncSession.amount_total ? asyncSession.amount_total / 100 : 0,
        currency: asyncSession.currency,
        customer: asyncSession.customer,
        paymentStatus: "succeeded",
        paymentMethod: asyncSession.payment_method_types,
        timestamp: new Date().toISOString(),
      })

      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
