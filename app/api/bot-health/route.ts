import { NextResponse } from "next/server"

const DEFAULT_BOT_URL = "http://192.99.207.143:3000"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const botUrl = searchParams.get("botUrl") || process.env.DISCORD_BOT_URL || DEFAULT_BOT_URL

  if (!botUrl) {
    console.error("Bot URL is not provided")
    return NextResponse.json({ success: false, error: "Bot URL is not configured" }, { status: 400 })
  }

  // Ensure the URL has a protocol
  // Removed as per update instructions

  console.log("Attempting to connect to bot at:", botUrl)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${botUrl}/health`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })

    clearTimeout(timeout)

    const responseText = await response.text()
    console.log("Raw bot response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse bot response:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid response from bot",
          details: responseText,
          botUrl: botUrl,
        },
        { status: 502 },
      )
    }

    if (!response.ok) {
      console.error("Bot returned error status:", response.status, data)
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Bot returned error status",
          status: response.status,
          botUrl: botUrl,
        },
        { status: response.status },
      )
    }

    console.log("Bot health check successful:", data)
    return NextResponse.json({
      success: true,
      status: data.status,
      message: data.message,
      botUrl: botUrl,
    })
  } catch (error) {
    console.error("Error checking bot health:", error)

    const isNetworkError =
      error instanceof TypeError && (error.message.includes("fetch failed") || error.message.includes("network"))

    return NextResponse.json(
      {
        success: false,
        error: isNetworkError
          ? "Could not connect to bot - please verify the bot is running and accessible"
          : "An unexpected error occurred checking bot health",
        details: error instanceof Error ? error.message : String(error),
        botUrl: botUrl,
      },
      { status: isNetworkError ? 503 : 500 },
    )
  }
}

