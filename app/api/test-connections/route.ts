import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.REDIS_URL!.replace("rediss://", "https://"),
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const BOT_URL = process.env.DISCORD_BOT_URL || "http://192.99.207.143:3000"

export async function GET() {
  try {
    // Test Redis connection
    const testKey = "test-connection-" + Date.now()
    await redis.set(testKey, "test-value")
    const redisValue = await redis.get(testKey)
    await redis.del(testKey)

    // Test Bot connection
    const botResponse = await fetch(`${BOT_URL}/health`)
    const botData = await botResponse.json()

    // Generate a test referral code
    const referralCode = await generateReferralCode()

    // Validate the generated referral code
    const isValidReferral = await validateReferralCode(referralCode)

    return NextResponse.json({
      success: true,
      redis: {
        connected: redisValue === "test-value",
        value: redisValue,
      },
      bot: {
        connected: botData.status === "OK",
        message: botData.message,
      },
      referral: {
        code: referralCode,
        isValid: isValidReferral,
      },
    })
  } catch (error) {
    console.error("Test connections error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test connections",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

async function generateReferralCode() {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  await redis.set(`referral:${code}`, "0")
  return code
}

async function validateReferralCode(code: string) {
  const exists = await redis.exists(`referral:${code}`)
  return exists === 1
}
