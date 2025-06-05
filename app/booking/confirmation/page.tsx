"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Home, Plane, Calendar, User } from "lucide-react"

export default function ConfirmationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    const bookingId = searchParams.get("id")
    if (bookingId) {
      // Load booking details
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]")
      const foundBooking = bookings.find((b: any) => b.id === bookingId)
      if (foundBooking) {
        setBooking(foundBooking)
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/dashboard")
    }
  }, [user, loading, router, searchParams])

  const downloadTicket = () => {
    // In a real app, this would generate a PDF ticket
    alert("Ticket download functionality would be implemented here")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !booking) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your flight has been successfully booked</p>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Flight Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="h-5 w-5" />
                  <span>Flight Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{booking.flight.airline}</span>
                  <Badge variant="secondary">{booking.flight.flightNumber}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{booking.flight.departureTime}</div>
                    <div className="text-gray-600">{booking.flight.from}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{booking.flight.arrivalTime}</div>
                    <div className="text-gray-600">{booking.flight.to}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Duration: {booking.flight.duration}</span>
                  <span>
                    {booking.flight.stops === 0
                      ? "Non-stop"
                      : `${booking.flight.stops} stop${booking.flight.stops > 1 ? "s" : ""}`}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Booking Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono font-semibold">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Date:</span>
                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="default" className="bg-green-500">
                      Confirmed
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{booking.passengers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-green-600">₹{booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Passenger Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Passenger Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.passengers.map((passenger: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Passenger {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <div className="font-medium">
                          {passenger.firstName} {passenger.lastName}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <div className="font-medium">{passenger.email}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <div className="font-medium">{passenger.phone}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  • Please arrive at the airport at least 2 hours before domestic flights and 3 hours before
                  international flights.
                </p>
                <p>• Carry a valid government-issued photo ID for check-in.</p>
                <p>• Check-in opens 24 hours before departure and closes 1 hour before departure.</p>
                <p>• Baggage allowance: 15kg for domestic flights, 23kg for international flights.</p>
                <p>• For any changes or cancellations, please contact customer support.</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={downloadTicket} variant="outline" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Download Ticket
            </Button>
            <Button onClick={() => router.push("/dashboard")} size="lg">
              <Home className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
