import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST() {
  try {
    let code = generateCode()
    let attempts = 0
    const maxAttempts = 10

    // Ensure the generated code is unique
    while (attempts < maxAttempts) {
      const exists = await redis.exists(`referral:${code}`)
      if (!exists) {
        // Initialize the referral code with a usage count of 0
        await redis.set(`referral:${code}`, 0)
        console.log("Created new referral code:", code)

        return NextResponse.json({
          success: true,
          code,
        })
      }

      code = generateCode()
      attempts++
    }

    throw new Error("Failed to generate a unique referral code")
  } catch (error) {
    console.error("Error generating referral code:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate referral code",
      },
      { status: 500 },
    )
  }
}
