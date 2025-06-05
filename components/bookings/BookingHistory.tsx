"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Calendar, Download } from "lucide-react"

interface BookingHistoryProps {
  bookings: any[]
}

export default function BookingHistory({ bookings }: BookingHistoryProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
        <p className="text-gray-600">Start exploring flights to make your first booking!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-lg">{booking.flight.airline}</h3>
                  <Badge variant="secondary">{booking.flight.flightNumber}</Badge>
                  <Badge variant={booking.bookingStatus === "confirmed" ? "default" : "destructive"}>
                    {booking.bookingStatus}
                  </Badge>
                </div>
                <p className="text-gray-600">Booking ID: {booking.id}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">₹{booking.totalPrice.toLocaleString()}</div>
                <div className="text-sm text-gray-500">
                  {booking.passengers.length} passenger{booking.passengers.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xl font-bold">{booking.flight.departureTime}</div>
                <div className="text-gray-600">{booking.flight.from}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">{booking.flight.duration}</div>
                <div className="text-sm text-gray-500">
                  {booking.flight.stops === 0
                    ? "Non-stop"
                    : `${booking.flight.stops} stop${booking.flight.stops > 1 ? "s" : ""}`}
                </div>
              </div>
              <div className="text-right md:text-left">
                <div className="text-xl font-bold">{booking.flight.arrivalTime}</div>
                <div className="text-gray-600">{booking.flight.to}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
              </span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
