"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Star, Crown, CreditCard, Check } from "lucide-react"
import Link from "next/link"

export default function CreditsPage() {
  const [currentCredits, setCurrentCredits] = useState(10)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const creditPlans = [
    {
      id: "starter",
      name: "Starter Pack",
      credits: 25,
      price: 799,
      popular: false,
      icon: Zap,
      color: "from-blue-500 to-blue-600",
      features: ["25 Voice Bookings", "Basic AI Support", "Email Notifications"],
    },
    {
      id: "popular",
      name: "Popular Choice",
      credits: 100,
      price: 2499,
      popular: true,
      icon: Star,
      color: "from-purple-500 to-pink-600",
      features: ["100 Voice Bookings", "Advanced AI Learning", "Priority Support", "SMS Notifications"],
    },
    {
      id: "premium",
      name: "Premium Pack",
      credits: 250,
      price: 4999,
      popular: false,
      icon: Crown,
      color: "from-yellow-500 to-orange-600",
      features: [
        "250 Voice Bookings",
        "Premium AI Features",
        "24/7 Priority Support",
        "All Notification Types",
        "Advanced Analytics",
      ],
    },
  ]

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId)
    const plan = creditPlans.find((p) => p.id === planId)

    if (plan) {
      // Simulate purchase
      setTimeout(() => {
        setCurrentCredits((prev) => prev + plan.credits)
        alert(`Successfully purchased ${plan.credits} credits for ₹${plan.price.toLocaleString("en-IN")}!`)
        setSelectedPlan(null)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VoiceSchedule AI
                </h1>
                <p className="text-sm text-gray-600">Voice Credits</p>
              </div>
            </Link>

            <Link href="/">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">Power Up Your Voice</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get more voice credits to unlock unlimited appointment booking with our AI assistant
          </p>
        </div>

        {/* Current Credits */}
        <Card className="max-w-md mx-auto border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <Zap className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Current Credits</h3>
            <p className="text-4xl font-bold mb-2">{currentCredits}</p>
            <p className="text-blue-100">Voice bookings remaining</p>
          </CardContent>
        </Card>

        {/* Credit Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creditPlans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <Card
                key={plan.id}
                className={`relative border-0 shadow-xl hover:shadow-2xl transition-shadow ${
                  plan.popular ? "ring-4 ring-purple-400 ring-opacity-50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 font-bold">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className={`bg-gradient-to-r ${plan.color} text-white rounded-t-lg p-8`}>
                  <div className="text-center">
                    <IconComponent className="h-12 w-12 mx-auto mb-4" />
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">₹{plan.price.toLocaleString("en-IN")}</span>
                      <p className="text-lg opacity-90">{plan.credits} credits</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8 bg-white">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={selectedPlan === plan.id}
                    className={`w-full py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${plan.color}`}
                  >
                    {selectedPlan === plan.id ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Purchase Now
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    ₹{(plan.price / plan.credits).toFixed(2)} per voice booking
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Payment Methods */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Secure Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center items-center gap-8 text-gray-600">
              <div className="text-center">
                <div className="text-2xl mb-2">💳</div>
                <span className="text-sm">Credit/Debit Cards</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <span className="text-sm">UPI</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🏦</div>
                <span className="text-sm">Net Banking</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📲</div>
                <span className="text-sm">Digital Wallets</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
