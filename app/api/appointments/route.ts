import { type NextRequest, NextResponse } from "next/server"

// Mock appointments storage
const mockAppointments: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const required = ["user_id", "provider_id", "appointment_date", "start_time", "end_time"]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing ${field}` }, { status: 400 })
      }
    }

    const appointmentId = `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const appointment = {
      id: appointmentId,
      user_id: body.user_id,
      provider_id: body.provider_id,
      appointment_date: body.appointment_date,
      start_time: body.start_time,
      end_time: body.end_time,
      status: "scheduled",
      service_type: body.service_type || "consultation",
      notes: body.notes || "Voice booking",
      booking_method: "voice",
      created_at: new Date().toISOString(),
      provider: {
        name: "Dr. Alex Smith",
        location: "Downtown Medical Center",
      },
    }

    mockAppointments.push(appointment)

    return NextResponse.json({ success: true, appointment })
  } catch (error) {
    console.error("Appointment creation error:", error)
    return NextResponse.json({ error: "Creation failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const userAppointments = mockAppointments
      .filter((apt) => apt.user_id === userId)
      .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())

    return NextResponse.json({ appointments: userAppointments })
  } catch (error) {
    console.error("Appointments fetch error:", error)
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 })
  }
}
