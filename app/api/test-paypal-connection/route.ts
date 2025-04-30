import { NextResponse } from "next/server"
import { getPayPalAccessToken } from "@/lib/paypal-api"
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL } from "@/lib/paypal-config"

export async function GET() {
  try {
    // Check if PayPal credentials are set
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

    // Try to get an access token
    const accessToken = await getPayPalAccessToken()

    return NextResponse.json({
      success: true,
      message: "PayPal connection successful",
      details: {
        apiUrl: PAYPAL_API_URL,
        accessTokenReceived: !!accessToken,
        tokenLength: accessToken ? accessToken.length : 0,
      },
    })
  } catch (error) {
    console.error("PayPal connection test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to PayPal",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
