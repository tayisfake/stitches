import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.REDIS_URL!.replace("rediss://", "https://"),
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET() {
  try {
    // Test Redis connection
    await redis.set("test-key", "test-value")
    const value = await redis.get("test-key")
    await redis.del("test-key")

    return NextResponse.json({
      success: true,
      message: "Redis connection successful",
      test: value,
    })
  } catch (error) {
    console.error("Redis connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Redis",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
