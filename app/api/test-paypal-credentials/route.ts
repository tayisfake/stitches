import { NextResponse } from "next/server"
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL } from "@/lib/paypal-config"

export async function GET() {
  try {
    // Check if credentials are set
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({
        success: false,
        error: "PayPal credentials are missing",
        details: {
          clientIdSet: !!PAYPAL_CLIENT_ID,
          clientSecretSet: !!PAYPAL_CLIENT_SECRET,
          apiUrl: PAYPAL_API_URL,
        },
      })
    }

    // Create the auth string
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

    // Make a test request to the PayPal API
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { raw_response: errorText }
      }

      return NextResponse.json({
        success: false,
        error: `PayPal authentication failed: ${response.status} ${response.statusText}`,
        details: errorData,
      })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: "PayPal credentials are valid",
      details: {
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        appId: data.app_id,
      },
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Error testing PayPal credentials",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
