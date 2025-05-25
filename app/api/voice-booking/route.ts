import { type NextRequest, NextResponse } from "next/server"

// Mock providers data
const mockProviders = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Dr. Alex Smith",
    service_type: "doctor",
    location: "Downtown Medical Center, 123 Main St",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Dr. Maria Garcia",
    service_type: "doctor",
    location: "City Health Clinic, 456 Oak Ave",
  },
]

// Simple in-memory storage for credits (should match the credits API)
const userCredits: { [userId: string]: number } = {
  "550e8400-e29b-41d4-a716-446655440001": 10,
}

export async function POST(request: NextRequest) {
  try {
    const { transcript, userId } = await request.json()

    if (!transcript || !userId) {
      return NextResponse.json({ error: "Transcript and userId required" }, { status: 400 })
    }

    if (!(userId in userCredits)) {
      userCredits[userId] = 10
    }

    const currentCredits = userCredits[userId]

    if (currentCredits <= 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // Simple keyword-based parsing
    const bookingInfo = parseTranscriptLocally(transcript)

    // Use mock providers
    const providers = mockProviders.filter((p) => p.service_type === bookingInfo.serviceType)

    if (!providers?.length) {
      return NextResponse.json({
        error: `No providers found for ${bookingInfo.serviceType}`,
        bookingInfo,
        availableSlots: [],
      })
    }

    // Generate simple available slots
    const availableSlots = generateSimpleSlots(providers, bookingInfo)

    // Generate simple response
    const aiResponse = generateSimpleResponse(bookingInfo, availableSlots.length)

    // Deduct credit
    userCredits[userId] = Math.max(0, userCredits[userId] - 1)
    const remainingCredits = userCredits[userId]

    return NextResponse.json({
      success: true,
      bookingInfo,
      availableSlots: availableSlots.slice(0, 3),
      aiResponse,
      remainingCredits,
    })
  } catch (error) {
    console.error("Voice booking error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}

function parseTranscriptLocally(transcript: string) {
  const lowerTranscript = transcript.toLowerCase()

  let serviceType = "doctor" // default
  if (lowerTranscript.includes("dentist") || lowerTranscript.includes("dental")) {
    serviceType = "dentist"
  }

  return {
    serviceType,
    notes: transcript,
  }
}

function generateSimpleSlots(providers: any[], booking: any) {
  const slots = []
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  providers.forEach((provider, index) => {
    const date = new Date(tomorrow)
    date.setDate(tomorrow.getDate() + index)

    const times = ["09:00", "14:00", "16:00"]

    times.forEach((time) => {
      const endTime = `${(Number.parseInt(time.split(":")[0]) + 1).toString().padStart(2, "0")}:00`

      slots.push({
        provider_id: provider.id,
        provider_name: provider.name,
        provider_location: provider.location,
        date: date.toISOString().split("T")[0],
        start_time: time,
        end_time: endTime,
      })
    })
  })

  return slots
}

function generateSimpleResponse(bookingInfo: any, slotsCount: number) {
  const serviceTypeText = bookingInfo.serviceType.replace("_", " ")

  if (slotsCount === 0) {
    return `Sorry, I couldn't find any available ${serviceTypeText} appointments.`
  }

  return `Great! I found ${slotsCount} available ${serviceTypeText} appointments for you.`
}
