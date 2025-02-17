import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const botUrl = process.env.NEXT_PUBLIC_BOT_URL || "http://192.99.207.143:3000"

    console.log("Sending chat message to bot:", data)

    const response = await fetch(`${botUrl}/chat-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error from bot:", errorData)
      return NextResponse.json({ error: errorData.error || "Failed to send message" }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in send-chat-message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

