"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, MapPin, Clock, Phone, Star, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProvidersPage() {
  const providers = [
    {
      id: "1",
      name: "Dr. Alex Smith",
      service_type: "doctor",
      location: "Downtown Medical Center, 123 Main St",
      phone: "(555) 100-0001",
      specialization: "Family Medicine",
      education: "MD - State University",
      years_experience: 10,
      rating: 4.5,
    },
    {
      id: "2",
      name: "Dr. Maria Garcia",
      service_type: "doctor",
      location: "City Health Clinic, 456 Oak Ave",
      phone: "(555) 100-0002",
      specialization: "Cardiology",
      education: "MD - Medical University",
      years_experience: 15,
      rating: 4.8,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VoiceSchedule AI
                </h1>
                <p className="text-sm text-gray-600">Service Providers</p>
              </div>
            </Link>

            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Service Providers</h2>
          <p className="text-lg text-gray-600">Discover top-rated professionals ready to serve you</p>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <Card key={provider.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">{provider.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏥</span>
                        <span className="text-gray-600 capitalize">{provider.specialization}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{provider.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{provider.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">9:00 AM - 5:00 PM</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{provider.phone}</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Education:</strong> {provider.education}
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Experience:</strong> {provider.years_experience} years
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Link href="/" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Book Now
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
