import { supabase } from "./supabase"

// Adaptive Data Kernel (ADK) for learning user patterns
export class AdaptiveDataKernel {
  static async updateUserPattern(userId: string, patternType: string, patternData: any) {
    const { data: existingPattern } = await supabase
      .from("adk_patterns")
      .select("*")
      .eq("user_id", userId)
      .eq("pattern_type", patternType)
      .single()

    if (existingPattern) {
      // Update existing pattern with increased confidence and usage
      await supabase
        .from("adk_patterns")
        .update({
          pattern_data: patternData,
          usage_count: existingPattern.usage_count + 1,
          confidence_score: Math.min(0.99, existingPattern.confidence_score + 0.05),
          last_used: new Date().toISOString(),
        })
        .eq("id", existingPattern.id)
    } else {
      // Create new pattern
      await supabase.from("adk_patterns").insert({
        user_id: userId,
        pattern_type: patternType,
        pattern_data: patternData,
        confidence_score: 0.7,
      })
    }
  }

  static async getUserPatterns(userId: string) {
    const { data } = await supabase
      .from("adk_patterns")
      .select("*")
      .eq("user_id", userId)
      .order("confidence_score", { ascending: false })

    return data || []
  }
}

// Model Context Protocol (MCP) for priority decisions
export class ModelContextProtocol {
  static calculatePriority(factors: {
    urgency: "low" | "normal" | "high" | "emergency"
    userPreference: number
    providerAvailability: number
    historicalSuccess: number
  }): number {
    const urgencyWeights = { low: 1, normal: 2, high: 3, emergency: 5 }

    return (
      urgencyWeights[factors.urgency] * 0.4 +
      factors.userPreference * 0.3 +
      factors.providerAvailability * 0.2 +
      factors.historicalSuccess * 0.1
    )
  }

  static async prioritizeAppointmentOptions(options: any[], userId: string) {
    const userPatterns = await AdaptiveDataKernel.getUserPatterns(userId)

    return options
      .map((option) => ({
        ...option,
        priority: this.calculatePriority({
          urgency: option.urgency || "normal",
          userPreference: this.calculateUserPreference(option, userPatterns),
          providerAvailability: option.availabilityScore || 0.5,
          historicalSuccess: option.historicalSuccess || 0.5,
        }),
      }))
      .sort((a, b) => b.priority - a.priority)
  }

  private static calculateUserPreference(option: any, patterns: any[]): number {
    let score = 0.5

    patterns.forEach((pattern) => {
      if (pattern.pattern_type === "time_preference") {
        const preferredHours = pattern.pattern_data.preferred_hours || []
        const optionHour = new Date(`2000-01-01T${option.start_time}`).getHours()
        if (preferredHours.includes(optionHour)) {
          score += 0.2 * pattern.confidence_score
        }
      }
    })

    return Math.min(1, score)
  }
}

// Enhanced AI Scheduling Engine with local processing
export class AISchedulingEngine {
  static async processVoiceBooking(transcript: string, userId: string) {
    // Get user patterns for context
    const userPatterns = await AdaptiveDataKernel.getUserPatterns(userId)

    // Simple local processing instead of OpenAI
    const booking = this.parseTranscriptLocally(transcript, userPatterns)

    return booking
  }

  private static parseTranscriptLocally(transcript: string, userPatterns: any[]) {
    const lowerTranscript = transcript.toLowerCase()

    // Service type detection with pattern learning
    let serviceType = "doctor" // default

    // Check user patterns first
    const servicePattern = userPatterns.find((p) => p.pattern_type === "service_preference")
    if (servicePattern && servicePattern.confidence_score > 0.8) {
      serviceType = servicePattern.pattern_data.preferred_service || "doctor"
    }

    // Override with explicit mentions
    if (lowerTranscript.includes("dentist") || lowerTranscript.includes("dental")) {
      serviceType = "dentist"
    } else if (lowerTranscript.includes("hair") || lowerTranscript.includes("beauty")) {
      serviceType = "beauty_salon"
    } else if (lowerTranscript.includes("business") || lowerTranscript.includes("consultant")) {
      serviceType = "consultant"
    }

    // Urgency detection
    let urgency = "normal"
    if (lowerTranscript.includes("emergency") || lowerTranscript.includes("urgent")) {
      urgency = "high"
    }

    return {
      serviceType,
      urgency,
      notes: transcript,
    }
  }

