import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const COOLDOWN_SECONDS = 3 // 3 seconds cooldown
const TICKET_CATEGORY_ID = "1340150719143084054"
const MAX_CONCURRENT_TICKETS = 3

async function checkUserInServer(userId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    )
    return response.ok
  } catch (error) {
    console.error("Error checking user in server:", error)
    return false
  }
}

async function getUserActiveTickets(userId: string): Promise<string[]> {
  try {
    const tickets = (await redis.get(`userTickets:${userId}`)) as string[]
    return tickets || []
  } catch (error) {
    console.error("Error getting user tickets:", error)
    return []
  }
}

async function createTicket(userId: string, exchangeData: any): Promise<string | null> {
  try {
    // Check concurrent ticket limit
    const activeTickets = await getUserActiveTickets(userId)
    if (activeTickets.length >= MAX_CONCURRENT_TICKETS) {
      // Send DM to user about limit
      await fetch(`https://discord.com/api/v10/users/@me/channels`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient_id: userId,
        }),
      }).then(async (dmChannel) => {
        const channelData = await dmChannel.json()
        await fetch(`https://discord.com/api/v10/channels/${channelData.id}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `You have reached the maximum limit of ${MAX_CONCURRENT_TICKETS} concurrent tickets. Please close some of your existing tickets before creating a new one.`,
          }),
        })
      })
      throw new Error(`Maximum concurrent ticket limit (${MAX_CONCURRENT_TICKETS}) reached`)
    }

    const ticketNumber = await redis.incr("ticketCounter")
    const response = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/channels`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `ticket-${ticketNumber}`,
        type: 0,
        parent_id: TICKET_CATEGORY_ID,
        permission_overwrites: [
          {
            id: process.env.DISCORD_GUILD_ID,
            type: 0,
            deny: "1024",
          },
          {
            id: userId,
            type: 1,
            allow: "1024",
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create ticket: ${response.status} ${response.statusText}`)
    }

    const channelData = await response.json()
    await sendExchangeDataToChannel(channelData.id, exchangeData, ticketNumber)

    // Update user's active tickets
    await redis.set(`userTickets:${userId}`, [...activeTickets, channelData.id])

    return channelData.id
  } catch (error) {
    console.error("Error creating ticket:", error)
    return null
  }
}

async function sendExchangeDataToChannel(channelId: string, exchangeData: any, ticketNumber: number) {
  try {
    const { sendCurrency, getCurrency, amount, paymentMethod, network, discordId } = exchangeData
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `<@${discordId}>, your exchange request has been received. Ticket number: ${ticketNumber}\n<@&1339841462916874241>`,
        embeds: [
          {
            title: "New Exchange Request",
            fields: [
              { name: "Send Currency", value: sendCurrency.toUpperCase(), inline: true },
              { name: "Get Currency", value: getCurrency.toUpperCase(), inline: true },
              { name: "Amount", value: amount, inline: true },
              { name: "Payment Method", value: paymentMethod, inline: true },
              { name: "Network", value: network || "N/A", inline: true },
              { name: "Discord ID", value: discordId, inline: true },
            ],
            color: 16711680,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send exchange data to channel: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error sending exchange data to channel:", error)
  }
}

async function sendErrorMessage(userId: string) {
  try {
    const response = await fetch(`https://discord.com/api/v10/channels/1340153248992202823/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `User is not in the server. User ID: ${userId}`,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send error message: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error sending error message:", error)
  }
}

export async function POST(req: Request) {
  const exchangeData = await req.json()
  const { discordId } = exchangeData

  try {
    if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_GUILD_ID) {
      throw new Error("Missing required environment variables")
    }

    // Check cooldown
    const lastExchange = await redis.get(`lastExchange:${discordId}`)
    const now = Date.now()
    if (lastExchange && now - Number(lastExchange) < COOLDOWN_SECONDS * 1000) {
      const remainingTime = Math.ceil((COOLDOWN_SECONDS * 1000 - (now - Number(lastExchange))) / 1000)
      return NextResponse.json(
        { success: false, error: `Please wait ${remainingTime} seconds before initiating another exchange.` },
        { status: 429 },
      )
    }

    // Check if user is in the server
    const isUserInServer = await checkUserInServer(discordId)

    if (!isUserInServer) {
      await sendErrorMessage(discordId)
      return NextResponse.json({ success: false, error: "User is not in the server" }, { status: 404 })
    }

    // Check concurrent ticket limit
    const activeTickets = await getUserActiveTickets(discordId)
    if (activeTickets.length >= MAX_CONCURRENT_TICKETS) {
      return NextResponse.json(
        {
          success: false,
          error: `You have reached the maximum limit of ${MAX_CONCURRENT_TICKETS} concurrent tickets.`,
        },
        { status: 429 },
      )
    }

    // Create ticket and send exchange data
    const ticketChannelId = await createTicket(discordId, exchangeData)

    if (!ticketChannelId) {
      throw new Error("Failed to create ticket")
    }

    // Update cooldown
    await redis.set(`lastExchange:${discordId}`, now, { ex: COOLDOWN_SECONDS })

    return NextResponse.json({ success: true, ticketChannelId })
  } catch (error) {
    console.error("Error processing exchange data:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}

