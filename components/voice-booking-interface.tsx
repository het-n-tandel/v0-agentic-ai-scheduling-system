"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, Calendar, Clock, MapPin, User, Zap, CheckCircle, AlertCircle } from "lucide-react"

interface VoiceBookingInterfaceProps {
  userId: string
  onBookingComplete: (booking: any) => void
}

export default function VoiceBookingInterface({ userId, onBookingComplete }: VoiceBookingInterfaceProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [bookingState, setBookingState] = useState<
    "idle" | "listening" | "processing" | "confirming" | "booking" | "success" | "error"
  >("idle")
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [currentBooking, setCurrentBooking] = useState<any>(null)
  const [credits, setCredits] = useState(10)
  const [error, setError] = useState("")

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  useEffect(() => {
    loadCredits()
    initializeSpeech()
  }, [])

  const loadCredits = async () => {
    try {
      const response = await fetch(`/api/credits?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setCredits(data.credits)
      }
    } catch (error) {
      console.error("Error loading credits:", error)
    }
  }

  const initializeSpeech = () => {
    if (typeof window !== "undefined") {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const result = event.results[0][0].transcript
          setTranscript(result)
          processVoiceInput(result)
        }

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setError("")
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          setIsListening(false)
          if (event.error !== "no-speech") {
            setError(`Speech recognition error: ${event.error}`)
            setBookingState("error")
          } else {
            setBookingState("idle")
          }
        }
      } else {
        setError("Speech recognition not supported in this browser")
        setBookingState("error")
      }

      // Initialize speech synthesis
      synthRef.current = window.speechSynthesis
    }
  }

  const startListening = () => {
    if (credits <= 0) {
      setError("No credits remaining. Please purchase more credits.")
      setBookingState("error")
      return
    }

    if (!recognitionRef.current) {
      setError("Speech recognition not available")
      setBookingState("error")
      return
    }

    setBookingState("listening")
    setTranscript("")
    setAiResponse("")
    setError("")
    setAvailableSlots([])

    try {
      recognitionRef.current.start()
      speak("Hello! What appointment would you like to book today?")
    } catch (err) {
      setError("Could not start voice recognition")
      setBookingState("error")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setBookingState("idle")
  }

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(true)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
      setAiResponse(text)
    }
  }

  const processVoiceInput = async (inputTranscript: string) => {
    setBookingState("processing")

    try {
      const response = await fetch("/api/voice-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: inputTranscript, userId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setCurrentBooking(data.bookingInfo)
        setAvailableSlots(data.availableSlots || [])

        // Update credits from response
        if (typeof data.remainingCredits === "number") {
          setCredits(data.remainingCredits)
        }

        setBookingState("confirming")

        const responseText = data.aiResponse || `Found ${data.availableSlots?.length || 0} available appointments.`
        speak(responseText)
      } else if (response.status === 402) {
        setError("Insufficient credits. Please purchase more credits.")
        setBookingState("error")
        speak("You don't have enough credits. Please purchase more credits to continue.")
      } else {
        throw new Error(data.error || "Failed to process request")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Processing failed"
      setError(errorMessage)
      setBookingState("error")
      speak("Sorry, I couldn't process your request. Please try again.")
    }
  }

  const confirmBooking = async (slotIndex: number) => {
    if (availableSlots.length <= slotIndex) return

    setBookingState("booking")

    const selectedSlot = availableSlots[slotIndex]
    const appointmentData = {
      user_id: userId,
      provider_id: selectedSlot.provider_id,
      appointment_date: selectedSlot.date,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      service_type: currentBooking?.serviceType || "consultation",
      notes: currentBooking?.notes || "Voice booking",
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setBookingState("success")
        onBookingComplete(appointmentData)
        speak(`Appointment booked successfully with ${selectedSlot.provider_name}!`)

        setTimeout(() => resetBooking(), 3000)
      } else {
        throw new Error(result.error || "Booking failed")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Booking failed"
      setError(errorMessage)
      setBookingState("error")
      speak("Sorry, booking failed. Please try again.")
    }
  }

  const resetBooking = () => {
    setBookingState("idle")
    setTranscript("")
    setAiResponse("")
    setAvailableSlots([])
    setCurrentBooking(null)
    setError("")
    setIsListening(false)
    setIsSpeaking(false)
  }

  const tryAgain = () => {
    setError("")
    setBookingState("idle")
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Credits */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">Voice Credits</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{credits}</span>
              <Button variant="secondary" size="sm" onClick={loadCredits} className="text-blue-600 hover:text-blue-700">
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-2xl text-gray-800">Voice Appointment Booking</CardTitle>
          <p className="text-gray-600">Click the microphone and speak your appointment request</p>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Voice Button */}
          <div className="flex justify-center">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={credits <= 0 || bookingState === "processing" || bookingState === "booking"}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className={`w-32 h-32 rounded-full ${
                bookingState === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : bookingState === "error"
                    ? "bg-red-600 hover:bg-red-700"
                    : isListening
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              }`}
            >
              {bookingState === "success" ? (
                <CheckCircle className="h-12 w-12" />
              ) : bookingState === "error" ? (
                <AlertCircle className="h-12 w-12" />
              ) : isListening ? (
                <MicOff className="h-12 w-12" />
              ) : isSpeaking ? (
                <Volume2 className="h-12 w-12" />
              ) : (
                <Mic className="h-12 w-12" />
              )}
            </Button>
          </div>

          {/* Status */}
          <div className="text-center">
            <Badge
              variant="outline"
              className={`px-4 py-2 text-base ${bookingState === "error" ? "border-red-500 text-red-700" : ""}`}
            >
              {bookingState === "idle" && "Ready to listen"}
              {bookingState === "listening" && "Listening..."}
              {bookingState === "processing" && "Processing..."}
              {bookingState === "confirming" && "Please confirm appointment"}
              {bookingState === "booking" && "Booking appointment..."}
              {bookingState === "success" && "Appointment booked successfully!"}
              {bookingState === "error" && "Error occurred"}
            </Badge>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-center space-y-4">
              <Badge variant="destructive" className="px-4 py-2">
                {error}
              </Badge>
              <div className="flex gap-2 justify-center">
                <Button onClick={tryAgain} variant="outline">
                  Try Again
                </Button>
                {error.includes("credits") && (
                  <Button
                    onClick={() => (window.location.href = "/credits")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Buy Credits
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Success Actions */}
          {bookingState === "success" && (
            <div className="flex justify-center">
              <Button onClick={resetBooking} className="bg-green-600 hover:bg-green-700">
                Book Another Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcript and Response */}
      {(transcript || aiResponse) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transcript && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  You said:
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-700">{transcript}</p>
              </CardContent>
            </Card>
          )}

          {aiResponse && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  AI Response:
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-700">{aiResponse}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Available Slots */}
      {availableSlots.length > 0 && bookingState === "confirming" && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Available Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {availableSlots.slice(0, 3).map((slot, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  index === 0 ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold text-gray-800">{slot.provider_name}</span>
                      {index === 0 && <Badge className="bg-green-600 text-white">Recommended</Badge>}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(slot.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {slot.start_time} - {slot.end_time}
                        </span>
                      </div>
                    </div>

                    {slot.provider_location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{slot.provider_location}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => confirmBooking(index)}
                    disabled={bookingState === "booking"}
                    className={`${
                      index === 0
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    }`}
                  >
                    {bookingState === "booking" ? "Booking..." : "Book This"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
