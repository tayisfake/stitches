import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { createPayPalOrder } from "@/lib/paypal-api"
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "@/lib/paypal-config"

export async function POST(req: Request) {
  try {
    // Validate PayPal credentials
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error("PayPal credentials missing:", {
        clientIdSet: !!PAYPAL_CLIENT_ID,
        clientSecretSet: !!PAYPAL_CLIENT_SECRET,
      })

      return NextResponse.json(
        { error: "PayPal credentials are missing. Please check your environment variables." },
        { status: 500 },
      )
    }

    const { amount } = await req.json()
    const headersList = headers()

    // Get the host from headers to build absolute URLs
    const host = headersList.get("host") || "localhost:3000"
    const protocol = host.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create success and cancel URLs
    const successUrl = `${baseUrl}/payment-success?source=paypal`
    const cancelUrl = `${baseUrl}/pay-me?canceled=true`

    console.log("Creating standard PayPal order")
    console.log("Amount:", amount)
    console.log("Success URL:", successUrl)
    console.log("Cancel URL:", cancelUrl)

    // Create PayPal order
    const order = await createPayPalOrder(amount, successUrl, cancelUrl)

    // Find the approval URL
    const approvalLink = order.links?.find((link: any) => link.rel === "approve")?.href

    if (!approvalLink) {
      console.error("No approval link found in PayPal response:", order)
      throw new Error("No approval link found in PayPal response")
    }

    return NextResponse.json({
      orderId: order.id,
      approvalUrl: approvalLink,
    })
  } catch (error) {
    console.error("Error creating PayPal payment:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create PayPal payment" },
      { status: 500 },
    )
  }
}
