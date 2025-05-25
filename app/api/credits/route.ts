import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for credits
const userCredits: { [userId: string]: number } = {
  "550e8400-e29b-41d4-a716-446655440001": 10,
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    if (!(userId in userCredits)) {
      userCredits[userId] = 10
    }

    const credits = userCredits[userId]
    return NextResponse.json({ credits })
  } catch (error) {
    console.error("Credits fetch error:", error)
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, amount } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    if (!(userId in userCredits)) {
      userCredits[userId] = 10
    }

    let newCredits: number

    switch (action) {
      case "add":
        userCredits[userId] += amount || 0
        newCredits = userCredits[userId]
        break
      case "deduct":
        userCredits[userId] = Math.max(0, userCredits[userId] - (amount || 1))
        newCredits = userCredits[userId]
        break
      case "set":
        userCredits[userId] = amount || 0
        newCredits = userCredits[userId]
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true, credits: newCredits })
  } catch (error) {
    console.error("Credits update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
