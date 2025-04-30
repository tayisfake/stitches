// PayPal API configuration
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || ""
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || ""

// Determine the API URL based on environment
export const PAYPAL_API_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// Log configuration on load (without exposing secrets)
console.log("PayPal Configuration:")
console.log("- API URL:", PAYPAL_API_URL)
console.log("- Client ID available:", !!PAYPAL_CLIENT_ID)
console.log("- Client Secret available:", !!PAYPAL_CLIENT_SECRET)
console.log("- Environment:", process.env.NODE_ENV || "development")
