import { PAYPAL_API_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "./paypal-config"

// Function to get PayPal access token
export async function getPayPalAccessToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("PayPal credentials are missing. Please check your environment variables.")
    }

    console.log("PayPal API URL:", PAYPAL_API_URL)
    console.log("Client ID available:", !!PAYPAL_CLIENT_ID)
    console.log("Client Secret available:", !!PAYPAL_CLIENT_SECRET)

    // Create the auth string - this needs to be properly formatted
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

    // Log the request details (without showing the full auth token)
    console.log("Making PayPal auth request to:", `${PAYPAL_API_URL}/v1/oauth2/token`)

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    })

    // Log the response status
    console.log("PayPal auth response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { raw_response: errorText }
      }

      console.error("PayPal authentication error details:", errorData)
      throw new Error(`PayPal authentication failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Successfully obtained PayPal access token")
    return data.access_token
  } catch (error) {
    console.error("Error getting PayPal access token:", error)
    throw new Error(`Failed to authenticate with PayPal: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Function to create a standard PayPal order
export async function createPayPalOrder(amount: number, successUrl: string, cancelUrl: string) {
  try {
    const accessToken = await getPayPalAccessToken()

    // Standard PayPal checkout request body
    const requestBody = {
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
        return_url: successUrl,
        cancel_url: cancelUrl,
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }

    console.log("Creating PayPal order with request:", JSON.stringify(requestBody))

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    })

    // Log the response status
    console.log("PayPal order creation response status:", response.status)

    const responseText = await response.text()
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse PayPal response:", responseText)
      throw new Error("Invalid response from PayPal")
    }

    if (!response.ok) {
      console.error("PayPal order creation error:", data)
      throw new Error(`Failed to create PayPal order: ${response.status} ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    throw error
  }
}

// Function to capture a PayPal order
export async function capturePayPalOrder(orderId: string) {
  try {
    const accessToken = await getPayPalAccessToken()

    console.log("Capturing PayPal order:", orderId)

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // Log the response status
    console.log("PayPal capture response status:", response.status)

    const responseText = await response.text()
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse PayPal capture response:", responseText)
      throw new Error("Invalid response from PayPal")
    }

    if (!response.ok) {
      console.error("PayPal capture error:", data)
      throw new Error(`Failed to capture PayPal order: ${response.status} ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("Error capturing PayPal order:", error)
    throw error
  }
}
