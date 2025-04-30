import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
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

    // Capture order
    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json()
      console.error("PayPal capture error:", errorData)
      return NextResponse.json(
        { error: `Failed to capture PayPal order: ${captureResponse.status} ${captureResponse.statusText}` },
        { status: captureResponse.status },
      )
    }

    const captureData = await captureResponse.json()
    return NextResponse.json(captureData)
  } catch (error) {
    console.error("Error capturing PayPal order:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to capture PayPal order" },
      { status: 500 },
    )
  }
}
