import { NextResponse } from "next/server"
import { capturePayPalOrder } from "@/lib/paypal-api"

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Capture the PayPal order
    const captureData = await capturePayPalOrder(orderId)

    return NextResponse.json({
      success: true,
      captureId: captureData.id,
      status: captureData.status,
    })
  } catch (error) {
    console.error("Error capturing PayPal payment:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to capture PayPal payment" },
      { status: 500 },
    )
  }
}
