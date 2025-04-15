import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ valid: false, error: "No referral code provided" }, { status: 400 })
    }

    const usageCount = await redis.get(`referral:${code}`)

    if (usageCount !== null) {
      // Increment usage count
      await redis.incr(`referral:${code}`)

      return NextResponse.json({
        valid: true,
        usageCount: Number(usageCount) + 1,
      })
    } else {
      return NextResponse.json({ valid: false, error: "Invalid referral code" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error validating referral code:", error)
    return NextResponse.json(
      {
        valid: false,
        error: "Failed to validate referral code",
      },
      { status: 500 },
    )
  }
}