  static async generateConversationalResponse(bookingInfo: any, availableSlots: any[]) {
    const serviceTypeText = bookingInfo.serviceType.replace("_", " ")
    const slotsCount = availableSlots.length

    if (slotsCount === 0) {
      return `I'm sorry, but I couldn't find any available ${serviceTypeText} appointments at the moment. Would you like to try a different service or time?`
    }

    const responses = [
      `Wonderful! I found ${slotsCount} available ${serviceTypeText} appointments. Here are your best options.`,
      `Great news! There are ${slotsCount} ${serviceTypeText} slots available. Let me show you the top choices.`,
      `Perfect! I've found ${slotsCount} ${serviceTypeText} appointments that work for you.`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  static async findOptimalSlots(booking: any, userId: string) {
    // Get available providers for the service type
    const { data: providers } = await supabase.from("providers").select("*").eq("service_type", booking.serviceType)

    if (!providers?.length) {
      throw new Error(`No providers found for ${booking.serviceType}`)
    }

    // Generate available slots for next 30 days
    const availableSlots = await this.generateAvailableSlots(providers, booking)

    // Use MCP to prioritize slots
    const prioritizedSlots = await ModelContextProtocol.prioritizeAppointmentOptions(availableSlots, userId)

    return prioritizedSlots.slice(0, 5) // Return top 5 options
  }

  private static async generateAvailableSlots(providers: any[], booking: any) {
    const slots = []
    const today = new Date()

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      for (const provider of providers) {
        const dayName = date.toLocaleDateString("en-US", { weekday: "lowercase" })
        const workingHours = provider.working_hours[dayName]

        if (workingHours) {
          const startHour = Number.parseInt(workingHours.start.split(":")[0])
          const endHour = Number.parseInt(workingHours.end.split(":")[0])

          for (let hour = startHour; hour < endHour; hour++) {
            // Check if slot is available (not booked)
            const { data: existingAppointment } = await supabase
              .from("appointments")
              .select("id")
              .eq("provider_id", provider.id)
              .eq("appointment_date", date.toISOString().split("T")[0])
              .eq("start_time", `${hour.toString().padStart(2, "0")}:00`)
              .single()

            if (!existingAppointment) {
              slots.push({
                provider_id: provider.id,
                provider_name: provider.name,
                provider_location: provider.location,
                date: date.toISOString().split("T")[0],
                start_time: `${hour.toString().padStart(2, "0")}:00`,
                end_time: `${(hour + 1).toString().padStart(2, "0")}:00`,
                availabilityScore: Math.random() * 0.5 + 0.5,
                urgency: booking.urgency,
              })
            }
          }
        }
      }
    }

    return slots
  }
}

// Agent-to-Agent Communication System
export class AgentCommunicationSystem {
  static async initiateA2AConflictResolution(appointmentId: string, conflictType: string) {
    const conflictMessage = {
      type: "conflict_detected",
      appointmentId,
      conflictType,
      timestamp: new Date().toISOString(),
      suggestedActions: this.generateLocalConflictResolutions(conflictType),
    }

    await supabase.from("agent_communications").insert({
      appointment_id: appointmentId,
      agent_type: "system_agent",
      message_type: "conflict_resolution",
      message_content: conflictMessage,
      priority_level: 4,
    })

    return conflictMessage
  }

  private static generateLocalConflictResolutions(conflictType: string) {
    const resolutions = {
      high_priority_booking: [
        "Notify provider of urgent appointment request",
        "Check for emergency time slots",
        "Offer expedited booking process",
      ],
      scheduling_conflict: [
        "Suggest alternative time slots",
        "Check provider availability",
        "Offer rescheduling options",
      ],
      default: ["Review appointment details", "Contact provider for confirmation", "Suggest alternative options"],
    }

    return resolutions[conflictType] || resolutions.default
  }

  static async processAgentMessage(agentType: string, messageType: string, content: any) {
    // Simple local response generation
    const responses = {
      conflict_resolution: `${agentType} has processed the ${messageType} and suggests reviewing the available options.`,
      booking_confirmation: `${agentType} confirms the booking request has been processed successfully.`,
      default: `${agentType} has received and processed the ${messageType} request.`,
    }

    return responses[messageType] || responses.default
  }
}
