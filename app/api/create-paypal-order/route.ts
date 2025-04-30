import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error("PayPal credentials missing")
      return NextResponse.json(
        { error: "PayPal credentials are missing. Please check your environment variables." },
        { status: 500 },
      )
    }

    // Get access token
    const authResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.error("PayPal auth error:", errorText)
      return NextResponse.json(
        { error: `PayPal authentication failed: ${authResponse.status} ${authResponse.statusText}` },
        { status: authResponse.status },
      )
    }

    const auth = await authResponse.json()
    const accessToken = auth.access_token

    // Create order
    const orderResponse = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
            description: "Stitches Exchanges Payment",
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      console.error("PayPal order creation error:", errorData)
      return NextResponse.json(
        { error: `Failed to create PayPal order: ${orderResponse.status} ${orderResponse.statusText}` },
        { status: orderResponse.status },
      )
    }

    const order = await orderResponse.json()
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create PayPal order" },
      { status: 500 },
    )
  }
}
