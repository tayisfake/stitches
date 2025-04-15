import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.REDIS_URL!.replace("rediss://", "https://"),
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET() {
  try {
    // Test Redis connection
    const testCode = "TEST" + Math.random().toString(36).substring(2, 6).toUpperCase()

    // Test setting a referral code
    await redis.set(`referral:${testCode}`, "0")
    console.log("Successfully set test referral code:", testCode)

    // Test retrieving the referral code
    const exists = await redis.exists(`referral:${testCode}`)
    console.log("Test referral code exists:", exists)

    // Test incrementing the count
    const newCount = await redis.incr(`referral:${testCode}`)
    console.log("Incremented count:", newCount)

    // Clean up test data
    await redis.del(`referral:${testCode}`)

    return NextResponse.json({
      success: true,
      message: "Redis connection and operations successful",
      details: {
        testCode,
        existed: exists === 1,
        incrementedCount: newCount,
      },
    })
  } catch (error) {
    console.error("Redis test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test Redis connection",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
