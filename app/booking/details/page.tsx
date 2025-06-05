"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plane, User, CreditCard } from "lucide-react"

interface PassengerDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
}

export default function BookingDetailsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedFlight, setSelectedFlight] = useState<any>(null)
  const [passengers, setPassengers] = useState<PassengerDetails[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    // Load selected flight
    const flight = localStorage.getItem("selectedFlight")
    if (flight) {
      const flightData = JSON.parse(flight)
      setSelectedFlight(flightData)

      // Initialize passenger details
      setPassengers([
        {
          firstName: "",
          lastName: "",
          email: user?.email || "",
          phone: "",
          dateOfBirth: "",
          gender: "",
        },
      ])
    } else {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const updatePassenger = (index: number, field: string, value: string) => {
    const newPassengers = [...passengers]
    newPassengers[index] = { ...newPassengers[index], [field]: value }
    setPassengers(newPassengers)
  }

  const handleProceedToPayment = () => {
    // Validate passenger details
    const isValid = passengers.every(
      (passenger) =>
        passenger.firstName &&
        passenger.lastName &&
        passenger.email &&
        passenger.phone &&
        passenger.dateOfBirth &&
        passenger.gender,
    )

    if (!isValid) {
      alert("Please fill in all passenger details")
      return
    }

    // Store booking details
    const bookingDetails = {
      flight: selectedFlight,
      passengers,
      totalPrice: selectedFlight.price * passengers.length,
      bookingDate: new Date().toISOString(),
    }

    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails))
    router.push("/booking/payment")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !selectedFlight) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Passenger Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Passenger Details</span>
                </CardTitle>
                <CardDescription>Please provide details for all passengers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Passenger {index + 1}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          value={passenger.firstName}
                          onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          value={passenger.lastName}
                          onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={passenger.email}
                          onChange={(e) => updatePassenger(index, "email", e.target.value)}
                          placeholder="Enter email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={passenger.phone}
                          onChange={(e) => updatePassenger(index, "phone", e.target.value)}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={passenger.dateOfBirth}
                          onChange={(e) => updatePassenger(index, "dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                          value={passenger.gender}
                          onValueChange={(value) => updatePassenger(index, "gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Flight Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="h-5 w-5" />
                  <span>Flight Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{selectedFlight.airline}</span>
                  <span className="text-gray-600">{selectedFlight.flightNumber}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span className="font-medium">{selectedFlight.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="font-medium">{selectedFlight.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span className="font-medium">{selectedFlight.departureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arrival:</span>
                    <span className="font-medium">{selectedFlight.arrivalTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{selectedFlight.duration}</span>
                  </div>
                </div>

                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>₹{selectedFlight.price?.toLocaleString() || 2890}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{passengers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees:</span>
                    <span>₹{Math.floor(selectedFlight.price * 0.1 || 289).toLocaleString()}</span>
                  </div>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    ₹
                    {(
                      (selectedFlight.price || 2890 + Math.floor(selectedFlight.price || 2890 * 0.1 || 289)) *
                      passengers.length
                    ).toLocaleString()}
                  </span>
                </div>

                <Button onClick={handleProceedToPayment} className="w-full" size="lg">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
