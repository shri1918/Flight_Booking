"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface Booking {
  id: string
  userId: string
  flight: any
  passengers: any[]
  totalPrice: number
  paymentStatus: string
  bookingStatus: string
  createdAt: string
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = () => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    setBookings(savedBookings)
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flight.airline.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.bookingStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <p className="text-gray-600">View and manage all flight bookings</p>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">Booking #{booking.id}</h3>
                    <Badge variant={booking.bookingStatus === "confirmed" ? "default" : "destructive"}>
                      {booking.bookingStatus}
                    </Badge>
                    <Badge variant="secondary">{booking.paymentStatus}</Badge>
                  </div>
                  <p className="text-gray-600">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">₹{booking.totalPrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">
                    {booking.passengers.length} passenger{booking.passengers.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Flight Details */}
                <div>
                  <h4 className="font-semibold mb-2">Flight Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Airline:</span>
                      <span className="font-medium">{booking.flight.airline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flight:</span>
                      <span className="font-medium">{booking.flight.flightNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Route:</span>
                      <span className="font-medium">
                        {booking.flight.from} → {booking.flight.to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">
                        {booking.flight.departureTime} - {booking.flight.arrivalTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Passenger Details */}
                <div>
                  <h4 className="font-semibold mb-2">Passengers</h4>
                  <div className="space-y-1 text-sm">
                    {booking.passengers.map((passenger, index) => (
                      <div key={index} className="flex justify-between">
                        <span>Passenger {index + 1}:</span>
                        <span className="font-medium">
                          {passenger.firstName} {passenger.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found</p>
        </div>
      )}
    </div>
  )
}
