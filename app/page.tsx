"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mic, Zap, Users, CreditCard } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [credits, setCredits] = useState(10)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState("")

  const startVoiceBooking = () => {
    if (credits <= 0) {
      setError("No credits remaining. Please purchase more credits.")
      return
    }

    setIsListening(true)
    setError("")

    // Simulate voice recognition
    setTimeout(() => {
      setTranscript("I need a doctor appointment tomorrow morning")
      setCredits((prev) => prev - 1)
      setIsListening(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VoiceSchedule AI
                </h1>
                <p className="text-sm text-gray-600">Intelligent Appointment Booking</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/providers">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Providers
                </Button>
              </Link>
              <Link href="/appointments">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Appointments
                </Button>
              </Link>
              <Link href="/credits">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Buy Credits
                </Button>
              </Link>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Zap className="h-3 w-3 mr-1" />
                {credits} Credits
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8">
          <h2 className="text-4xl font-bold text-gray-900">
            Book Appointments with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Voice AI</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience intelligent appointment booking with our AI-powered voice assistant
          </p>
        </div>

        {/* Voice Booking Interface */}
        <Card className="max-w-4xl mx-auto border-0 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="text-2xl text-gray-800">Voice Appointment Booking</CardTitle>
            <p className="text-gray-600">Click the microphone and speak your appointment request</p>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Credits Display */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <span className="font-semibold">Voice Credits</span>
                  </div>
                  <span className="text-2xl font-bold">{credits}</span>
                </div>
              </CardContent>
            </Card>

            {/* Voice Button */}
            <div className="flex justify-center">
              <Button
                onClick={startVoiceBooking}
                disabled={credits <= 0 || isListening}
                size="lg"
                className={`w-32 h-32 rounded-full ${
                  isListening
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }`}
              >
                <Mic className="h-12 w-12" />
              </Button>
            </div>

            {/* Status */}
            <div className="text-center">
              <Badge variant="outline" className="px-4 py-2 text-base">
                {isListening ? "Listening..." : "Ready to listen"}
              </Badge>
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-center space-y-4">
                <Badge variant="destructive" className="px-4 py-2">
                  {error}
                </Badge>
                <Link href="/credits">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Buy Credits
                  </Button>
                </Link>
              </div>
            )}

            {/* Transcript */}
            {transcript && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-lg">You said:</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700">{transcript}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium">Total Appointments</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 font-medium">Available Providers</p>
                  <p className="text-3xl font-bold">5</p>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 font-medium">Voice Credits</p>
                  <p className="text-3xl font-bold">{credits}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 font-medium">AI Accuracy</p>
                  <p className="text-3xl font-bold">95%</p>
                </div>
                <Mic className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/appointments">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-bold text-xl text-gray-900 mb-2">Manage Appointments</h3>
                <p className="text-gray-600">View, edit, and manage all your appointments</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/providers">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-bold text-xl text-gray-900 mb-2">Browse Providers</h3>
                <p className="text-gray-600">Discover service providers in your area</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/credits">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                <h3 className="font-bold text-xl text-gray-900 mb-2">Buy Credits</h3>
                <p className="text-gray-600">Get more voice credits for unlimited bookings</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
